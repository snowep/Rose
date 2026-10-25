'use client'

import { Box, Grid, Typography } from '@mui/material'
import { BooksCount } from '@/components/atoms/BooksCount'
import { BookSection } from '@/components/molecules/BookSection'
import { useBooks } from '@/components/hooks/useBooks'

export function BooksList() {
  const { books, loading } = useBooks()

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  const readingBooks = books.filter(book => book.status === 'reading')
  const wantToReadBooks = books.filter(book => book.status === 'want-to-read')
  const readBooks = books.filter(book => book.status === 'read')

  return (
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
  )
}
