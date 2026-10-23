'use client'

import { Box, Typography, Button } from '@mui/material'

interface BookProps {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
}

export function BookCard({ id, title, author, status }: BookProps) {
  return (
    <Box sx={{ p: 2, border: '1px solid #424242', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" component="h3" sx={{ py: 1 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        by {author}
      </Typography>
      <Button
        variant="text"
        sx={{ ml: 1, width: 120 }}
        component="a"
        href={`/library/detail/${id}`}
      >
        View
      </Button>
    </Box>
  )
}
