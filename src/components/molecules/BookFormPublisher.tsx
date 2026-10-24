'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormPublisherProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormPublisher({ book, onChange }: BookFormPublisherProps) {
  return (
    <BookFormSection title='Publisher'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Publisher Name' value={book.publisherName} onChange={(v) => onChange('publisherName', v)} field='publisherName' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Imprint' value={book.imprint} onChange={(v) => onChange('imprint', v)} field='imprint' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Publisher Website' value={book.publisherWebsite} onChange={(v) => onChange('publisherWebsite', v)} field='publisherWebsite' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Publisher City' value={book.publisherCity} onChange={(v) => onChange('publisherCity', v)} field='publisherCity' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Publisher Country' value={book.publisherCountry} onChange={(v) => onChange('publisherCountry', v)} field='publisherCountry' />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}

