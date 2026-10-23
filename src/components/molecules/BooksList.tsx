'use client'

import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { BookCard } from '@/components/atoms/BookCard'

interface BookProps {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
}

const initialBooks: BookProps[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'read' },
  { id: '2', title: '1984', author: 'George Orwell', status: 'reading' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'want-to-read' },
]

export function BooksList() {
  return (
    <Box sx={{ py: 2 }}>
      <List>
        {initialBooks.map((book) => (
          <ListItem key={book.id} sx={{ py: 1, borderBottom: '1px solid #424242' }}>
            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              status={book.status}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
