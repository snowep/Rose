'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { FormDatePicker } from '@/components/atoms/FormDatePicker'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormLendingProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormLending({ book, onChange }: BookFormLendingProps) {
  const loaned = book.loanedStatus === true

  return (
    <BookFormSection title='Lending'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSegmentedControl
            label='Loaned Out'
            value={loaned ? 'yes' : 'no'}
            onChange={(v) => onChange('loanedStatus', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        {loaned && (
          <>
            <Grid size={{ xs: 12 }}>
              <FormTextField
                label='Borrower'
                value={book.borrowerName}
                onChange={(v) => onChange('borrowerName', v)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                label='Borrower Email'
                value={book.borrowerEmail}
                onChange={(v) => onChange('borrowerEmail', v)}
                type='email'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                label='Borrower Phone'
                value={book.borrowerPhone}
                onChange={(v) => onChange('borrowerPhone', v)}
                type='tel'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormDatePicker
                label='Loan Date'
                value={book.loanDate}
                onChange={(v) => onChange('loanDate', v)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormDatePicker
                label='Due Date'
                value={book.dueDate}
                onChange={(v) => onChange('dueDate', v)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormDatePicker
                label='Return Date'
                value={book.returnDate}
                onChange={(v) => onChange('returnDate', v)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField
                label='Loan Notes'
                value={book.loanNotes}
                onChange={(v) => onChange('loanNotes', v)}
                multiline
                rows={3}
              />
            </Grid>
          </>
        )}
      </Grid>
    </BookFormSection>
  )
}