'use client'

import { Grid } from '@mui/material'
import { PageContainer } from '@/components/molecules/PageContainer'
import { Heatmap } from '@/components/organisms/Heatmap'
import { StatCard } from '@/components/atoms/StatCard'
import { Book, LibraryBooks, CheckCircle, Flag } from '@mui/icons-material'

export function DashboardTemplate() {
  return (
    <PageContainer title="Dashboard">
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Total Books"
                value="0"
                sublabel="All time"
                icon={<Book fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Reading Now"
                value="0"
                sublabel="In progress"
                icon={<LibraryBooks fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Books Finished"
                value="0"
                sublabel="All time"
                icon={<CheckCircle fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Goal Progress"
                value="0%"
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