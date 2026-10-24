'use client'

import { Typography, Box } from '@mui/material'

interface BookFormSectionProps {
  title: string
  children: React.ReactNode
}

export function BookFormSection({ title, children }: BookFormSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

