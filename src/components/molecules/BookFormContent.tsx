'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormTextArea } from '@/components/atoms/FormTextArea'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormContentProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormContent({ book, onChange }: BookFormContentProps) {
  return (
    <BookFormSection title='Content and Organization'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextArea label='Description' value={book.description} onChange={(v) => onChange('description', v)} rows={3} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Genres' value={book.genres} onChange={(v) => onChange('genres', v)} field='genres' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Subjects' value={book.subjects} onChange={(v) => onChange('subjects', v)} field='subjects' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Tags' value={book.tags} onChange={(v) => onChange('tags', v)} field='tags' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Keywords' value={book.keywords} onChange={(v) => onChange('keywords', v)} field='keywords' />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}

