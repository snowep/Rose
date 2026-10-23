'use client'

import { Chip } from '@mui/material'

export function GenreChip({ genre }: { genre?: string }) {
  if (!genre) return null

  return (
    <Chip
      label={genre}
      size="small"
      variant="outlined"
      sx={{ fontSize: '0.7rem', height: 20 }}
    />
  )
}
