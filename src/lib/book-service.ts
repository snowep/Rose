'use client'

import Dexie from 'dexie'
import { Book } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'

const db = new Dexie('rose') as any
export { db }

db.version(1).stores({
  books: 'id, title, author, status, genre, rating, pages, progress, createdAt, updatedAt, dailyLog'
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

  async addDailyLog(id: string, date: string, pagesRead: number): Promise<void> {
    await db.books.update(id, {
      dailyLog: [...(await db.books.get(id))!.dailyLog || [], { date, pagesRead }],
      updatedAt: new Date().toISOString(),
    })
  },

  async syncToSupabase(): Promise<{ success: number; failed: number; errors: string[] }> {
    const books = await this.getAll()
    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const book of books) {
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
        if (error) throw error
        success++
      } catch (err) {
        failed++
        errors.push(`${book.title}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    return { success, failed, errors }
  },

  async pullFromSupabase(): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('books').select('*')
      if (error) throw error

      let success = 0
      let failed = 0
      const errors: string[] = []

      for (const book of data || []) {
        try {
          await db.books.put({
            id: book.id,
            title: book.title,
            author: book.author,
            status: book.status,
            genre: book.genre,
            rating: book.rating,
            pages: book.pages,
            progress: book.progress,
            startedAt: book.started_at,
            finishedAt: book.finished_at,
            coverImage: book.cover_image,
            notes: book.notes,
            tags: book.tags,
            dailyLog: book.daily_log,
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
