'use client'

import { Box, Typography, Select, MenuItem } from '@mui/material'

type HeatmapMode = 'weekly' | 'monthly' | 'yearly'

export function HeatmapHeader({
  mode,
  onModeChange,
}: {
  mode: HeatmapMode
  onModeChange: (mode: HeatmapMode) => void
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h5" sx={{ mr: 2 }}>
        Heatmap
      </Typography>
      <Select
        value={mode}
        onChange={(e) => onModeChange(e.target.value as HeatmapMode)}
        sx={{ width: 120 }}
      >
        <MenuItem value="weekly">This Week</MenuItem>
        <MenuItem value="monthly">This Month</MenuItem>
        <MenuItem value="yearly">This Year</MenuItem>
      </Select>
    </Box>
  )
}