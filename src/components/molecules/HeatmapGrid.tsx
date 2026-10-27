'use client'

import { Box, Typography } from '@mui/material'
import { HeatmapCell } from '@/components/atoms/HeatmapCell'

type HeatmapCellData = {
  date: string
  count: number
  month?: number
}

export function HeatmapGrid({ cells, mode }: { cells: HeatmapCellData[]; mode: 'monthly' | 'yearly' }) {
  const cellSize = 12
  const today = new Date().toISOString().split('T')[0]

  if (mode === 'yearly') {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // Group cells by month
    const months = monthNames.map((name, monthIdx) => {
      const monthCells = cells.filter(cell => cell.month === monthIdx)
      return { name, cells: monthCells }
    })

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
        {months.map((month) => (
          <Box key={month.name}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'text.secondary', fontSize: '0.7rem' }}>
              {month.name}
            </Typography>
            {/* Weekday headers for each month */}
            <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(7, ${cellSize}px)`, gap: 0.5, mb: 0.5 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <Typography key={`${day}-${idx}`} variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', textAlign: 'center' }}>
                  {day}
                </Typography>
              ))}
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 0.5,
                gridTemplateColumns: `repeat(7, ${cellSize}px)`,
              }}
            >
              {month.cells.map((cell, idx) => 
                cell.date ? (
                  <HeatmapCell key={cell.date} date={cell.date} count={cell.count} size={cellSize} isToday={cell.date === today} />
                ) : (
                  <Box key={`empty-${month.name}-${idx}`} sx={{ width: cellSize, height: cellSize }} />
                )
              )}
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  // Monthly view with calendar structure
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%', minWidth: 0 }}>
      {/* Weekday headers */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(7, ${cellSize}px)`,
        gap: 0.5,
        mb: 0.5,
        '@media (max-width: 599px)': { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
      }}>
        {weekdays.map((day, idx) => (
          <Typography key={`${day}-${idx}`} variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', textAlign: 'center' }}>
            {day}
          </Typography>
        ))}
      </Box>
      {weeks.map((week, wi) => (
        <Box key={wi} sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(7, ${cellSize}px)`,
          gap: 0.5,
          '@media (max-width: 599px)': { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
        }}>
          {week.map((cell, di) => (
            cell.date ? (
              <HeatmapCell key={cell.date} date={cell.date} count={cell.count} size={cellSize} isToday={cell.date === today} responsive />
            ) : (
              <Box
                key={`empty-${wi}-${di}`}
                sx={{
                  width: cellSize,
                  height: cellSize,
                  '@media (max-width: 599px)': { width: '100%', height: 'auto', aspectRatio: '1' },
                }}
              />
            )
          ))}
        </Box>
      ))}
    </Box>
  )
}