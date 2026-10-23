'use client'

import { Box, List, ListItem, Typography } from '@mui/material'
import { BookCard } from '@/components/atoms/BookCard'
import { BookModal } from '@/components/molecules/BookModal'
import { AddBookFab } from '@/components/organisms/AddBookFab'
import { BookService } from '@/lib/book-service'
import { seedInitialBooks } from '@/lib/db'
import { useEffect, useState } from 'react'

export function BooksList() {
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<any | null>(null)
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedInitialBooks().then(() => loadBooks())
  }, [])

  const loadBooks = async () => {
    const data = await BookService.getAll()
    setBooks(data)
    setLoading(false)
  }

  const handleSave = async (bookData: any) => {
    if (editingBook) {
      await BookService.update(editingBook.id, bookData)
    } else {
      await BookService.create(bookData)
    }
    setShowModal(false)
    setEditingBook(null)
    loadBooks()
  }

  const handleDelete = async (id: string) => {
    await BookService.delete(id)
    loadBooks()
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography color="text.secondary">
          {books.length} books saved
        </Typography>
      </Box>
      <List>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : books.map((book) => (
          <ListItem key={book.id} sx={{ py: 1, borderBottom: '1px solid #424242' }}>
            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              status={book.status}
              genre={book.genre}
              rating={book.rating}
              pages={book.pages}
              progress={book.progress}
              tags={book.tags}
            />
          </ListItem>
        ))}
      </List>
      
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