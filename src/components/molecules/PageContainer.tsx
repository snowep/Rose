'use client'

import { Box } from '@mui/material'
import { PageHeader } from '@/components/atoms/PageHeader'

export function PageContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ p: 4 }}>
      <PageHeader title={title} />
      {children}
    </Box>
  )
}
