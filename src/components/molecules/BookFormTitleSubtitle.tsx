'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormDragDropUpload } from '@/components/atoms/FormDragDropUpload'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormTitleSubtitleProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormTitleSubtitle({ book, onChange }: BookFormTitleSubtitleProps) {
  return (
    <BookFormSection title='Title & Cover'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Title *'
            value={book.title}
            onChange={(v) => onChange('title', v)}
            field='title'
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Subtitle'
            value={book.subtitle}
            onChange={(v) => onChange('subtitle', v)}
            field='subtitle'
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormDragDropUpload
            label='Cover Image / Thumbnail'
            value={book.coverImage}
            onChange={(v) => onChange('coverImage', v)}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}