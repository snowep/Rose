'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormNumberField } from '@/components/atoms/FormNumberField'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormAwardsProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormAwards({ book, onChange }: BookFormAwardsProps) {
  return (
    <BookFormSection title='Awards'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Award'
            value={book.award}
            onChange={(v) => onChange('award', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField
            label='Award Year'
            value={book.awardYear}
            onChange={(v) => onChange('awardYear', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Result'
            value={book.awardResult}
            onChange={(v) => onChange('awardResult', v)}
            options={[
              { value: 'winner', label: 'Winner' },
              { value: 'finalist', label: 'Finalist' },
              { value: 'nominee', label: 'Nominee' },
              { value: 'longlist', label: 'Longlist' },
              { value: 'shortlist', label: 'Shortlist' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Award Notes'
            value={book.awardNotes}
            onChange={(v) => onChange('awardNotes', v)}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}