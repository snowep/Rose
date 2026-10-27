'use client'

import { BOOKS_CHANGED_EVENT, BookService } from '@/lib/book-service'
import { Book } from '@/lib/db'
import { useEffect, useState } from 'react'

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  const loadBooks = async () => {
    try {
      const data = await BookService.getAll()
      setBooks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleBooksChanged = () => {
      void loadBooks()
    }

    void loadBooks()
    window.addEventListener(BOOKS_CHANGED_EVENT, handleBooksChanged)
    return () => window.removeEventListener(BOOKS_CHANGED_EVENT, handleBooksChanged)
  }, [])

  const createBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    await BookService.create(bookData)
    await loadBooks()
  }

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    await BookService.update(id, bookData)
    await loadBooks()
  }

  const deleteBook = async (id: string) => {
    await BookService.delete(id)
    await loadBooks()
  }

  return { books, loading, loadBooks, createBook, updateBook, deleteBook }
}
