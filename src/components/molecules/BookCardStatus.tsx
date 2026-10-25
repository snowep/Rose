'use client'

import { Box } from '@mui/material'
import { ProgressBar } from '@/components/atoms/ProgressBar'

interface BookCardStatusProps {
  pages?: number
  progress?: number
  status: 'reading' | 'read' | 'want-to-read'
}

export function BookCardStatus({ pages, progress, status }: BookCardStatusProps) {
  return (
    <Box sx={{ mt: 'auto' }}>
      <ProgressBar pages={pages} progress={progress} status={status} />
    </Box>
  )
}