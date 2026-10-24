'use client'

import { Box, Typography, Tabs, Tab } from '@mui/material'

type HeatmapMode = 'monthly' | 'yearly'

export function HeatmapHeader({
  mode,
  onModeChange,
}: {
  mode: HeatmapMode
  onModeChange: (mode: HeatmapMode) => void
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Heatmap
      </Typography>
      <Tabs
        value={mode}
        onChange={(_, newValue) => onModeChange(newValue as HeatmapMode)}
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
  )
}