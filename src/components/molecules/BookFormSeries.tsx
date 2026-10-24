'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormSeriesProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormSeries({ book, onChange }: BookFormSeriesProps) {
  return (
    <BookFormSection title='Series'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Series Name' value={book.seriesName} onChange={(v) => onChange('seriesName', v)} field='seriesName' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Series Number' value={book.seriesNumber} onChange={(v) => onChange('seriesNumber', v)} field='seriesNumber' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Total Volumes' value={book.totalVolumes} onChange={(v) => onChange('totalVolumes', v)} field='totalVolumes' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Sub-series' value={book.subSeries} onChange={(v) => onChange('subSeries', v)} field='subSeries' />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}

