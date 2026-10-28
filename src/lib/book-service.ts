'use client'

import Dexie, { type Table } from 'dexie'
import { Book } from '@/lib/db'
import {
  getBackupDuplicateReport,
  LOCAL_BACKUP_FORMAT,
  LOCAL_BACKUP_VERSION,
  parseLocalBackup,
  type LocalBackup,
  type LocalBackupPerson,
  type LocalBackupUserBook,
} from '@/lib/local-backup'
import { generateId, nowISO } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const db = new Dexie('rose') as any
export { db }

export const BOOKS_CHANGED_EVENT = 'rose-books-changed'
export const SYNC_OUTBOX_CHANGED_EVENT = 'rose-sync-outbox-changed'

type SyncEntity = 'book' | 'person'
type SyncOperation = 'create' | 'update' | 'delete'

export interface SyncOutboxEntry {
  id: string
  operationId: string
  userId: string
  entity: SyncEntity
  entityId: string
  operation: SyncOperation
  revision: number
  payload: unknown
  status: 'pending' | 'processed' | 'failed' | 'conflict'
  attempts: number
  createdAt: string
  updatedAt?: string
  lastError?: string
  conflictData?: any
}

export interface LocalSyncState {
  userId: string
  lastAttemptAt?: string
  lastSuccessAt?: string
  cursor?: string
  lockId?: string
  lockExpiresAt?: number
}

let activeSyncUserId: string | null = null

export function setActiveSyncUser(userId: string | null) {
  activeSyncUserId = userId
}

function notifyBooksChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(BOOKS_CHANGED_EVENT))
    window.dispatchEvent(new Event(SYNC_OUTBOX_CHANGED_EVENT))
  }
}

async function enqueueChange(
  entity: SyncEntity,
  entityId: string,
  operation: SyncOperation,
  payload: unknown,
) {
  const userId = activeSyncUserId
  if (!userId) return

  const outbox = db.table('sync_outbox') as Table<SyncOutboxEntry, string>
  const previousEntries = await outbox
    .where('[userId+entity+entityId]')
    .equals([userId, entity, entityId])
    .toArray()
  const revision = previousEntries.reduce((max, entry) => Math.max(max, entry.revision), 0) + 1

  await outbox.add({
    id: generateId(),
    operationId: generateId(),
    userId,
    entity,
    entityId,
    operation,
    revision,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: nowISO(),
  })
}

db.version(1).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at'
})

db.version(2).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt, user_id, room, shelf, locationNotes, inventoryStatus',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at',
  sync_outbox: 'id, operationId, userId, [userId+status], [userId+entity+entityId], createdAt',
  sync_state: 'userId',
  books_user_id_idx: 'user_id',
})

db.version(3).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt, user_id, room, shelf, locationNotes, inventoryStatus',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at',
  sync_outbox: 'id, operationId, userId, [userId+status], [userId+entity+entityId], createdAt',
  sync_state: 'userId',
  books_user_id_idx: 'user_id',
  reading_sessions: 'id, user_id, book_id, date, start_time, end_time, pages_read, session_notes, created_at',
}).upgrade((tx: any) => {
  // Migration: Convert dailyLog to reading_sessions
  const booksTable = tx.table('books')
  const sessionsTable = tx.table('reading_sessions')
  return booksTable.toArray().then((books: any[]) => {
    const sessionEntries: any[] = []
    books.forEach(book => {
      const userId = book.user_id || 'legacy'
      if (book.dailyLog && Array.isArray(book.dailyLog)) {
        book.dailyLog.forEach((log: any) => {
          const sessionId = `${book.id}-${log.date}-${log.pagesRead || 0}`
          sessionEntries.push({
            id: sessionId,
            user_id: userId,
            book_id: book.id,
            date: log.date,
            start_time: null,
            end_time: null,
            pages_read: log.pagesRead || 0,
            session_notes: null,
            created_at: log.date || nowISO(),  // Use log date if available, fallback to now
          })
        })
      }
    })
    if (sessionEntries.length > 0) {
      return sessionsTable.bulkAdd(sessionEntries)
    }
  })
})

export const BookService = {
  async getAll(): Promise<Book[]> {
    const userId = activeSyncUserId
    return userId
      ? ((db as any).books.where('user_id').equals(userId).toArray() as Book[])
      : ((db as any).books.toArray() as Book[])
  },

  async getById(id: string): Promise<Book | undefined> {
    return (db as any).books.get(id)
  },

  async getPendingOutbox(userId: string): Promise<SyncOutboxEntry[]> {
    return (db.table('sync_outbox') as Table<SyncOutboxEntry, string>)
      .where('[userId+status]')
      .equals([userId, 'pending'])
      .sortBy('createdAt')
  },

  async getPendingOutboxCount(userId: string): Promise<number> {
    return (db.table('sync_outbox') as Table<SyncOutboxEntry, string>)
      .where('[userId+status]')
      .equals([userId, 'pending'])
      .count()
  },

  async getSyncState(userId: string): Promise<LocalSyncState | undefined> {
    return (db.table('sync_state') as Table<LocalSyncState, string>).get(userId)
  },

  async acquireSyncLock(userId: string, lockId: string, now = Date.now(), leaseMs = 60_000): Promise<boolean> {
    return db.transaction('rw', db.sync_state, async () => {
      const stateTable = db.table('sync_state') as Table<LocalSyncState, string>
      const state = await stateTable.get(userId)
      if (state?.lockId && state.lockId !== lockId && (state.lockExpiresAt ?? 0) > now) {
        return false
      }

      await stateTable.put({
        ...state,
        userId,
        lockId,
        lockExpiresAt: now + leaseMs,
        lastAttemptAt: new Date(now).toISOString(),
      })
      return true
    })
  },

  async releaseSyncLock(userId: string, lockId: string): Promise<void> {
    await db.transaction('rw', db.sync_state, async () => {
      const stateTable = db.table('sync_state') as Table<LocalSyncState, string>
      const state = await stateTable.get(userId)
      if (state?.lockId !== lockId) return
      await stateTable.put({ ...state, lockId: undefined, lockExpiresAt: undefined })
    })
  },

  async markSyncSucceeded(userId: string, cursor?: string): Promise<void> {
    const stateTable = db.table('sync_state') as Table<LocalSyncState, string>
    const state = await stateTable.get(userId)
    await stateTable.put({
      ...state,
      userId,
      lastSuccessAt: nowISO(),
      cursor,
    })
  },

  async recordOutbox(
    entity: SyncEntity,
    entityId: string,
    operation: SyncOperation,
    payload: unknown,
  ): Promise<void> {
    const userId = activeSyncUserId
    if (!userId) return

    const outbox = db.table('sync_outbox') as Table<SyncOutboxEntry, string>
    const previousEntries = await outbox
      .where('[userId+entity+entityId]')
      .equals([userId, entity, entityId])
      .toArray()
    const revision = previousEntries.reduce((max, entry) => Math.max(max, entry.revision), 0) + 1

    await outbox.add({
      id: generateId(),
      operationId: generateId(),
      userId,
      entity,
      entityId,
      operation,
      revision,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: nowISO(),
    })

    notifyBooksChanged()
  },

  async processOutbox(userId: string): Promise<{ success: boolean; processed: string[]; failed: string[] }> {
    const outbox = db.table('sync_outbox') as Table<SyncOutboxEntry, string>
    const pending = await outbox
      .where('[userId+status]')
      .equals([userId, 'pending'])
      .toArray()

    if (pending.length === 0) {
      return { success: true, processed: [], failed: [] }
    }

    const processedIds: string[] = []
    const failedIds: string[] = []

    for (const entry of pending) {
      try {
        const result = await this.processOutboxEntry(userId, entry)
        const now = nowISO()
        const attempts = (entry.attempts ?? 0) + 1

        if (result.success) {
          await outbox.update(entry.id, { status: 'processed', attempts, updatedAt: now })
          processedIds.push(entry.id)
        } else if (result.conflict) {
          await outbox.update(entry.id, { status: 'conflict', attempts, updatedAt: now, conflictData: result.conflictData })
          failedIds.push(entry.id)
        } else {
          const isRetryable = result.retryable && attempts < 3
          await outbox.update(entry.id, { status: isRetryable ? 'pending' : 'failed', attempts, updatedAt: now, lastError: result.error })
          if (!isRetryable) failedIds.push(entry.id)
        }
      } catch (error) {
        const attempts = (entry.attempts ?? 0) + 1
        await outbox.update(entry.id, { status: attempts < 3 ? 'pending' : 'failed', attempts, updatedAt: nowISO(), lastError: error instanceof Error ? error.message : 'Unknown error' })
        if (attempts >= 3) failedIds.push(entry.id)
      }
    }

    notifyBooksChanged()

    return {
      success: failedIds.length === 0,
      processed: processedIds,
      failed: failedIds,
    }
  },

  async processOutboxEntry(userId: string, entry: SyncOutboxEntry): Promise<{
    success: boolean
    conflict: boolean
    retryable: boolean
    error?: string
    conflictData?: any
    needsAuth?: boolean
  }> {
    // This would call the Supabase API in production
    // For now, we implement the contract with a mock that can be swapped

    const payload = entry.payload as any
    const operation = entry.operation
    const entity = entry.entity
    const entityId = entry.entityId
    const revision = entry.revision

    try {
      // Get user session for auth
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        // Distinguish between no session (needs login) and expired session (needs refresh)
        const { data: { session: refreshSession } } = await supabase.auth.refreshSession()
        if (!refreshSession?.user) {
          return { success: false, conflict: false, retryable: false, error: 'Not authenticated', needsAuth: true }
        }
        // Session refreshed, continue with new session
      }

      if (entity === 'book') {
        return await this.syncBookToSupabase(supabase, userId, operation, entityId, payload, revision)
      } else if (entity === 'person') {
        return await this.syncPersonToSupabase(supabase, userId, operation, entityId, payload, revision)
      } else if (entity === 'reading_log') {
        return await this.syncReadingLogToSupabase(supabase, userId, operation, entityId, payload, revision)
      }

      return { success: false, conflict: false, retryable: false, error: `Unknown entity: ${entity}` }
    } catch (error) {
      const err = error as Error
      // Network errors are retryable
      if (err.name === 'NetworkError' || err.message.includes('fetch') || err.message.includes('network')) {
        return { success: false, conflict: false, retryable: true, error: err.message }
      }
      return { success: false, conflict: false, retryable: false, error: err.message }
    }
  },

  async syncBookToSupabase(
    supabase: any,
    userId: string,
    operation: SyncOperation,
    entityId: string,
    payload: any,
    revision: number
  ): Promise<{ success: boolean; conflict: boolean; retryable: boolean; error?: string; conflictData?: any }> {
    if (operation === 'create') {
      const { data, error } = await supabase
        .from('user_books')
        .insert({
          user_id: userId,
          book_id: entityId,
          read_count: payload.read_count || 0,
          status: payload.status || 'want-to-read',
          progress: payload.progress || 0,
          rating: payload.rating,
          cover_image: payload.coverImage,
          notes: payload.notes,
          tags: payload.tags,
          added_at: payload.createdAt || (await (db as any).books.get(entityId))?.createdAt || nowISO(),
        })
        .select()

      if (error) {
        if (error.code === '23505') { // unique violation
          return { success: false, conflict: true, retryable: false, error: 'Duplicate shelf entry', conflictData: { remote: data, local: payload } }
        }
        return { success: false, conflict: false, retryable: true, error: error.message }
      }
      return { success: true, conflict: false, retryable: false }
    } else if (operation === 'update') {
      const { data, error } = await supabase
        .from('user_books')
        .update({
          read_count: payload.read_count,
          status: payload.status,
          progress: payload.progress,
          rating: payload.rating,
          cover_image: payload.coverImage,
          notes: payload.notes,
          tags: payload.tags,
          updated_at: nowISO(),
        })
        .eq('user_id', userId)
        .eq('book_id', entityId)
        .select()

      if (error) {
        return { success: false, conflict: false, retryable: true, error: error.message }
      }
      return { success: true, conflict: false, retryable: false }
    } else if (operation === 'delete') {
      const { error } = await supabase
        .from('user_books')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', entityId)

      if (error) {
        return { success: false, conflict: false, retryable: true, error: error.message }
      }
      return { success: true, conflict: false, retryable: false }
    }

    return { success: false, conflict: false, retryable: false, error: `Unknown operation: ${operation}` }
  },

  async syncPersonToSupabase(
    supabase: any,
    userId: string,
    operation: SyncOperation,
    entityId: string,
    payload: any,
    revision: number
  ): Promise<{ success: boolean; conflict: boolean; retryable: boolean; error?: string; conflictData?: any }> {
    // People sync - for now just log and succeed (people are shared catalog)
    // In production, this would sync to a user_people or similar table
    console.log('Sync person:', { operation, entityId, payload })
    return { success: true, conflict: false, retryable: false }
  },

  async syncReadingLogToSupabase(
    supabase: any,
    userId: string,
    operation: SyncOperation,
    entityId: string,
    payload: any,
    revision: number
  ): Promise<{ success: boolean; conflict: boolean; retryable: boolean; error?: string; conflictData?: any }> {
    if (operation === 'create') {
      const { error } = await supabase
        .from('reading_logs')
        .insert({
          user_id: userId,
          book_id: payload.book_id,
          log_date: payload.date,
          pages_read: payload.pages_read,
          status: payload.status,
        })

      if (error) {
        if (error.code === '23505') {
          return { success: false, conflict: true, retryable: false, error: 'Duplicate reading log', conflictData: { local: payload } }
        }
        return { success: false, conflict: false, retryable: true, error: error.message }
      }
      return { success: true, conflict: false, retryable: false }
    }

    return { success: false, conflict: false, retryable: false, error: `Unknown operation: ${operation}` }
  },

  async clearAllLocalData(): Promise<void> {
    await db.transaction('rw', db.books, db.user_books, db.people, db.sync_outbox, db.sync_state, async () => {
      await db.books.clear()
      await db.user_books.clear()
      await db.people.clear()
      await db.sync_outbox.clear()
      await db.sync_state.clear()
    })
    notifyBooksChanged()
  },

  async createLocalBackup(): Promise<string> {
    const ownerUserId = activeSyncUserId
    const { books, people, userBooks, readingSessions } = await db.transaction(
      'r',
      db.books,
      db.people,
      db.user_books,
      db.reading_sessions,
      async () => ({
        books: await db.books.toArray(),
        people: await db.people.toArray(),
        userBooks: ownerUserId
          ? await db.user_books.where('user_id').equals(ownerUserId).toArray()
          : [],
        readingSessions: ownerUserId
          ? await db.reading_sessions.where('user_id').equals(ownerUserId).toArray()
          : [],
      }),
    )
    if (activeSyncUserId !== ownerUserId) {
      throw new Error('The active account changed while the backup was being created. Please retry.')
    }

    // Include dailyLog (legacy reading sessions) from each book for history restore
    const booksWithDailyLog = books.map((book: any) => ({
      ...book,
      dailyLog: book.dailyLog || [],
    }))

    // Convert reading_sessions to backup format
    const backupSessions = readingSessions.map((s: any) => ({
      bookId: s.book_id,
      date: s.date,
      startTime: s.start_time,
      endTime: s.end_time,
      pagesRead: s.pages_read,
    }))

    const backup: LocalBackup = {
      format: LOCAL_BACKUP_FORMAT,
      version: LOCAL_BACKUP_VERSION,
      createdAt: nowISO(),
      ownerUserId: activeSyncUserId ?? undefined,
      data: { books: booksWithDailyLog, people, userBooks, readingSessions: backupSessions },
    }

    return JSON.stringify(parseLocalBackup(JSON.stringify(backup)), null, 2)
  },

  async previewLocalBackup(contents: string) {
    const currentUserId = activeSyncUserId
    const backup = parseLocalBackup(contents)
    if (backup.ownerUserId && backup.ownerUserId !== currentUserId) {
      throw new Error('This backup belongs to a different account. Sign in to that account before restoring it.')
    }

    const [books, people, userBooks] = await Promise.all([
      db.books.toArray(),
      db.people.toArray(),
      db.user_books.toArray(),
    ])

    if (activeSyncUserId !== currentUserId) {
      throw new Error('The active account changed while the backup was being checked. Please retry.')
    }

    return {
      backup,
      report: getBackupDuplicateReport(backup, { books, people, userBooks }),
    }
  },

  async restoreLocalBackup(backup: LocalBackup) {
    const currentUserId = activeSyncUserId
    const validatedBackup = parseLocalBackup(JSON.stringify(backup))
    if (validatedBackup.ownerUserId && validatedBackup.ownerUserId !== currentUserId) {
      throw new Error('This backup belongs to a different account. Sign in to that account before restoring it.')
    }

    if (
      validatedBackup.data.userBooks.some((entry) => entry.user_id !== currentUserId) ||
      (!currentUserId && validatedBackup.data.userBooks.length > 0)
    ) {
      throw new Error('Shelf entries in this backup do not belong to the signed-in account.')
    }

    const result = await db.transaction(
      'rw',
      db.books,
      db.people,
      db.user_books,
      db.reading_sessions,
      async () => {
        if (activeSyncUserId !== currentUserId) {
          throw new Error('The active account changed during restore. No backup data was restored.')
        }

        const [existingBooks, existingPeople, existingUserBooks, existingSessions] = await Promise.all([
          db.books.toArray(),
          db.people.toArray(),
          db.user_books.toArray(),
          db.reading_sessions.toArray(),
        ])
        if (activeSyncUserId !== currentUserId) {
          throw new Error('The active account changed during restore. No backup data was restored.')
        }

        const bookIds = new Set(existingBooks.map((book: Book) => book.id))
        const peopleIds = new Set(existingPeople.map((person: LocalBackupPerson) => person.id))
        const shelfIds = new Set(existingUserBooks.map((entry: LocalBackupUserBook) => entry.id))
        const sessionIds = new Set<string>(existingSessions.map((s: any) => s.id))

        const booksToAdd = validatedBackup.data.books.filter((book) => !bookIds.has(book.id))
        const peopleToAdd = validatedBackup.data.people.filter((person) => !peopleIds.has(person.id))
        const userBooksToAdd = validatedBackup.data.userBooks.filter((entry) => !shelfIds.has(entry.id))

        const availableBookIds = new Set([...bookIds, ...booksToAdd.map((book) => book.id)])
        if (userBooksToAdd.some((entry) => !availableBookIds.has(entry.book_id))) {
          throw new Error('Backup contains shelf entries for books that are not available to restore.')
        }

        await db.books.bulkAdd(booksToAdd)
        await db.people.bulkAdd(peopleToAdd)
        await db.user_books.bulkAdd(userBooksToAdd)

        // Restore reading sessions
        const readingSessions = validatedBackup.data.readingSessions || []
        if (readingSessions.length > 0) {
          const sessionEntries = readingSessions
            .filter((s: any) => {
              const baseId = s.bookId + '-' + s.date + '-' + (s.pagesRead || 0)
              // Check if any session with this base ID exists (handles new format with suffix)
              for (const existingId of sessionIds) {
                if (existingId.startsWith(baseId)) return false
              }
              return true
            })
            .map((s: any) => {
              const baseId = s.bookId + '-' + s.date + '-' + (s.pagesRead || 0)
              const startSuffix = s.startTime ? `-${s.startTime.replace(/[:.]/g, '')}` : `-${generateId().slice(0, 8)}`
              return {
                id: baseId + startSuffix,
                user_id: currentUserId || 'legacy',
                book_id: s.bookId,
                date: s.date,
                start_time: s.startTime,
                end_time: s.endTime,
                pages_read: s.pagesRead || 0,
                session_notes: null,
                created_at: nowISO(),
              }
            })
          if (sessionEntries.length > 0) {
            await db.reading_sessions.bulkAdd(sessionEntries)
          }

          // Also update dailyLog for backward compatibility
          await db.transaction('rw', db.books, async () => {
            for (const session of readingSessions) {
              const bookId = session.bookId
              const book = await (db as any).books.get(bookId)
              if (book) {
                const existingLog = book.dailyLog || []
                const existingIndex = existingLog.findIndex((log: any) => log.date === session.date)
                let updatedLog
                if (existingIndex >= 0) {
                  updatedLog = [...existingLog]
                  updatedLog[existingIndex] = { ...updatedLog[existingIndex], pagesRead: session.pagesRead }
                } else {
                  updatedLog = [...existingLog, { date: session.date, pagesRead: session.pagesRead }]
                }
                await (db as any).books.put({ ...book, dailyLog: updatedLog })
              }
            }
          })
        }

        return {
          imported: {
            books: booksToAdd.length,
            people: peopleToAdd.length,
            userBooks: userBooksToAdd.length,
          },
          skipped: {
            books: validatedBackup.data.books.length - booksToAdd.length,
            people: validatedBackup.data.people.length - peopleToAdd.length,
            userBooks: validatedBackup.data.userBooks.length - userBooksToAdd.length,
          },
        }
      },
    )

    notifyBooksChanged()
    return result
  },

  async createPerson(person: any): Promise<string> {
    const id = generateId()
    const now = nowISO()
    const record = {
      ...person,
      id,
      sort_name: person.sort_name || person.last_name || '',
      created_at: now,
      updated_at: now,
    }
    await db.transaction('rw', db.people, db.sync_outbox, async () => {
      await (db as any).people.add(record)
      await enqueueChange('person', id, 'create', record)
    })
    notifyBooksChanged()
    return id
  },

  async getPeople(): Promise<any[]> {
    return (db as any).people.toArray()
  },

  async deletePerson(id: string): Promise<void> {
    await db.transaction('rw', db.people, db.sync_outbox, async () => {
      const person = await (db as any).people.get(id)
      if (!person) return
      await enqueueChange('person', id, 'delete', { id })
      await (db as any).people.delete(id)
    })
    notifyBooksChanged()
  },

  async checkDuplicates(isbn10?: string, isbn13?: string, title?: string, author?: string): Promise<{ isbn: boolean; titleAuthor: boolean }> {
    const books = await this.getAll()
    let isbn = false
    let titleAuthor = false

    if (isbn13) {
      isbn = books.some((b) => b.isbn13 === isbn13)
    }
    if (!isbn && isbn10) {
      isbn = books.some((b) => b.isbn10 === isbn10)
    }

    if (title && author) {
      titleAuthor = books.some((b) =>
        b.title.toLowerCase() === title.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase()
      )
    }

    return { isbn, titleAuthor }
  },

  async search(filters: {
    query?: string
    status?: 'want-to-read' | 'reading' | 'read' | 'on-hold' | 'dnf'
    genre?: string
    minProgress?: number
    maxProgress?: number
  }): Promise<Book[]> {
    let books = await this.getAll()

    if (filters.query) {
      const q = filters.query.toLowerCase()
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
    }

    if (filters.status) {
      books = books.filter((b) => b.status === filters.status)
    }

    if (filters.genre) {
      books = books.filter((b) => b.genre === filters.genre)
    }

    if (filters.minProgress !== undefined) {
      books = books.filter((b) => (b.progress ?? 0) >= (filters.minProgress ?? 0))
    }

    if (filters.maxProgress !== undefined) {
      books = books.filter((b) => (b.progress ?? 0) <= (filters.maxProgress ?? 100))
    }

    return books
  },

  // Physical copy / inventory methods
  async getPhysicalCopies(): Promise<Book[]> {
    const books = await this.getAll()
    return books.filter((b) =>
      b.room || b.shelf || b.locationNotes || b.inventoryStatus
    )
  },

  async updatePhysicalLocation(
    id: string,
    updates: Pick<Book, 'room' | 'shelf' | 'locationNotes' | 'inventoryStatus'>
  ): Promise<void> {
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) throw new Error(`Book ${id} was not found`)
      const updated = { ...existing, ...updates, updatedAt: nowISO() }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async getInventorySummary(): Promise<{
    total: number
    byStatus: Record<string, number>
    byLocation: Record<string, number>
  }> {
    const books = await this.getAll()

    const byStatus: Record<string, number> = {}
    const byLocation: Record<string, number> = {}
    let total = 0

    for (const b of books) {
      const hasLocation = b.room || b.shelf || b.locationNotes || b.inventoryStatus
      if (!hasLocation) continue
      total++
      const status = b.inventoryStatus || 'unknown'
      byStatus[status] = (byStatus[status] || 0) + 1
      const loc = b.shelf || b.room || 'unspecified'
      byLocation[loc] = (byLocation[loc] || 0) + 1
    }

    return { total, byStatus, byLocation }
  },

  // Reading sessions methods
  async getReadingSessions(userId: string, bookId?: string): Promise<any[]> {
    let query = db.reading_sessions.where('user_id').equals(userId)
    if (bookId) {
      query = query.filter((s: any) => s.book_id === bookId)
    }
    return query.sortBy('date')
  },

  async addReadingSession(session: {
    user_id: string
    book_id: string
    date: string
    start_time?: string | null
    end_time?: string | null
    pages_read: number
    session_notes?: string | null
  }): Promise<string> {
    const startSuffix = session.start_time ? `-${session.start_time.replace(/[:.]/g, '')}` : `-${generateId().slice(0, 8)}`
    const id = `${session.book_id}-${session.date}-${session.pages_read}${startSuffix}`
    const record = {
      ...session,
      id,
      created_at: nowISO(),
    }
    await db.reading_sessions.add(record)
    return id
  },

  async updateReadingSession(id: string, updates: Partial<any>): Promise<void> {
    await db.reading_sessions.update(id, updates)
  },

  async deleteReadingSession(id: string): Promise<void> {
    await db.reading_sessions.delete(id)
  },

  async create(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userId = activeSyncUserId
    const id = generateId()
    const now = nowISO()
    const record = {
      ...book,
      id,
      createdAt: now,
      updatedAt: now,
      ...(userId && { user_id: userId }),
    }

    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      await (db as any).books.add(record)
      await enqueueChange('book', id, 'create', record)
    })
    notifyBooksChanged()
    return id
  },

  async update(id: string, updates: Partial<Book>): Promise<void> {
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) throw new Error(`Book ${id} was not found`)
      // Preserve user_id when updating
      const updated = { ...existing, ...updates, updatedAt: nowISO() }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async delete(id: string): Promise<void> {
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) return
      await enqueueChange('book', id, 'delete', { id })
      await db.books.delete(id)
    })
    notifyBooksChanged()
  },

  async updateProgress(id: string, progress: number): Promise<void> {
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) throw new Error(`Book ${id} was not found`)
      const updated = { ...existing, progress, updatedAt: nowISO() }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async updateStatus(id: string, status: 'want-to-read' | 'reading' | 'read' | 'on-hold' | 'dnf'): Promise<void> {
    const book = await (db as any).books.get(id)
    if (!book) return
    const now = nowISO()
    const updates: any = { status, updatedAt: now }
    if (status === 'reading' && !book.startedAt) updates.startedAt = now
    if (status === 'read' && !book.finishedAt) updates.finishedAt = now
    if (status === 'want-to-read') { updates.startedAt = null; updates.finishedAt = null }
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const updated = { ...book, ...updates }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async addDailyLog(id: string, date: string, pagesRead: number): Promise<void> {
    const book = await (db as any).books.get(id)
    if (!book) return

    const currentLog = book.dailyLog || []
    const existingIndex = currentLog.findIndex((log: any) => log.date === date)

    let updatedLog
    if (existingIndex >= 0) {
      // Update existing log entry
      updatedLog = [...currentLog]
      updatedLog[existingIndex] = { ...updatedLog[existingIndex], pagesRead: updatedLog[existingIndex].pagesRead + pagesRead }
    } else {
      // Add new log entry
      updatedLog = [...currentLog, { date, pagesRead }]
    }

    // Calculate total pages read
    const totalPagesRead = updatedLog.reduce((sum: number, log: any) => sum + (log.pagesRead || 0), 0)

    // Calculate progress if book has total pages
    let progress = book.progress || 0
    if (book.pages && book.pages > 0) {
      progress = Math.min(100, Math.round((totalPagesRead / book.pages) * 100))
    }

    // Determine status changes
    let status = book.status
    let startedAt = book.startedAt
    let finishedAt = book.finishedAt
    const now = nowISO()

    // First log -> mark as reading
    if (status === 'want-to-read' && currentLog.length === 0) {
      status = 'reading'
      startedAt = now
    }

    // Progress reaches 100% -> mark as read
    if (progress >= 100 && status !== 'read') {
      status = 'read'
      finishedAt = now
    }

    // Update all fields
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const updated = {
        ...book,
        dailyLog: updatedLog,
        progress,
        status,
        startedAt,
        finishedAt,
        updatedAt: nowISO(),
      }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

}
