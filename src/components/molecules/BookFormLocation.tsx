'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormNumberField } from '@/components/atoms/FormNumberField'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { FormDatePicker } from '@/components/atoms/FormDatePicker'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormLocationProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormLocation({ book, onChange }: BookFormLocationProps) {
  return (
    <BookFormSection title='Location & Copies'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Room'
            value={book.room}
            onChange={(v) => onChange('room', v)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Shelf'
            value={book.shelf}
            onChange={(v) => onChange('shelf', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Section'
            value={book.section}
            onChange={(v) => onChange('section', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Row'
            value={book.row}
            onChange={(v) => onChange('row', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Bin'
            value={book.bin}
            onChange={(v) => onChange('bin', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            label='Position'
            value={book.position}
            onChange={(v) => onChange('position', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField
            label='Total Copies'
            value={book.totalCopies}
            onChange={(v) => onChange('totalCopies', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField
            label='Available Copies'
            value={book.availableCopies}
            onChange={(v) => onChange('availableCopies', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField
            label='Reserved Copies'
            value={book.reservedCopies}
            onChange={(v) => onChange('reservedCopies', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDatePicker
            label='Date Added'
            value={book.dateAdded}
            onChange={(v) => onChange('dateAdded', v)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Location Notes'
            value={book.locationNotes}
            onChange={(v) => onChange('locationNotes', v)}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}