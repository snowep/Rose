'use client'

import Dexie from 'dexie'
import { Book } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'

const db = new Dexie('rose') as any
export { db }

db.version(1).stores({
  books: 'id'
})

// Supabase sync helpers
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

// CRUD operations with auto-sync to Supabase
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
    void syncBookToSupabase(record).catch(console.error)

    return id
  },

  async update(id: string, updates: Partial<Book>): Promise<void> {
    await db.books.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })

    const record = await db.books.get(id)
    if (record) {
      void syncBookToSupabase(record).catch(console.error)
    }
  },

  async delete(id: string): Promise<void> {
    await db.books.delete(id)
    void syncBookDeleteFromSupabase(id).catch(console.error)
  },

  async updateProgress(id: string, progress: number): Promise<void> {
    await db.books.update(id, {
      progress,
      updatedAt: new Date().toISOString(),
    })

    const record = await db.books.get(id)
    if (record) {
      void syncBookToSupabase(record).catch(console.error)
    }
  },

  async addDailyLog(id: string, date: string, pagesRead: number): Promise<void> {
    await db.books.update(id, {
      dailyLog: [...(await db.books.get(id))!.dailyLog || [], { date, pagesRead }],
      updatedAt: new Date().toISOString(),
    })

    const record = await db.books.get(id)
    if (record) {
      void syncBookToSupabase(record).catch(console.error)
    }
  }
}