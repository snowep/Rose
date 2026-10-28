'use client'

import { Box, Grid, Typography } from '@mui/material'
import { BooksCount } from '@/components/atoms/BooksCount'
import { BookSection } from '@/components/molecules/BookSection'
import { useBooks } from '@/components/hooks/useBooks'
import { ActionFab } from '@/components/atoms/ActionFab'
import { Add } from '@mui/icons-material'
import { AddBookModalSimple } from '@/components/molecules/AddBookModalSimple'
import { LibraryAdd } from '@mui/icons-material'
import { useState } from 'react'

export function BooksList() {
  const { books, loading } = useBooks()
  const [modalOpen, setModalOpen] = useState(false)
  const addBookControls = (
    <>
      <ActionFab icon={Add} ariaLabel="Add a book" onClick={() => setModalOpen(true)} />
      <AddBookModalSimple open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )

  if (loading) {
    return (
      <>
        <Typography>Loading...</Typography>
        {addBookControls}
      </>
    )
  }

  const readingBooks = books.filter(book => book.status === 'reading')
  const wantToReadBooks = books.filter(book => book.status === 'want-to-read')
  const readBooks = books.filter(book => book.status === 'read')

  const hasAnyBooks = books.length > 0

  if (!hasAnyBooks) {
    return (
      <>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <LibraryAdd sx={{ fontSize: 64, color: 'text.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              Your library is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Start building your personal library by adding your first book.
            </Typography>
          </Box>
        </Box>
        {addBookControls}
      </>
    )
  }

  return (
    <>
      <Box sx={{ py: 4 }}>
        <BooksCount count={books.length} />

        <Grid container spacing={3} sx={{ mb: 12 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <BookSection title="Currently Reading" books={readingBooks} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <BookSection title="Want to Read" books={wantToReadBooks} />
          </Grid>
        </Grid>

        <BookSection title="Already Read" books={readBooks} />
      </Box>
      {addBookControls}
    </>
  )
}
