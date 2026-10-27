'use client'

import { Box } from '@mui/material'
import { PageHeader } from '@/components/atoms/PageHeader'

export function PageContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <PageHeader title={title} />
      {children}
    </Box>
  )
}
