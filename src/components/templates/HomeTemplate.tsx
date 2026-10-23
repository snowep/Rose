'use client'

import { Box, Typography } from '@mui/material'
import { BooksList } from '@/components/molecules/BooksList'

export function HomeTemplate() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Home
      </Typography>
      <BooksList />
    </Box>
  )
}
