'use client'

import { Box, Card, CardMedia, CardContent, Link } from '@mui/material'
import { StatusChip } from '@/components/atoms/StatusChip'
import { BookTitle } from '@/components/atoms/BookTitle'
import { BookAuthor } from '@/components/atoms/BookAuthor'
import { GenreChip } from '@/components/atoms/GenreChip'
import { RatingDisplay } from '@/components/atoms/RatingDisplay'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { TagList } from '@/components/atoms/TagList'

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

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg=='

export function BookCard({ id, title, author, status, genre, rating, pages, progress, coverImage, tags }: BookProps) {
  const cover = coverImage || PLACEHOLDER_COVER
  const statusColor = statusColors[status]

  return (
    <Link href={`/library/detail/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #424242',
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)',
            boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
            transform: 'translateY(-2px)',
          }
        }}
      >
        <CardMedia
          component="img"
          image={cover}
          alt={`${title} cover`}
          sx={{ height: 300, objectFit: 'cover', borderRadius: '2px 2px 0 0' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
            <BookTitle title={title} />
            <StatusChip status={status} />
          </Box>

          <BookAuthor author={author} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <GenreChip genre={genre} />
            <RatingDisplay rating={rating} />
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <ProgressBar pages={pages} progress={progress} status={status} />
          </Box>

          <TagList tags={tags} />
        </CardContent>
      </Card>
    </Link>
  )
}
