'use client'

import { List, ListItem, Typography } from '@mui/material'
import { BookCard } from '@/components/molecules/BookCard'

export function BooksListView({ books, loading }: { books: any[]; loading: boolean }) {
  if (loading) {
    return <ListItem><Typography>Loading...</Typography></ListItem>
  }

  return (
    <List>
      {books.map((book) => (
        <ListItem key={book.id}>
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
  )
}
