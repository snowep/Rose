'use client'

import { Box, Typography } from '@mui/material'
import { Star } from '@mui/icons-material'

export function BookDetailsSection({ book }: { book: any }) {
  return (
    <Box sx={{ p: 2, border: '1px solid #424242', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Details</Typography>
      {book.rating && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Star color="warning" /><Typography>{book.rating}/5</Typography></Box>}
      {book.pages && <Typography sx={{ mb: 1 }}><strong>Pages:</strong> {book.pages}{book.progress !== undefined && <span style={{ marginLeft: 8 }}> • {book.progress}%</span>}</Typography>}
      {book.startedAt && <Typography sx={{ mb: 1 }}><strong>Started:</strong> {new Date(book.startedAt).toLocaleDateString()}</Typography>}
      {book.finishedAt && <Typography sx={{ mb: 1 }}><strong>Finished:</strong> {new Date(book.finishedAt).toLocaleDateString()}</Typography>}
      {book.notes && <Box sx={{ mt: 3 }}><Typography variant="subtitle2" sx={{ mb: 1 }}>Notes</Typography><Typography variant="body2" sx={{whiteSpace:"pre-wrap"}}>{book.notes}</Typography></Box>}
    </Box>
  )
}
