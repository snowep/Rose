'use client'

import { Box, Typography } from '@mui/material'

export function HeatmapLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <Typography color="text.secondary">Loading reading activity...</Typography>
    </Box>
  )
}
