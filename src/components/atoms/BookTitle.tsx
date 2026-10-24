'use client'

import { Box, Typography } from '@mui/material'

export function BookTitle({ title, lines = 2 }: { title: string; lines?: number }) {
  return (
    <Typography
      variant="body1"
      component="h3" noWrap
      sx={{
        fontWeight: 600,
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {title}
    </Typography>
  )
}
