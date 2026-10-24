'use client'

import { Box, Card, CardMedia, CardContent, Link, Typography } from '@mui/material'
import { StatusChip } from '@/components/atoms/StatusChip'

export interface BookCardSmallProps {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  coverImage?: string
}

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg=='

export function BookCardSmall({ id, title, author, status, coverImage }: BookCardSmallProps) {
  const cover = coverImage || PLACEHOLDER_COVER

  return (
    <Link href={`/library/detail/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          height: '100%',
          maxHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #424242',
          borderRadius: 1,
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
          sx={{ height: 160, objectFit: 'cover', borderRadius: '2px 2px 0 0' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
          <Typography
            variant="body2"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: '0.85rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 0.5,
              minHeight: '2.5em',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {author}
          </Typography>

          <StatusChip status={status} />
        </CardContent>
      </Card>
    </Link>
  )
}
