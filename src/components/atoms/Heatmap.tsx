'use client'

import * as React from 'react'
import { Box, Typography, Select, MenuItem, Tooltip } from '@mui/material'

type HeatmapCell = {
  date: string
  count: number
  label?: string
}

function generateWeeklyCells() {
  const cells: HeatmapCell[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const count = Math.floor(Math.random() * 6)
    const label = count > 0 ? `${count} page${count > 1 ? 's' : ''} read` : ''
    cells.push({
      date: d.toISOString().split('T')[0],
      count,
      label,
    })
  }
  return cells
}

function generateMonthlyCells() {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const count = Math.floor(Math.random() * 6)
    const label = count > 0 ? `${count} page${count > 1 ? 's' : ''} read` : ''
    cells.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      count,
      label,
    })
  }

  return cells
}

function generateYearCells() {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()

  for (let day = 0; day < 365; day++) {
    const date = new Date(year, 0, 1)
    date.setDate(1 + day)
    const count = Math.floor(Math.random() * 6)
    const label = count > 0 ? `${count} page${count > 1 ? 's' : ''} read` : ''
    cells.push({
      date: date.toISOString().split('T')[0],
      count,
      label,
    })
  }

  return cells
}

function getColor(count: number) {
  if (count === 0) return 'rgba(240, 240, 240, 0.3)'
  const intensity = Math.min(count, 5) / 5
  const green = Math.floor(100 + intensity * 155)
  const alpha = 0.3 + intensity * 0.7
  return `rgba(34, ${green}, 34, ${alpha})`
}

export function Heatmap() {
  const [mode, setMode] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly')

  const cells = React.useMemo(() => {
    if (mode === 'weekly') {
      return generateWeeklyCells()
    } else if (mode === 'monthly') {
      return generateMonthlyCells()
    } else {
      return generateYearCells()
    }
  }, [mode])

  const cellSize = mode === 'yearly' ? 10 : 16

  return (
    <Box sx={{ p: 2, bgcolor: 'surface', borderRadius: 2, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ mr: 2 }}>
          Heatmap
        </Typography>
        <Select
          value={mode}
          onChange={(e) => setMode(e.target.value as unknown as 'weekly' | 'monthly' | 'yearly')}
          sx={{ width: 120 }}
        >
          <MenuItem value="weekly">This Week</MenuItem>
          <MenuItem value="monthly">This Month</MenuItem>
          <MenuItem value="yearly">This Year</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: 0.5,
          gridTemplateColumns:
            mode === 'weekly'
              ? `repeat(7, ${cellSize}px)`
              : mode === 'monthly'
              ? `repeat(auto-fill, minmax(${cellSize}px, 1fr))`
              : `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
          justifyContent: 'start',
        }}
      >
        {cells.map((cell) => (
          <Tooltip
            title={
              cell.count > 0
                ? `${cell.count} page${cell.count > 1 ? 's' : ''} read on ${cell.date}`
                : `No reading on ${cell.date}`
            }
            key={cell.date}
          >
            <Box
              sx={{
                height: cellSize,
                width: cellSize,
                borderRadius: 1,
                bgcolor: getColor(cell.count),
                transition: 'transform 0.15s ease, background-color 0.15s ease',
                '&:hover': {
                  transform: 'scale(1.4)',
                  bgcolor: getColor(Math.min(cell.count + 1, 5)),
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}