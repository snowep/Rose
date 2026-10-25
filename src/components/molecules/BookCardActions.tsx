'use client'

import { Box } from '@mui/material'
import { TagList } from '@/components/atoms/TagList'

interface BookCardActionsProps {
  tags?: string[]
}

export function BookCardActions({ tags }: BookCardActionsProps) {
  return (
    <Box sx={{ mt: 1 }}>
      <TagList tags={tags} />
    </Box>
  )
}