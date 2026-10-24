'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormCoreIdentityProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormCoreIdentity({ book, onChange }: BookFormCoreIdentityProps) {
  return (
    <BookFormSection title='Core Book Identity'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Subtitle' value={book.subtitle} onChange={(v) => onChange('subtitle', v)} field='subtitle' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Original Title' value={book.originalTitle} onChange={(v) => onChange('originalTitle', v)} field='originalTitle' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='ISBN-10' value={book.isbn10} onChange={(v) => onChange('isbn10', v)} field='isbn10' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='ISBN-13' value={book.isbn13} onChange={(v) => onChange('isbn13', v)} field='isbn13' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Barcode' value={book.barcode} onChange={(v) => onChange('barcode', v)} field='barcode' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='ASIN' value={book.asin} onChange={(v) => onChange('asin', v)} field='asin' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Cover Image URL' value={book.coverImage} onChange={(v) => onChange('coverImage', v)} field='coverImage' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Language' value={book.language} onChange={(v) => onChange('language', v)} field='language' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Edition' value={book.edition} onChange={(v) => onChange('edition', v)} field='edition' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Volume Number' value={book.volumeNumber} onChange={(v) => onChange('volumeNumber', v)} field='volumeNumber' />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}

