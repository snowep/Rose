'use client'

import { Box, Typography } from '@mui/material'

export function HeatmapContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ p: 2, bgcolor: 'surface', borderRadius: 2, py: 3 }}>
      {children}
    </Box>
  )
}
