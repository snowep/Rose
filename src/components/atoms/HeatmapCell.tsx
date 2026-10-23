'use client'

import { Box, Tooltip } from '@mui/material'

type HeatmapCellProps = {
  date: string
  count: number
  size: number
}

function getColor(count: number) {
  if (count === 0) return 'rgba(240, 240, 240, 0.3)'
  const intensity = Math.min(count, 5) / 5
  const green = Math.floor(100 + intensity * 155)
  const alpha = 0.3 + intensity * 0.7
  return `rgba(34, ${green}, 34, ${alpha})`
}

export function HeatmapCell({ date, count, size }: HeatmapCellProps) {
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
          height: size,
          width: size,
          borderRadius: 1,
          bgcolor: getColor(count),
          transition: 'transform 0.15s ease, background-color 0.15s ease',
          '&:hover': {
            transform: 'scale(1.4)',
            bgcolor: getColor(Math.min(count + 1, 5)),
          },
        }}
      />
    </Tooltip>
  )
}