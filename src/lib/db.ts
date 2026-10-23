'use client'

import Dexie, { Table } from 'dexie'

export interface Book {
  id?: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
  pages?: number
  startedAt?: string
  finishedAt?: string
  coverImage?: string
  notes?: string
  tags?: string[]
  progress?: number
  dailyLog?: { date: string; pagesRead: number }[]
  createdAt: string
  updatedAt: string
}

class RoseDB extends Dexie {
  books!: Table<Book, string>

  constructor() {
    super('rose')
    this.version(1).stores({
      books: 'id, title, author, status, genre, rating, createdAt'
    })
    this.books.hook('creating', (primKey, obj) => {
      obj.createdAt = new Date().toISOString()
      obj.updatedAt = new Date().toISOString()
      if (!obj.id) obj.id = crypto.randomUUID()
    })
    this.books.hook('updating', (modifications, primKey, obj, transaction) => {
      ;(modifications as any).updatedAt = new Date().toISOString()
    })
  }
}

export const db = new RoseDB()

// Seed data on first run
export async function seedInitialBooks() {
  const count = await db.books.count()
  if (count === 0) {
    await db.books.bulkAdd([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        status: 'read',
        genre: 'Classic',
        rating: 4,
        pages: 180,
        finishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: '1984',
        author: 'George Orwell',
        status: 'reading',
        genre: 'Dystopian',
        rating: 5,
        pages: 328,
        startedAt: new Date().toISOString(),
        progress: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        status: 'want-to-read',
        genre: 'Classic',
        pages: 281,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }
}
