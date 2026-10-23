'use client'

import { Box, Typography } from '@mui/material'
import { BookService } from '@/lib/book-service'
import { useEffect, useState } from 'react'

export function useBooks() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadBooks = async () => {
    setLoading(true)
    try {
      const data = await BookService.getAll()
      setBooks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const createBook = async (bookData: any) => {
    await BookService.create(bookData)
    await loadBooks()
  }

  const updateBook = async (id: string, bookData: any) => {
    await BookService.update(id, bookData)
    await loadBooks()
  }

  const deleteBook = async (id: string) => {
    await BookService.delete(id)
    await loadBooks()
  }

  return { books, loading, loadBooks, createBook, updateBook, deleteBook }
}
