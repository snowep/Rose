'use client'

import { Typography } from '@mui/material'

export function BookAuthor({ author }: { author: string }) {
  return (
    <Typography color="text.secondary" sx={{ mb: 1 }}>
      by {author}
    </Typography>
  )
}
