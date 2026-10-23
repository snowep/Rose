'use client'

import { db, Book } from '@/lib/db'

export class BookService {
  static async getAll(): Promise<Book[]> {
    return await db.books.toArray()
  }

  static async getById(id: string): Promise<Book | undefined> {
    return await db.books.get(id)
  }

  static async create(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    await db.books.add({
      ...book,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return id
  }

  static async update(id: string, updates: Partial<Book>): Promise<void> {
    await db.books.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  }

  static async delete(id: string): Promise<void> {
    await db.books.delete(id)
  }

  static async updateProgress(id: string, progress: number): Promise<void> {
    await db.books.update(id, {
      progress,
      updatedAt: new Date().toISOString(),
    })
  }

  static async addDailyLog(id: string, date: string, pagesRead: number): Promise<void> {
    const book = await db.books.get(id)
    if (!book) return
    
    const logs = book.dailyLog || []
    const existing = logs.find(l => l.date === date)
    
    if (existing) {
      existing.pagesRead += pagesRead
    } else {
      logs.push({ date, pagesRead })
    }
    
    await db.books.update(id, {
      dailyLog: logs,
      updatedAt: new Date().toISOString(),
    })
  }
}
