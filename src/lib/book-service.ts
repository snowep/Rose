'use client'

import Dexie from 'dexie'
import { Book } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'

const db = new Dexie('rose') as any
export { db }

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
    ;(db as any).people.add(record)
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

    ;(db as any).books.add(record)
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

  async syncToSupabase(userId: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const supabase = createClient()
    const books = await this.getAll()
    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const book of books) {
      try {
        // 1. Upsert shared catalog book (no author column)
        const bookData: any = { id: book.id, title: book.title }
        if (book.subtitle !== undefined) bookData.subtitle = book.subtitle
        if (book.isbn10 !== undefined) bookData.isbn10 = book.isbn10
        if (book.isbn13 !== undefined) bookData.isbn13 = book.isbn13
        if (book.publicationYear !== undefined) bookData.publication_year = book.publicationYear
        if (book.description !== undefined) bookData.description = book.description
        const { error: catalogError } = await supabase
          .from('books')
          .upsert(bookData)
        if (catalogError) throw catalogError

        // 2. Author mapping: find or create author, then link via book_authors
        if (book.author && book.author.trim()) {
          // Find existing author by name (case-insensitive)
          const { data: existingAuthors, error: authorFindError } = await supabase
            .from('authors')
            .select('id')
            .ilike('name', book.author.trim())
            .limit(1)
          if (authorFindError) {
            console.error('Author find error:', authorFindError.message)
            throw authorFindError
          }

          let authorId: string
          if (existingAuthors && existingAuthors.length > 0) {
            authorId = existingAuthors[0].id
          } else {
            // Create new author
            const { data: newAuthor, error: authorCreateError } = await supabase
              .from('authors')
              .insert({ name: book.author.trim(), sort_name: book.author.trim() })
              .select('id')
              .single()
            if (authorCreateError) {
              console.error('Author create error:', authorCreateError.message)
              throw authorCreateError
            }
            authorId = newAuthor.id
          }
          // Upsert book_authors junction
          const { error: baError } = await supabase
            .from('book_authors')
            .upsert({ book_id: book.id, author_id: authorId, is_primary: true, position: 1 })
          if (baError) throw baError
        }

        // 3. User-scoped shelf entry — status is now a string enum, not a UUID reference
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
            status: book.status,
          }, { onConflict: 'user_id,book_id' })
        if (shelfError) throw shelfError

        // 4. Reading logs - upsert on (user_id, book_id, log_date) to avoid duplicates
        for (const log of book.dailyLog || []) {
          const { error: logError } = await supabase
            .from('reading_logs')
            .upsert({
              user_id: userId,
              book_id: book.id,
              log_date: log.date,
              pages_read: log.pagesRead,
            }, { onConflict: 'user_id,book_id,log_date' })
          if (logError) {
            console.error(`Reading log error for "${book.title}":`, logError.message)
            throw logError
          }
        }

        success++
      } catch (err) {
        failed++
        errors.push(`${book.title}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return { success, failed, errors }
  },

  // Sync people from local Dexie to Supabase
  // Note: SQL people table only has columns: id, name, sort_name
  // Only sync fields that exist in the SQL schema
  async syncPeopleToSupabase(userId: string): Promise<void> {
    const localPeople = await BookService.getPeople()
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
  },

  // Sync publishers from local Dexie to Supabase
  // Note: SQL publishers table only has columns: id, name
  // Only sync fields that exist in the SQL schema
  async syncPublishersToSupabase(userId: string): Promise<void> {
    const supabase = createClient()
    const { data: localPublishers } = await supabase
      .from('books')
      .select('publisher_id, publishers(name)')
      .not('publisher_id', 'is', null)
    // Get unique publishers from books
    const publisherSet = new Set(localPublishers?.map((b: any) => b.publishors?.name).filter(Boolean) || [])
    for (const name of publisherSet) {
      try {
        await supabase
          .from('publishers')
          .upsert({ name })
      } catch (err) {
        console.error(`Publisher sync error for ${name}:`, err)
      }
    }
  },

  async pullFromSupabase(userId: string): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const supabase = createClient()
      const { data: rows, error } = await supabase
        .from('user_books')
        .select('*, books(*), reading_logs(log_date, pages_read)')
        .eq('user_id', userId)
      if (error) throw error

      let success = 0
      let failed = 0
      const errors: string[] = []

      for (const row of rows || []) {
        const book = (row as any).books
        if (!book) continue
        try {
          const dailyLog = (row.reading_logs || []).map((l: any) => ({
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
  }
}