'use client'

import { Box, Typography, LinearProgress } from '@mui/material'

import type { BookStatus } from '@/components/atoms/StatusChip'

const statusColors: Record<BookStatus, string> = {
  reading: '#1976d2',
  read: '#2e7d32',
  'want-to-read': '#0288d1',
  'on-hold': '#f57c00',
  dnf: '#c62828',
}

export function ProgressBar({
  pages,
  progress,
  status,
}: {
  pages?: number
  progress?: number
  status: BookStatus
}) {
  if (!pages || progress === undefined || pages <= 0) return null

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {progress}% of {pages} pages
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {Math.round((pages * progress) / 100)} / {pages}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: statusColors[status],
          }
        }}
      />
    </Box>
  )
}
