'use client'

import { Box } from '@mui/material'

export function HeatmapGridContainer({ children, mode }: { children: React.ReactNode; mode: 'weekly' | 'monthly' | 'yearly' }) {
  const cellSize = mode === 'yearly' ? 10 : 16

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 0.5,
        gridTemplateColumns:
          mode === 'weekly'
            ? `repeat(7, ${cellSize}px)`
            : `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
        justifyContent: 'start',
      }}
    >
      {children}
    </Box>
  )
}
