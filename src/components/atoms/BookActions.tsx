'use client'

import { Box, Typography, Button } from '@mui/material'

export function BookActions({ bookId }: { bookId: string }) {
  return (
    <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Button
        variant="text"
        sx={{ fontSize: '0.85rem', fontWeight: 500 }}
        component="a"
        href={`/library/detail/${bookId}`}
      >
        View Details →
      </Button>
    </Box>
  )
}
