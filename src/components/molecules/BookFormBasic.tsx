'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormBasicProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormBasic({ book, onChange }: BookFormBasicProps) {
  return (
    <BookFormSection title='Basic Information *'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Title *'
            value={book.title}
            onChange={(v) => onChange('title', v)}
            field='title'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Author *'
            value={book.author}
            onChange={(v) => onChange('author', v)}
            field='author'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Status'
            value={book.status}
            onChange={(v) => onChange('status', v)}
            options={[
              { value: 'reading', label: 'Reading' },
              { value: 'read', label: 'Read' },
              { value: 'want-to-read', label: 'Want to Read' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Genre'
            value={book.genre}
            onChange={(v) => onChange('genre', v)}
            field='genre'
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}

