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
  status: 'pending' | 'processed' | 'failed'
  attempts: number
  createdAt: string
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
    id: crypto.randomUUID(),
    operationId: crypto.randomUUID(),
    userId,
    entity,
    entityId,
    operation,
    revision,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString(),
  })
}

db.version(1).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at'
})

db.version(2).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at',
  sync_outbox: 'id, operationId, userId, [userId+status], [userId+entity+entityId], createdAt',
  sync_state: 'userId',
})

export const BookService = {
  async getAll(): Promise<Book[]> {
    return (db as any).books.toArray()
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
      lastSuccessAt: new Date().toISOString(),
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
      id: crypto.randomUUID(),
      operationId: crypto.randomUUID(),
      userId,
      entity,
      entityId,
      operation,
      revision,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
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
        // Mark as processed immediately to prevent re-processing
        await outbox.update(entry.id, {
          status: 'processed',
          attempts: (entry.attempts ?? 0) + 1,
        })
        processedIds.push(entry.id)
      } catch (error) {
        await outbox.update(entry.id, {
          status: 'failed',
          attempts: (entry.attempts ?? 0) + 1,
        })
        failedIds.push(entry.id)
      }
    }

    notifyBooksChanged()

    return {
      success: failedIds.length === 0,
      processed: processedIds,
      failed: failedIds,
    }
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
    const { books, people, userBooks } = await db.transaction(
      'r',
      db.books,
      db.people,
      db.user_books,
      async () => ({
        books: await db.books.toArray(),
        people: await db.people.toArray(),
        userBooks: ownerUserId
          ? await db.user_books.where('user_id').equals(ownerUserId).toArray()
          : [],
      }),
    )
    if (activeSyncUserId !== ownerUserId) {
      throw new Error('The active account changed while the backup was being created. Please retry.')
    }

    const backup: LocalBackup = {
      format: LOCAL_BACKUP_FORMAT,
      version: LOCAL_BACKUP_VERSION,
      createdAt: new Date().toISOString(),
      ownerUserId: activeSyncUserId ?? undefined,
          data: { books, people, userBooks, readingSessions: [] },
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
      async () => {
        if (activeSyncUserId !== currentUserId) {
          throw new Error('The active account changed during restore. No backup data was restored.')
        }

        const [existingBooks, existingPeople, existingUserBooks] = await Promise.all([
          db.books.toArray(),
          db.people.toArray(),
          db.user_books.toArray(),
        ])
        if (activeSyncUserId !== currentUserId) {
          throw new Error('The active account changed during restore. No backup data was restored.')
        }

        const bookIds = new Set(existingBooks.map((book: Book) => book.id))
        const peopleIds = new Set(existingPeople.map((person: LocalBackupPerson) => person.id))
        const shelfIds = new Set(existingUserBooks.map((entry: LocalBackupUserBook) => entry.id))

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
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
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

  async create(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const record = {
      ...book,
      id,
      createdAt: now,
      updatedAt: now,
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
      const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() }
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
      const updated = { ...existing, progress, updatedAt: new Date().toISOString() }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

  async updateStatus(id: string, status: 'want-to-read' | 'reading' | 'read' | 'on-hold' | 'dnf'): Promise<void> {
    const book = await (db as any).books.get(id)
    if (!book) return
    const now = new Date().toISOString()
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
    const now = new Date().toISOString()

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
        updatedAt: new Date().toISOString(),
      }
      await enqueueChange('book', id, 'update', updated)
      await db.books.put(updated)
    })
    notifyBooksChanged()
  },

}
