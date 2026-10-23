'use client'

import { Box } from '@mui/material'
import { BooksCount } from '@/components/atoms/BooksCount'
import { BooksListView } from '@/components/molecules/BooksListView'
import { BookModal } from '@/components/organisms/BookModal'
import { AddBookFab } from '@/components/atoms/AddBookFab'
import { useBooks } from '@/components/hooks/useBooks'
import { useState } from 'react'

export function BooksList() {
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<any | null>(null)
  const { books, loading, createBook, updateBook } = useBooks()

  const handleSave = async (bookData: any) => {
    if (editingBook) {
      await updateBook(editingBook.id, bookData)
    } else {
      await createBook(bookData)
    }
    setShowModal(false)
    setEditingBook(null)
  }

  return (
    <Box sx={{ py: 4 }}>
      <BooksCount count={books.length} />
      <BooksListView books={books} loading={loading} />

      <AddBookFab onClick={() => setShowModal(true)} />

      <BookModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingBook={editingBook}
      />
    </Box>
  )
}