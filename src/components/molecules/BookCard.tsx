'use client'

import { Box, Card, CardMedia, Link, useTheme } from '@mui/material'
import { StatusChip } from '@/components/atoms/StatusChip'
import { BookTitle } from '@/components/atoms/BookTitle'
import { BookAuthor } from '@/components/atoms/BookAuthor'
import { GenreChip } from '@/components/atoms/GenreChip'
import { RatingDisplay } from '@/components/atoms/RatingDisplay'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { TagList } from '@/components/atoms/TagList'

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg=='

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

export function BookCard({ id, title, author, status, genre, rating, pages, progress, coverImage, tags }: BookProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const cover = coverImage || PLACEHOLDER_COVER

  return (
    <Link href={`/library/detail/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          height: '100%',
          maxHeight: 350,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: isDark ? '#424242' : '#e0e0e0',
          borderRadius: 1,
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
            boxShadow: `0 4px 12px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
            transform: 'translateY(-2px)',
          }
        }}
      >
        <CardMedia
          component="img"
          image={cover}
          alt={`${title} cover`}
          sx={{ height: 200, objectFit: 'cover', borderRadius: '2px 2px 0 0' }}
        />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
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

          <Box sx={{ mt: 'auto' }}>
            <ProgressBar pages={pages} progress={progress} status={status} />
          </Box>

          <Box sx={{ mt: 1 }}>
            <TagList tags={tags} />
          </Box>
        </Box>
      </Card>
    </Link>
  )
}