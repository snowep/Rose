'use client'

import { Box } from '@mui/material'
import { StatusChip } from '@/components/atoms/StatusChip'
import { BookTitle } from '@/components/atoms/BookTitle'
import { BookAuthor } from '@/components/atoms/BookAuthor'
import { GenreChip } from '@/components/atoms/GenreChip'
import { RatingDisplay } from '@/components/atoms/RatingDisplay'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { TagList } from '@/components/atoms/TagList'
import { BookActions } from '@/components/atoms/BookActions'

export interface BookProps {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
  pages?: number
  progress?: number
  coverImage?: string
  tags?: string[]
}

const statusColors = {
  reading: '#1976d2',
  read: '#2e7d32',
  'want-to-read': '#0288d1',
}

export function BookCard({ id, title, author, status, genre, rating, pages, progress, tags }: BookProps) {
  return (
    <Box sx={{
      p: 2.5,
      border: '1px solid #424242',
      borderRadius: 2,
      mb: 2,
      backgroundColor: 'rgba(255,255,255,0.02)',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: statusColors[status],
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
        <BookTitle title={title} />
        <StatusChip status={status} />
      </Box>

      <BookAuthor author={author} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <GenreChip genre={genre} />
        <RatingDisplay rating={rating} />
      </Box>

      <ProgressBar pages={pages} progress={progress} status={status} />

      <TagList tags={tags} />

      <BookActions bookId={id} />
    </Box>
  )
}
