'use client'

import { Box, Typography, Paper } from '@mui/material'

interface StatCardProps {
  label: string
  value: string | number
  sublabel?: string
  icon?: React.ReactNode
}

export function StatCard({ label, value, sublabel, icon }: StatCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        bgcolor: 'surface',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {icon && <Box>{icon}</Box>}
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        {sublabel && (
          <Typography variant="caption" color="text.secondary">
            {sublabel}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}
