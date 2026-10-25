'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormRelatedProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormRelated({ book, onChange }: BookFormRelatedProps) {
  return (
    <BookFormSection title='Related Works'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Related Work'
            value={book.relatedTitle}
            onChange={(v) => onChange('relatedTitle', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Relationship Type'
            value={book.relationshipType}
            onChange={(v) => onChange('relationshipType', v)}
            options={[
              { value: 'sequel', label: 'Sequel' },
              { value: 'prequel', label: 'Prequel' },
              { value: 'adaptation', label: 'Adaptation' },
              { value: 'translation', label: 'Translation' },
              { value: 'spin-off', label: 'Spin-off' },
              { value: 'anthology', label: 'Anthology' },
              { value: 'companion', label: 'Companion' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Related ISBN'
            value={book.relatedIsbn}
            onChange={(v) => onChange('relatedIsbn', v)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Related Notes'
            value={book.relatedNotes}
            onChange={(v) => onChange('relatedNotes', v)}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}