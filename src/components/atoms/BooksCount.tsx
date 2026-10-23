'use client'

import { Box, Typography } from '@mui/material'

export function BooksCount({ count }: { count: number }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography color="text.secondary">
        {count} books saved
      </Typography>
    </Box>
  )
}
