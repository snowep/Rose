'use client'

import * as React from 'react'
import { HeatmapContainer } from '@/components/atoms/HeatmapContainer'
import { HeatmapHeader } from '@/components/atoms/HeatmapHeader'
import { HeatmapGrid } from '@/components/molecules/HeatmapGrid'
import { HeatmapLoading } from '@/components/atoms/HeatmapLoading'
import { useReadingData } from '@/components/hooks/useReadingData'
import { useHeatmapCells } from '@/components/hooks/useHeatmapCells'

export function Heatmap() {
  const [mode, setMode] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const { readingMap, loading } = useReadingData()
  const cells = useHeatmapCells(mode, readingMap)

  return (
    <HeatmapContainer>
      <HeatmapHeader mode={mode} onModeChange={setMode} />
      {loading ? (
        <HeatmapLoading />
      ) : (
        <HeatmapGrid cells={cells} mode={mode} />
      )}
    </HeatmapContainer>
  )
}