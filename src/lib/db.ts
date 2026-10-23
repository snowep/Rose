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
