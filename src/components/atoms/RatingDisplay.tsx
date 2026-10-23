'use client'

import { Box, Typography } from '@mui/material'
import { Star } from '@mui/icons-material'

export function RatingDisplay({ rating }: { rating?: number }) {
  if (!rating) return null

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Star sx={{ fontSize: 14, color: 'gold' }} />
      <Typography variant="caption">{rating}</Typography>
    </Box>
  )
}
