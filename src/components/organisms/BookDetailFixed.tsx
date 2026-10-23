'use client'

import { Box, Divider, Typography } from '@mui/material'
import { BookDetailHeader } from '@/components/molecules/BookDetailHeader'
import { BookDetailsSection } from '@/components/molecules/BookDetailsSection'
import { ReadingProgressSection } from '@/components/molecules/ReadingProgressSection'
import { Book } from '@/lib/db'

interface BookDetailProps {
  book: Book | undefined
  onEdit: () => void
  onDelete: () => void
  onLogProgress: () => void
}

export function BookDetail({ book, onEdit, onDelete, onLogProgress }: BookDetailProps) {
  if (!book) return <Typography>Loading...</Typography>
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <BookDetailHeader book={book} onEdit={onEdit} onDelete={onDelete} />
      <Divider sx={{ mb: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <BookDetailsSection book={book} />
        <ReadingProgressSection book={book} onLogProgress={onLogProgress} onEdit={onEdit} onDelete={onDelete} />
      </Box>
    </Box>
  )
}
