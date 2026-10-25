'use client'

import { Grid } from '@mui/material'
import { FormDragDropUpload } from '@/components/atoms/FormDragDropUpload'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { FormTextField } from '@/components/atoms/FormTextField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormImagesProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormImages({ book, onChange }: BookFormImagesProps) {
  return (
    <BookFormSection title='Images'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormDragDropUpload
            label='Cover Image'
            value={book.coverImage}
            onChange={(v) => onChange('coverImage', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Image Type'
            value={book.imageType}
            onChange={(v) => onChange('imageType', v)}
            options={[
              { value: 'front-cover', label: 'Front Cover' },
              { value: 'back-cover', label: 'Back Cover' },
              { value: 'spine', label: 'Spine' },
              { value: 'dust-jacket', label: 'Dust Jacket' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSegmentedControl
            label='Primary Image'
            value={book.primaryImage ? 'yes' : 'no'}
            onChange={(v) => onChange('primaryImage', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Image Notes'
            value={book.imageNotes}
            onChange={(v) => onChange('imageNotes', v)}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}