'use client'

import Dexie from 'dexie'
import { Book } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'

const db = new Dexie('rose') as any
export { db }

export const BOOKS_CHANGED_EVENT = 'rose-books-changed'

function toSupabaseCatalogBook(book: Partial<Book>) {
  const catalogBook: Record<string, unknown> = {
    id: book.id,
    title: book.title,
  }

  if (book.subtitle !== undefined) catalogBook.subtitle = book.subtitle
  if (book.isbn10 !== undefined) catalogBook.isbn10 = book.isbn10
  if (book.isbn13 !== undefined) catalogBook.isbn13 = book.isbn13
  if (book.publicationYear !== undefined) catalogBook.publication_year = book.publicationYear
  if (book.description !== undefined) catalogBook.description = book.description

  return catalogBook
}

db.version(1).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt',
  user_books: 'id, user_id, book_id, read_count, added_at',
  people: 'id, name, sort_name, first_name, middle_name, last_name, nationality, birth_year, death_year, biography, website, photo_url, created_at, updated_at'
})

async function syncBookToSupabase(book: Book) {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('books')
      .upsert({
        id: book.id,
        title: book.title,
        author: book.author,
        status: book.status,
        genre: book.genre,
        rating: book.rating,
        pages: book.pages,
        progress: book.progress,
        started_at: book.startedAt,
        finished_at: book.finishedAt,
        cover_image: book.coverImage,
        notes: book.notes,
        tags: book.tags,
        daily_log: book.dailyLog,
        created_at: book.createdAt,
        updated_at: book.updatedAt,
      })
    if (error) console.error('Supabase sync error:', error)
  } catch (err) {
    console.error('Supabase sync exception:', err)
  }
}

async function syncBookDeleteFromSupabase(id: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) console.error('Supabase delete sync error:', error)
  } catch (err) {
    console.error('Supabase delete sync exception:', err)
  }
}

export const BookService = {
  async getAll(): Promise<Book[]> {
    return (db as any).books.toArray()
  },

  async getById(id: string): Promise<Book | undefined> {
    return (db as any).books.get(id)
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
    await (db as any).people.add(record)
    return id
  },

  async getPeople(): Promise<any[]> {
    return (db as any).people.toArray()
  },

  async deletePerson(id: string): Promise<void> {
    await (db as any).people.delete(id)
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

    await (db as any).books.add(record)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(BOOKS_CHANGED_EVENT))
    }
    return id
  },

  async update(id: string, updates: Partial<Book>): Promise<void> {
    await db.books.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    await db.books.delete(id)
  },

  async updateProgress(id: string, progress: number): Promise<void> {
    await db.books.update(id, {
      progress,
      updatedAt: new Date().toISOString(),
    })
  },

  async updateStatus(id: string, status: 'want-to-read' | 'reading' | 'read' | 'on-hold' | 'dnf'): Promise<void> {
    const book = await (db as any).books.get(id)
    if (!book) return
    const now = new Date().toISOString()
    const updates: any = { status, updatedAt: now }
    if (status === 'reading' && !book.startedAt) updates.startedAt = now
    if (status === 'read' && !book.finishedAt) updates.finishedAt = now
    if (status === 'want-to-read') { updates.startedAt = null; updates.finishedAt = null }
    await db.books.update(id, updates)
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
    await db.books.update(id, {
      dailyLog: updatedLog,
      progress,
      status,
      startedAt,
      finishedAt,
      updatedAt: new Date().toISOString(),
    })
  },

  // === Supabase sync functions ===

  // Sync people from local Dexie to Supabase
  async syncPeopleToSupabase(userId: string): Promise<void> {
    try {
      const localPeople = await this.getPeople()
      const supabase = createClient()

      for (const person of localPeople) {
        try {
          await supabase
            .from('people')
            .upsert({
              id: person.id,
              name: person.full_name || `${person.first_name} ${person.last_name || ''}`.trim() || 'Unknown',
              sort_name: person.sort_name || person.last_name || '',
            })
        } catch (err) {
          console.error(`Person sync error for ${person.id}:`, err)
        }
      }
    } catch (err) {
      console.error('People sync failed:', err)
    }
  },

  // Sync publishers from local Dexie to Supabase
  async syncPublishersToSupabase(userId: string): Promise<void> {
    try {
      const supabase = createClient()
      // Get unique publishers directly from local books
      const localBooks = await this.getAll()
      const publisherSet = new Set(
        localBooks
          ?.map((book: any) => book.author)
          .filter(Boolean) || []
      )

      for (const name of publisherSet) {
        try {
          await supabase
            .from('publishers')
            .upsert({ name })
        } catch (err) {
          console.error(`Publisher sync error for ${name}:`, err)
        }
      }
    } catch (err) {
      console.error('Publishers sync failed:', err)
    }
  },

  // Upsert user_books shelf entry with status enum and onConflict
  async upsertUserBook(userId: string, bookId: string, book: any) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_books')
        .upsert({
          user_id: userId,
          book_id: bookId,
          progress: book.progress ?? 0,
          rating: book.rating,
          cover_image: book.coverImage,
          notes: book.notes,
          tags: book.tags,
          status: book.status, // enum: want-to-read | reading | read | on-hold | dnf
        }, { onConflict: 'user_id,book_id' })
      if (error) console.error('User book upsert error:', error)
    } catch (err) {
      console.error('User book upsert exception:', err)
    }
  },

  // Upsert reading logs with log_date for heatmap
  async upsertReadingLogs(userId: string, bookId: string, dailyLog: any[]) {
    try {
      const supabase = createClient()

      for (const log of dailyLog || []) {
        const { error } = await supabase
          .from('reading_logs')
          .upsert({
            user_id: userId,
            book_id: bookId,
            log_date: log.date,
            pages_read: log.pagesRead,
          }, { onConflict: 'user_id,book_id,log_date' })
        if (error) console.error(`Reading log error for book ${bookId}:`, error.message)
      }
    } catch (err) {
      console.error('Reading logs sync exception:', err)
    }
  },

  // Full sync: push all local books, people, publishers, authors, reading logs to Supabase
  async syncToSupabase(userId: string): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const supabase = createClient()
      const localBooks = await this.getAll()

      // 1. Sync people first
      await this.syncPeopleToSupabase(userId)

      // 2. Sync publishers
      await this.syncPublishersToSupabase(userId)

      // 3. Fetch status mapping
      const { data: statusRows, error: statusError } = await supabase
        .from('reading_statuses')
        .select('id, slug')
      if (statusError) throw statusError
      const statusSlugToId: Record<string, string> = {}
      for (const r of statusRows || []) statusSlugToId[r.slug] = r.id

      let success = 0
      let failed = 0
      const errors: string[] = []

      for (const book of localBooks) {
        try {
          // 1. Upsert catalog book
          const { error: catalogError } = await supabase
            .from('books')
            .upsert(toSupabaseCatalogBook(book))
          if (catalogError) throw catalogError

          // 2. Author mapping
          const author = book.author ?? ''
          const trimmed = author.trim()
          if (trimmed.length > 0 && book.id) {
            this.syncAuthorToSupabase(trimmed as string, book.id)
          }

          // 3. User shelf entry
          const statusId = book.status && statusSlugToId[book.status] ? statusSlugToId[book.status] : null
          const { error: shelfError } = await supabase
            .from('user_books')
            .upsert({
              user_id: userId,
              book_id: book.id,
              progress: book.progress ?? 0,
              rating: book.rating,
              cover_image: book.coverImage,
              notes: book.notes,
              tags: book.tags,
              reading_status_id: statusId,
            }, { onConflict: 'user_id,book_id' })
          if (shelfError) throw shelfError

          // 4. Reading logs
          for (const log of book.dailyLog || []) {
            const { error: logError } = await supabase
              .from('reading_logs')
              .upsert({
                user_id: userId,
                book_id: book.id,
                log_date: log.date,
                pages_read: log.pagesRead,
              }, { onConflict: 'user_id,book_id,log_date' })
            if (logError) throw logError
          }

          success++
        } catch (err) {
          failed++
          errors.push(`${book.title}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      return { success, failed, errors }
    } catch (err) {
      return { success: 0, failed: 1, errors: [err instanceof Error ? err.message : 'Unknown error'] }
    }
  },

  // Pull data from Supabase for a user
  async pullFromSupabase(userId: string): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const supabase = createClient()
      const { data: rows, error } = await supabase
        .from('user_books')
        .select('*, books(*)')
        .eq('user_id', userId)

      if (error) throw error

      const bookIds = [...new Set((rows || []).map((row: any) => row.book_id).filter(Boolean))]
      const logsByBook = new Map<string, { log_date: string; pages_read: number }[]>()

      if (bookIds.length > 0) {
        const { data: readingLogs, error: readingLogsError } = await supabase
          .from('reading_logs')
          .select('book_id, log_date, pages_read')
          .eq('user_id', userId)
          .in('book_id', bookIds)

        if (readingLogsError) throw readingLogsError

        for (const log of readingLogs || []) {
          const bookLogs = logsByBook.get(log.book_id) || []
          bookLogs.push(log)
          logsByBook.set(log.book_id, bookLogs)
        }
      }

      let success = 0
      let failed = 0
      const errors: string[] = []

      for (const row of rows || []) {
        const book = (row as any).books
        if (!book) continue

        try {
          const dailyLog = (logsByBook.get(row.book_id) || []).map((l) => ({
            date: l.log_date,
            pagesRead: l.pages_read,
          }))

          await db.books.put({
            id: book.id,
            title: book.title,
            author: book.author,
            subtitle: book.subtitle,
            isbn10: book.isbn10,
            isbn13: book.isbn13,
            pages: book.pages,
            publicationYear: book.publication_year,
            description: book.description,
            progress: row.progress,
            rating: row.rating,
            coverImage: row.cover_image,
            notes: row.notes,
            tags: row.tags,
            status: row.status,
            dailyLog,
            createdAt: book.created_at,
            updatedAt: book.updated_at,
          })
          success++
        } catch (err) {
          failed++
          errors.push(`${book.title}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      return { success, failed, errors }
    } catch (err) {
      return { success: 0, failed: 1, errors: [err instanceof Error ? err.message : 'Unknown error'] }
    }
  },

  // Sync a single book to Supabase catalog
  async syncBookCatalog(book: any) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('books')
        .upsert(toSupabaseCatalogBook(book))
      if (error) console.error('Catalog sync error:', error)
    } catch (err) {
      console.error('Catalog sync exception:', err)
    }
  },

  // Sync an author to Supabase and link via book_authors
  async syncAuthorToSupabase(authorName: string, bookId: string) {
    try {
      const supabase = createClient()
      const name = authorName?.trim()
      if (!name) return

      // Find existing author by name (case-insensitive)
      const { data: existingAuthors, error: authorFindError } = await supabase
        .from('authors')
        .select('id')
        .ilike('name', name)
        .limit(1)

      if (authorFindError) {
        console.error('Author find error:', authorFindError.message)
        return
      }

      let authorId: string
      if (existingAuthors && existingAuthors.length > 0) {
        authorId = existingAuthors[0].id
      } else {
        // Create new author
        const { data: newAuthor, error: authorCreateError } = await supabase
          .from('authors')
          .insert({ name, sort_name: name })
          .select('id')
          .single()
        if (authorCreateError) {
          console.error('Author create error:', authorCreateError.message)
          return
        }
        authorId = newAuthor.id
      }

      // Upsert book_authors junction
      const { error: baError } = await supabase
        .from('book_authors')
        .upsert({ book_id: bookId, author_id: authorId, is_primary: true, position: 1 })
      if (baError) console.error('Book-author sync error:', baError)
    } catch (err) {
      console.error('Author sync exception:', err)
    }
  },

  // Sync a publisher to Supabase
  async syncPublisherToSupabase(name: string) {
    try {
      const supabase = createClient()
      if (!name || !name.trim()) return

      const { error } = await supabase
        .from('publishers')
        .upsert({ name: name.trim() })
      if (error) console.error('Publisher sync error:', error)
    } catch (err) {
      console.error('Publisher sync exception:', err)
    }
  },
}