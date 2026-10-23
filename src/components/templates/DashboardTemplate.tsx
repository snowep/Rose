'use client'

import { PageContainer } from '@/components/molecules/PageContainer'
import { Heatmap } from '@/components/organisms/Heatmap'

export function DashboardTemplate() {
  return (
    <PageContainer title="Dashboard">
      <Heatmap />
    </PageContainer>
  )
}