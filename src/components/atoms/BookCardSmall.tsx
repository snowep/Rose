'use client'

import { Box, Card, CardMedia, CardContent, Link, Typography, CircularProgress, useTheme } from '@mui/material'
import { useState } from 'react'
import { StatusChip } from '@/components/atoms/StatusChip'

export interface BookCardSmallProps {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  coverImage?: string
  progress?: number
}

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg=='

export function BookCardSmall({ id, title, author, status, coverImage, progress }: BookCardSmallProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const cover = coverImage || PLACEHOLDER_COVER
  const [isHovered, setIsHovered] = useState(false)

  const cardMaxHeight = 240
  const cardMaxWidth = Math.round(240 * 3 / 4) // 180

  const statusColors = {
    reading: '#2196f3',
    read: '#4caf50',
    'want-to-read': '#ff9800',
  }

  return (
    <Link href={`/library/detail/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          position: 'relative',
          height: '100%',
          maxHeight: cardMaxHeight,
          maxWidth: cardMaxWidth,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: isDark ? '#424242' : '#e0e0e0',
          borderRadius: 2,
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
            transform: 'translateY(-4px)',
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#1976d2',
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardMedia
          component="img"
          image={cover}
          alt={`${title} cover`}
          sx={{
            height: '100%',
            objectFit: 'cover',
            width: '100%',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 3,
            paddingBottom: 2,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.95) 100%)',
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            component="h3"
            noWrap
            sx={{
              fontWeight: 600,
              fontSize: '0.85rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'white',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {author}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <StatusChip status={status} size="small" />
            {status === 'reading' && progress && progress > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress
                  size={28}
                  thickness={3}
                  variant="determinate"
                  value={progress}
                  sx={{ color: statusColors.reading }}
                />
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'white' }}>
                  {progress}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {!isHovered && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.9,
              border: isDark ? 'none' : '1px solid #e0e0e0',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: isDark ? 'white' : '#424242', fontSize: '0.65rem' }}>
              {status === 'reading' ? 'RDG' : status === 'read' ? 'DONE' : 'WANT'}
            </Typography>
          </Box>
        )}
      </Card>
    </Link>
  )
}