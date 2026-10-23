'use client'

import { Box, Typography } from '@mui/material'

export function PageHeader({ title }: { title: string }) {
  return (
    <Typography variant="h4" sx={{ mb: 3 }}>
      {title}
    </Typography>
  )
}
