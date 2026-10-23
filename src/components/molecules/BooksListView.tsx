'use client'

import { Grid2 as Grid, Typography } from '@mui/material'
import { BookCard } from '@/components/molecules/BookCard'

export function BooksListView({ books, loading }: { books: any[]; loading: boolean }) {
  if (loading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
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
        </Grid>
      ))}
    </Grid>
  )
}
