'use client'

import { Grid } from '@mui/material'
import { PageContainer } from '@/components/molecules/PageContainer'
import { Heatmap } from '@/components/organisms/Heatmap'
import { StatCard } from '@/components/atoms/StatCard'
import { Book, LibraryBooks, CheckCircle, Flag } from '@mui/icons-material'
import { useBooks } from '@/components/hooks/useBooks'
import { useMemo } from 'react'

export function DashboardTemplate() {
  const { books, loading } = useBooks()

  const stats = useMemo(() => {
    const total = books.length
    const reading = books.filter(b => b.status === 'reading').length
    const finished = books.filter(b => b.status === 'read').length
    const goalProgress = Math.min(100, Math.round((finished / 12) * 100))
    return { total, reading, finished, goalProgress }
  }, [books])

  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <div style={{ padding: 40 }}>Loading...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Dashboard">
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <StatCard
                label="Total Books"
                value={stats.total}
                sublabel="All time"
                icon={<Book fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <StatCard
                label="Reading Now"
                value={stats.reading}
                sublabel="In progress"
                icon={<LibraryBooks fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <StatCard
                label="Books Finished"
                value={stats.finished}
                sublabel="All time"
                icon={<CheckCircle fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <StatCard
                label="Goal Progress"
                value={`${stats.goalProgress}%`}
                sublabel="Monthly target"
                icon={<Flag fontSize="small" />}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Heatmap />
        </Grid>
      </Grid>
    </PageContainer>
  )
}