'use client'

import { Box } from '@mui/material'
import { StatusChip } from '@/components/atoms/StatusChip'
import { BookTitle } from '@/components/atoms/BookTitle'
import { BookAuthor } from '@/components/atoms/BookAuthor'
import { GenreChip } from '@/components/atoms/GenreChip'
import { RatingDisplay } from '@/components/atoms/RatingDisplay'

interface BookCardMetaProps {
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
}

export function BookCardMeta({ title, author, status, genre, rating }: BookCardMetaProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
        <BookTitle title={title} />
        <StatusChip status={status} />
      </Box>

      <BookAuthor author={author} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <GenreChip genre={genre} />
        <RatingDisplay rating={rating} />
      </Box>
    </Box>
  )
}