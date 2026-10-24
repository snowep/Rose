'use client'

import { Box, Tooltip } from '@mui/material'

type HeatmapCellProps = {
  date: string
  count: number
  size: number
  isToday?: boolean
}

function getColor(count: number) {
  if (count === 0) return 'rgba(240, 240, 240, 0.3)'
  const intensity = Math.min(count, 5) / 5
  const green = Math.floor(100 + intensity * 155)
  const alpha = 0.3 + intensity * 0.7
  return `rgba(34, ${green}, 34, ${alpha})`
}

export function HeatmapCell({ date, count, size, isToday }: HeatmapCellProps) {
  const cellSize = { height: size, width: size }

  return (
    <Tooltip
      title={
        count > 0
          ? `${count} page${count > 1 ? 's' : ''} read on ${date}`
          : `No reading on ${date}`
      }
    >
      <Box
        sx={{
          ...cellSize,
          borderRadius: 0,
          bgcolor: getColor(count),
          border: isToday ? '2px solid #00bcd4' : 'none',
          boxShadow: isToday ? '0 0 0 2px rgba(0, 188, 212, 0.3)' : 'none',
          transition: 'transform 0.15s ease, background-color 0.15s ease, border 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            transform: 'scale(1.4)',
            bgcolor: getColor(Math.min(count + 1, 5)),
          },
        }}
      />
    </Tooltip>
  )
}