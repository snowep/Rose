'use client'

import { Box, Typography } from '@mui/material'

export function BookTitle({ title }: { title: string }) {
  return (
    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
  )
}
