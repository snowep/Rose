'use client'

import { Box, Typography } from '@mui/material'
import { BookCardSmall } from '@/components/atoms/BookCardSmall'

export interface BookSectionProps {
  title: string
  books: any[]
}

export function BookSection({ title, books }: BookSectionProps) {
  if (books.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No books in {title.toLowerCase()}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title} ({books.length})
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {books.map((book) => (
          <Box key={book.id} sx={{ maxWidth: 210, flexShrink: 0 }}>
            <BookCardSmall
              id={book.id}
              title={book.title}
              author={book.author}
              status={book.status}
              coverImage={book.coverImage}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
