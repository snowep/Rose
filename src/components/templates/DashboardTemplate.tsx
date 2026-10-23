'use client'

import { Box, Typography } from '@mui/material'
import { Heatmap } from '@/components/atoms/Heatmap'

export function DashboardTemplate() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Heatmap />
    </Box>
  )
}