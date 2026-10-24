'use client'

import { Box, Typography } from '@mui/material'
import { BookCardSmall } from '@/components/atoms/BookCardSmall'

export interface BookSectionProps {
  title: string
  books: any[]
}

export function BookSection({ title, books }: BookSectionProps) {
  if (books.length === 0) {
    return null
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title} ({books.length})
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {books.map((book) => (
          <Box key={book.id} sx={{ minWidth: 160, flexShrink: 0 }}>
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
