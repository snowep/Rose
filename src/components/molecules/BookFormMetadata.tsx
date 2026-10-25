'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { FormTagInput } from '@/components/atoms/FormTagInput'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormMetadataProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormMetadata({ book, onChange }: BookFormMetadataProps) {
  return (
    <BookFormSection title='Classification & Metadata'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Dewey Decimal'
            value={book.deweyDecimal}
            onChange={(v) => onChange('deweyDecimal', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Library of Congress Classification'
            value={book.libraryOfCongressClassification}
            onChange={(v) => onChange('libraryOfCongressClassification', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Classification Scheme'
            value={book.classificationScheme}
            onChange={(v) => onChange('classificationScheme', v)}
            options={[
              { value: 'dewey', label: 'Dewey Decimal' },
              { value: 'lcc', label: 'Library of Congress' },
              { value: 'udc', label: 'UDC' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Classification Value'
            value={book.classificationValue}
            onChange={(v) => onChange('classificationValue', v)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Keywords'
            value={book.keywords ? book.keywords.split(',').map((k: string) => k.trim()) : []}
            onChange={(v) => onChange('keywords', v.join(', '))}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Data Source'
            value={book.dataSource}
            onChange={(v) => onChange('dataSource', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSegmentedControl
            label='Verified'
            value={book.verifiedStatus ? 'yes' : 'no'}
            onChange={(v) => onChange('verifiedStatus', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Admin Notes'
            value={book.notes}
            onChange={(v) => onChange('notes', v)}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}