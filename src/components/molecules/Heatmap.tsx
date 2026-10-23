'use client'

import * as React from 'react'
import { Box } from '@mui/material'
import { HeatmapHeader } from '@/components/atoms/HeatmapHeader'
import { HeatmapGrid } from '@/components/molecules/HeatmapGrid'

type HeatmapCell = {
  date: string
  count: number
}

function generateWeeklyCells(): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const count = Math.floor(Math.random() * 6)
    cells.push({
      date: d.toISOString().split('T')[0],
      count,
    })
  }
  return cells
}

function generateMonthlyCells(): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const count = Math.floor(Math.random() * 6)
    cells.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      count,
    })
  }
  return cells
}

function generateYearCells(): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()

  for (let day = 0; day < 365; day++) {
    const date = new Date(year, 0, 1)
    date.setDate(1 + day)
    const count = Math.floor(Math.random() * 6)
    cells.push({
      date: date.toISOString().split('T')[0],
      count,
    })
  }
  return cells
}

export function Heatmap() {
  const [mode, setMode] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly')

  const cells = React.useMemo(() => {
    if (mode === 'weekly') return generateWeeklyCells()
    if (mode === 'monthly') return generateMonthlyCells()
    return generateYearCells()
  }, [mode])

  return (
    <Box sx={{ p: 2, bgcolor: 'surface', borderRadius: 2, py: 3 }}>
      <HeatmapHeader mode={mode} onModeChange={setMode} />
      <HeatmapGrid cells={cells} mode={mode} />
    </Box>
  )
}