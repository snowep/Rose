'use client'

import { Box, Typography } from '@mui/material'
import { BooksList } from '@/components/molecules/BooksList'

export function LibraryTemplate() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Library
      </Typography>
      <BooksList />
    </Box>
  )
}
