'use client'

import { useMemo } from 'react'

type HeatmapCell = {
  date: string
  count: number
  month?: number
}

export function useHeatmapCells(mode: 'monthly' | 'yearly', readingMap: Map<string, number>) {
  return useMemo(() => {
    if (mode === 'monthly') return generateMonthlyCells(readingMap)
    return generateYearCells(readingMap)
  }, [mode, readingMap])
}


function generateMonthlyCells(readingMap: Map<string, number>): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  // Convert Sunday-start to Monday-start (ISO week)
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  // For Monday start: Sunday (0) becomes 6, Monday (1) becomes 0, etc.
  const firstDayMondayStart = firstDay === 0 ? 6 : firstDay - 1

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayMondayStart; i++) {
    cells.push({ date: '', count: 0 })
  }

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

  // Generate cells for each month with proper calendar structure
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const firstDayMondayStart = firstDay === 0 ? 6 : firstDay - 1

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayMondayStart; i++) {
      cells.push({ date: '', count: 0, month })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const count = readingMap.get(dateStr) || 0
      cells.push({ date: dateStr, count, month })
    }
  }
  return cells
}
