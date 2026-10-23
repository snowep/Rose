'use client'

import { Box, Typography, Button, LinearProgress, Chip } from '@mui/material'
import { Star } from '@mui/icons-material'

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

export function BookCard({ id, title, author, status, genre, rating, pages, progress, tags }: BookProps) {
  const statusColors = {
    reading: '#1976d2',
    read: '#2e7d32',
    'want-to-read': '#0288d1',
  }

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
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip label={status} size="small" sx={{ 
          backgroundColor: `${statusColors[status]}20`,
          color: statusColors[status],
          fontSize: '0.7rem',
          height: 20
        }} />
      </Box>
      
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        by {author}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        {genre && <Chip label={genre} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />}
        {rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Star sx={{ fontSize: 14, color: 'gold' }} />
            <Typography variant="caption">{rating}</Typography>
          </Box>
        )}
      </Box>
      
      {pages && progress !== undefined && pages > 0 && (
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {progress}% of {pages} pages
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round((pages * progress) / 100)} / {pages}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: statusColors[status],
              }
            }} 
          />
        </Box>
      )}
      
      {tags && tags.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tags.slice(0, 4).map(tag => (
            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
          ))}
          {tags.length > 4 && (
            <Typography variant="caption" color="text.secondary">+{tags.length - 4}</Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Button
          variant="text"
          sx={{ fontSize: '0.85rem', fontWeight: 500 }}
          component="a"
          href={`/library/detail/${id}`}
        >
          View Details →
        </Button>
      </Box>
    </Box>
  )
}
