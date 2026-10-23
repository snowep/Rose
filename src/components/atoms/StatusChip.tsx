'use client'

import { Chip } from '@mui/material'

type BookStatus = 'reading' | 'read' | 'want-to-read'

const statusColors: Record<BookStatus, string> = {
  reading: '#1976d2',
  read: '#2e7d32',
  'want-to-read': '#0288d1',
}

export function StatusChip({ status }: { status: BookStatus }) {
  return (
    <Chip
      label={status.replace('-', ' ')}
      size="small"
      sx={{
        backgroundColor: `${statusColors[status]}20`,
        color: statusColors[status],
        fontSize: '0.7rem',
        height: 20,
        textTransform: 'capitalize',
      }}
    />
  )
}
