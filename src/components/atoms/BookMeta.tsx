'use client'

import { Box, Typography } from '@mui/material'

export function BookMeta({ status, genre, rating, pages, progress, tags }: {
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
  pages?: number
  progress?: number
  tags?: string[]
}) {
  return (
    <Box>
      {/* Meta content will be composed by parent */}
    </Box>
  )
}
