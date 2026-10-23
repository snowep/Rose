'use client'

import { Box } from '@mui/material'
import { HeatmapCell } from '@/components/atoms/HeatmapCell'

type HeatmapCellData = {
  date: string
  count: number
}

export function HeatmapGrid({ cells, mode }: { cells: HeatmapCellData[]; mode: 'weekly' | 'monthly' | 'yearly' }) {
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
      {cells.map((cell) => (
        <HeatmapCell key={cell.date} date={cell.date} count={cell.count} size={cellSize} />
      ))}
    </Box>
  )
}