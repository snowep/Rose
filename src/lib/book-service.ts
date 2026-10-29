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
  if (!userId) throw new Error('No active sync user - cannot enqueue change. Call setActiveSyncUser first.')

  const outbox = db.table('sync_outbox') as Table<SyncOutboxEntry, string>
  await db.transaction('rw', outbox, async () => {
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
})

db.version(4).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt, user_id, room, shelf, locationNotes, inventoryStatus',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at',
  sync_outbox: 'id, operationId, userId, [userId+status], [userId+entity+entityId], createdAt',
  sync_state: 'userId',
  books_user_id_idx: 'user_id',
  reading_sessions: 'id, user_id, book_id, date, start_time, end_time, pages_read, session_notes, created_at, [user_id+book_id]',
  book_covers: 'id, book_id, user_id, mime, data, created_at',
}).upgrade(async (tx: any) => {
  // Migration v3->v4: Convert dailyLog to reading_sessions, add book_covers table
  const booksTable = tx.table('books')
  const sessionsTable = tx.table('reading_sessions')
  const books = await booksTable.toArray()
  const sessionEntries: any[] = []
  books.forEach((book: any) => {
    const userId = book.user_id || '00000000-0000-0000-0000-000000000001'
    if (book.dailyLog && Array.isArray(book.dailyLog)) {
      book.dailyLog.forEach((log: any) => {
        const sessionId = `${book.id}-${log.date}-${log.pagesRead || 0}-${generateId()}`
        sessionEntries.push({
          id: sessionId,
          user_id: userId,
          book_id: book.id,
          date: log.date,
          start_time: log.startTime || null,
          end_time: log.endTime || null,
          pages_read: log.pagesRead || 0,
          session_notes: null,
          created_at: log.date ? new Date(log.date).toISOString() : nowISO(),
        })
      })
    }
  })
  if (sessionEntries.length > 0) {
    await sessionsTable.bulkAdd(sessionEntries)
  }
  // Assign legacy user_id to books that don't have one
  const legacyBooks = books.filter((b: any) => !b.user_id)
  if (legacyBooks.length > 0) {
    await Promise.all(legacyBooks.map((b: any) => booksTable.update(b.id, { user_id: '00000000-0000-0000-0000-000000000001' })))
  }
})

export const BookService = {
  async getAll(): Promise<Book[]> {
    const userId = activeSyncUserId
    if (!userId) return []
    return ((db as any).books.where('user_id').equals(userId).toArray() as Book[])
  },

  async getById(id: string): Promise<Book | undefined> {
    const userId = activeSyncUserId
    if (!userId) return undefined
    const book = await (db as any).books.get(id)
    return book?.user_id === userId ? book : undefined
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

  async acquireSyncLock(userId: string, lockId: string, leaseMs = 60_000): Promise<boolean> {
    // Use server time to avoid client clock skew
    const supabase = createClient()
    const { data: serverTime } = await supabase.rpc('get_server_time')
    const now = serverTime ? new Date(serverTime).getTime() : Date.now()

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
    if (!userId) throw new Error('No active sync user - cannot record outbox entry. Call setActiveSyncUser first.')

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
    const lockId = generateId()
    const acquired = await this.acquireSyncLock(userId, lockId)
    if (!acquired) {
      return { success: false, processed: [], failed: [] }
    }

    const outbox = db.table('sync_outbox') as Table<SyncOutboxEntry, string>
    const pending = await outbox
      .where('[userId+status]')
      .equals([userId, 'pending'])
      .toArray()

    if (pending.length === 0) {
      await this.releaseSyncLock(userId, lockId)
      return { success: true, processed: [], failed: [] }
    }

    const supabase = createClient()
    const processedIds: string[] = []
    const failedIds: string[] = []

    for (const entry of pending) {
      try {
        const result = await this.processOutboxEntry(supabase, userId, entry)
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
    await this.releaseSyncLock(userId, lockId)

    return {
      success: failedIds.length === 0,
      processed: processedIds,
      failed: failedIds,
    }
  },

  async processOutboxEntry(supabase: any, userId: string, entry: SyncOutboxEntry): Promise<{
    success: boolean
    conflict: boolean
    retryable: boolean
    error?: string
    conflictData?: any
    needsAuth?: boolean
  }> {
    const payload = entry.payload as any
    const operation = entry.operation
    const entity = entry.entity
    const entityId = entry.entityId
    const revision = entry.revision

    try {
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
    // Check if book is catalogued (has ISBN) - if not, create catalog submission
    const localBook = await (db as any).books.get(entityId)
    const hasCatalog = localBook?.isbn13 || localBook?.isbn10
    const isbn13 = payload.isbn13 || localBook?.isbn13
    const isbn10 = payload.isbn10 || localBook?.isbn10

    // Helper: resolve remote book_id via ISBN when available
    async function resolveRemoteBookId(): Promise<string | null> {
      if (!isbn13 && !isbn10) return null
      const { data } = await supabase
        .from('books')
        .select('id')
        .or(`isbn13.eq.${isbn13},isbn10.eq.${isbn10}`)
        .maybeSingle()
      return data?.id ?? null
    }

    if (operation === 'create') {
      if (!hasCatalog) {
        // Create catalog submission for uncatalogued book
        const { error } = await supabase.from('catalog_submissions').insert({
          user_id: userId,
          title: payload.title || localBook?.title,
          subtitle: payload.subtitle || localBook?.subtitle,
          author: payload.author || localBook?.author,
          isbn13: payload.isbn13 || localBook?.isbn13,
          publisher: payload.publisher || localBook?.publisher,
          genre: payload.genre || localBook?.genre,
          status: 'pending',
        })
        if (error) {
          return { success: false, conflict: false, retryable: true, error: error.message }
        }
        // Still create user_books entry with a temporary book_id
        const { data, error: userBookError } = await supabase
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
            added_at: payload.createdAt || localBook?.createdAt || nowISO(),
          })
          .select()
        if (userBookError) {
          return { success: false, conflict: false, retryable: true, error: userBookError.message }
        }
      } else {
        // Catalogued book - sync to user_books
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
            added_at: payload.createdAt || localBook?.createdAt || nowISO(),
          })
          .select()

        if (error) {
          if (error.code === '23505') { // unique violation
            // Try to find the existing remote book by ISBN to get its real ID
            const remoteBookId = await resolveRemoteBookId()
            return { success: false, conflict: true, retryable: false, error: 'Duplicate shelf entry', conflictData: { remoteBookId, local: payload } }
          }
          return { success: false, conflict: false, retryable: true, error: error.message }
        }
        if (!data) return { success: false, conflict: false, retryable: true, error: 'Insert returned no data' }
        return { success: true, conflict: false, retryable: false }
      }
    }

    if (operation === 'update' || operation === 'delete') {
      // For catalogued books, try to resolve the remote book_id via ISBN
      let remoteBookId = entityId
      if (hasCatalog) {
        const resolved = await resolveRemoteBookId()
        if (resolved) remoteBookId = resolved
      }

      if (operation === 'update') {
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
          .eq('book_id', remoteBookId)
          .select()
        if (error) {
          return { success: false, conflict: false, retryable: true, error: error.message }
        }
        if (!data || data.length === 0) {
          return { success: false, conflict: false, retryable: false, error: 'Update affected zero rows' }
        }
        return { success: true, conflict: false, retryable: false }
      } else if (operation === 'delete') {
        const { data, error } = await supabase
          .from('user_books')
          .delete()
          .eq('user_id', userId)
          .eq('book_id', remoteBookId)
          .select()

        if (error) {
          return { success: false, conflict: false, retryable: true, error: error.message }
        }
        // Delete is idempotent - zero rows is OK (already deleted)
        return { success: true, conflict: false, retryable: false }
      }
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
    // People are shared catalog - moderator controlled
    // For now, create catalog submission for new people
    // Strip sensitive PII fields before storing in catalog_submissions.notes
    const safePayload = {
      id: payload.id,
      name: payload.name,
      sortName: payload.sortName,
      // Exclude: birthDate, deathDate, nationality, biography, website, photoUrl, verifiedStatus
    }

    if (operation === 'create') {
      const { error } = await supabase.from('catalog_submissions').insert({
        user_id: userId,
        title: `Person: ${payload.name}`,
        status: 'pending',
        notes: JSON.stringify(safePayload),
      })
      if (error) {
        return { success: false, conflict: false, retryable: true, error: error.message }
      }
    } else if (operation === 'update' || operation === 'delete') {
      // Person updates/deletes are moderator-controlled catalog operations
      // Create catalog submission for review
      const { error } = await supabase.from('catalog_submissions').insert({
        user_id: userId,
        title: `Person ${operation}: ${payload.name || entityId}`,
        status: 'pending',
        notes: JSON.stringify({ operation, entityId, payload: safePayload }),
      })
      if (error) {
        return { success: false, conflict: false, retryable: true, error: error.message }
      }
    }
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
    if (!ownerUserId) throw new Error('No active user for backup')
    const { books, people, userBooks, readingSessions } = await db.transaction(
      'r',
      db.books,
      db.people,
      db.user_books,
      db.reading_sessions,
      async () => ({
        books: await db.books.where('user_id').equals(ownerUserId).toArray(),
        people: await db.people.toArray(),
        userBooks: await db.user_books.where('user_id').equals(ownerUserId).toArray(),
        readingSessions: await db.reading_sessions.where('user_id').equals(ownerUserId).toArray(),
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
    if (!currentUserId) {
      throw new Error('No active account. Sign in before restoring a backup.')
    }
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
    // Validate books ownership
    if (validatedBackup.data.books.some((b: any) => b.user_id && b.user_id !== currentUserId && currentUserId)) {
      throw new Error('Books in this backup do not belong to the signed-in account.')
    }
    // Validate people ownership if user_id field exists
    if (validatedBackup.data.people.some((p: any) => p.user_id && p.user_id !== currentUserId && currentUserId)) {
      throw new Error('People in this backup do not belong to the signed-in account.')
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
              const sessionId = `${s.bookId}-${s.date}-${s.pagesRead || 0}-${s.startTime || 'nostart'}`
              return !sessionIds.has(sessionId)
            })
            .map((s: any) => {
              const sessionId = `${s.bookId}-${s.date}-${s.pagesRead || 0}-${s.startTime || generateId()}`
              return {
                id: sessionId,
                user_id: currentUserId,
                book_id: s.bookId,
                date: s.date,
                start_time: s.startTime || null,
                end_time: s.endTime || null,
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
    const userId = activeSyncUserId
    if (!userId) throw new Error('No active user')
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) throw new Error(`Book ${id} was not found`)
      if (existing.user_id !== userId) throw new Error(`Book ${id} does not belong to active user`)
      // Preserve user_id when updating
      const updated = { ...existing, ...updates, updatedAt: nowISO() }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async delete(id: string): Promise<void> {
    const userId = activeSyncUserId
    if (!userId) throw new Error('No active user')
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) return
      if (existing.user_id !== userId) throw new Error(`Book ${id} does not belong to active user`)
      await enqueueChange('book', id, 'delete', { id })
      await db.books.delete(id)
    })
    notifyBooksChanged()
  },

  async updateProgress(id: string, progress: number): Promise<void> {
    const userId = activeSyncUserId
    if (!userId) throw new Error('No active user')
    await db.transaction('rw', db.books, db.sync_outbox, async () => {
      const existing = await (db as any).books.get(id)
      if (!existing) throw new Error(`Book ${id} was not found`)
      if (existing.user_id !== userId) throw new Error(`Book ${id} does not belong to active user`)
      const updated = { ...existing, progress, updatedAt: nowISO() }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async updateStatus(id: string, status: 'want-to-read' | 'reading' | 'read' | 'on-hold' | 'dnf'): Promise<void> {
    const userId = activeSyncUserId
    if (!userId) throw new Error('No active user')
    const book = await (db as any).books.get(id)
    if (!book) return
    if (book.user_id !== userId) throw new Error(`Book ${id} does not belong to active user`)
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
    const userId = activeSyncUserId
    if (!userId) throw new Error('No active user')
    const book = await (db as any).books.get(id)
    if (!book) return
    if (book.user_id !== userId) throw new Error(`Book ${id} does not belong to active user`)

    // Migration guard: ensure reading_sessions table exists (v3->v4 migration complete)
    // If dailyLog is still being used, the migration may not have run yet
    // Fall back to dailyLog approach if reading_sessions table doesn't exist
    let useReadingSessions = true
    try {
      await db.reading_sessions.limit(1).toArray()
    } catch {
      useReadingSessions = false
    }

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
    await db.transaction('rw', db.books, db.sync_outbox, db.reading_sessions, async () => {
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

      // Also create/update reading_sessions entry for new unified history
      if (useReadingSessions) {
        const sessionId = `${book.id}-${date}-${pagesRead}-${generateId().slice(0, 8)}`
        const existingSessions = await db.reading_sessions
          .where('[user_id+book_id+date]')
          .equals([userId, book.id, date])
          .toArray()
        if (existingSessions.length > 0) {
          const existing = existingSessions[0]
          await db.reading_sessions.update(existing.id, {
            pages_read: existing.pages_read + pagesRead,
            end_time: null,
          })
        } else {
          await db.reading_sessions.add({
            id: sessionId,
            user_id: userId,
            book_id: book.id,
            date,
            start_time: null,
            end_time: null,
            pages_read: pagesRead,
            session_notes: null,
            created_at: now,
          })
        }
      }
    })
    notifyBooksChanged()
  },

}
