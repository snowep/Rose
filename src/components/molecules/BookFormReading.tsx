'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormNumberField } from '@/components/atoms/FormNumberField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormReadingProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormReading({ book, onChange }: BookFormReadingProps) {
  return (
    <BookFormSection title='Reading Status'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField label='Progress Page' value={book.progressPage} onChange={(v) => onChange('progressPage', v)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField label='Progress Percent' value={book.progressPercent} onChange={(v) => onChange('progressPercent', v)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Start Date' value={book.startDate} onChange={(v) => onChange('startDate', v)} field='startDate' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Finish Date' value={book.finishDate} onChange={(v) => onChange('finishDate', v)} field='finishDate' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField label='Rating' value={book.rating} onChange={(v) => onChange('rating', v)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Review' value={book.review} onChange={(v) => onChange('review', v)} field='review' />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}

