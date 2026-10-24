'use client'

import { Box, Typography, Paper } from '@mui/material'

export function HeatmapContainer({ children }: { children: React.ReactNode }) {
  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: 'surface',
        borderRadius: 2,
        py: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Paper>
  )
}
