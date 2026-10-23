'use client'

import { useMemo } from 'react'

type HeatmapCell = {
  date: string
  count: number
}

export function useHeatmapCells(mode: 'weekly' | 'monthly' | 'yearly', readingMap: Map<string, number>) {
  return useMemo(() => {
    if (mode === 'weekly') return generateWeeklyCells(readingMap)
    if (mode === 'monthly') return generateMonthlyCells(readingMap)
    return generateYearCells(readingMap)
  }, [mode, readingMap])
}

function generateWeeklyCells(readingMap: Map<string, number>): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const count = readingMap.get(dateStr) || 0
    cells.push({ date: dateStr, count })
  }
  return cells
}

function generateMonthlyCells(readingMap: Map<string, number>): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const count = readingMap.get(dateStr) || 0
    cells.push({ date: dateStr, count })
  }
  return cells
}

function generateYearCells(readingMap: Map<string, number>): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()

  for (let day = 0; day < 365; day++) {
    const date = new Date(year, 0, 1)
    date.setDate(1 + day)
    const dateStr = date.toISOString().split('T')[0]
    const count = readingMap.get(dateStr) || 0
    cells.push({ date: dateStr, count })
  }
  return cells
}
