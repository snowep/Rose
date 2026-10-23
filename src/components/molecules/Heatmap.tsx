'use client'

import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { HeatmapHeader } from '@/components/atoms/HeatmapHeader'
import { HeatmapGrid } from '@/components/molecules/HeatmapGrid'
import { BookService } from '@/lib/book-service'
import { useEffect, useState } from 'react'

type HeatmapCell = {
  date: string
  count: number
}

function getColorForCount(count: number): string {
  if (count === 0) return '#161b22'
  if (count <= 2) return '#0e4429'
  if (count <= 4) return '#006d32'
  if (count <= 6) return '#26a641'
  return '#39d353'
}

function aggregateReadingData(books: any[]): Map<string, number> {
  const readingMap = new Map<string, number>()
  
  books.forEach(book => {
    if (book.dailyLog && Array.isArray(book.dailyLog)) {
      book.dailyLog.forEach((log: any) => {
        if (log.date && log.pagesRead) {
          const current = readingMap.get(log.date) || 0
          readingMap.set(log.date, current + log.pagesRead)
        }
      })
    }
  })
  
  return readingMap
}

function generateWeeklyCells(readingMap: Map<string, number>): any[] {
  const cells: any[] = []
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

function generateMonthlyCells(readingMap: Map<string, number>): any[] {
  const cells: any[] = []
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

function generateYearCells(readingMap: Map<string, number>): any[] {
  const cells: any[] = []
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

export function Heatmap() {
  const [mode, setMode] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const [readingMap, setReadingMap] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReadingData = async () => {
      try {
        const books = await BookService.getAll()
        const readingMap = aggregateReadingData(books)
        setReadingMap(readingMap)
      } catch (err) {
        console.error('Failed to load reading data for heatmap:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReadingData()
  }, [])

  const cells = React.useMemo(() => {
    if (mode === 'weekly') return generateWeeklyCells(readingMap)
    if (mode === 'monthly') return generateMonthlyCells(readingMap)
    return generateYearCells(readingMap)
  }, [mode, readingMap])

  return (
    <Box sx={{ p: 2, bgcolor: 'surface', borderRadius: 2, py: 3 }}>
      <HeatmapHeader mode={mode} onModeChange={setMode} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography color="text.secondary">Loading reading activity...</Typography>
        </Box>
      ) : (
        <HeatmapGrid cells={cells} mode={mode} />
      )}
    </Box>
  )
}