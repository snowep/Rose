'use client'

import * as React from 'react'
import { Box, Typography, Paper, Tabs, Tab, useTheme } from '@mui/material'
import { HeatmapCell } from '@/components/atoms/HeatmapCell'
import { HeatmapGrid } from '@/components/molecules/HeatmapGrid'
import { useReadingData } from '@/components/hooks/useReadingData'
import { useHeatmapCells } from '@/components/hooks/useHeatmapCells'

export function Heatmap() {
  const [mode, setMode] = React.useState<'monthly' | 'yearly'>('monthly')
  const { readingMap, loading } = useReadingData()
  const cells = useHeatmapCells(mode, readingMap)

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: 'surface',
        borderRadius: 2,
        py: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Heatmap
        </Typography>
        <Tabs
          value={mode}
          onChange={(_, newValue) => setMode(newValue as 'monthly' | 'yearly')}
          variant="fullWidth"
          sx={{
            minHeight: 32,
            '& .MuiTab-root': {
              minHeight: 32,
              fontSize: '0.75rem',
              textTransform: 'none',
            },
            '& .MuiTabs-indicator': {
              height: 2,
            },
          }}
        >
          <Tab label="Month" value="monthly" />
          <Tab label="Year" value="yearly" />
        </Tabs>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography color="text.secondary">Loading reading activity...</Typography>
        </Box>
      ) : (
        <HeatmapGrid cells={cells} mode={mode} />
      )}
    </Paper>
  )
}