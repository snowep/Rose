'use client'

import { Box, Typography } from '@mui/material'

export function PageHeader({ title }: { title: string }) {
  return (
    <Typography variant="h4" sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.65rem', sm: '2.125rem' } }}>
      {title}
    </Typography>
  )
}
