'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormNumberField } from '@/components/atoms/FormNumberField'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { FormDatePicker } from '@/components/atoms/FormDatePicker'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormOwnershipProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormOwnership({ book, onChange }: BookFormOwnershipProps) {
  return (
    <BookFormSection title='Ownership & Purchase'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSegmentedControl
            label='Owned'
            value={book.ownedStatus ? 'yes' : 'no'}
            onChange={(v) => onChange('ownedStatus', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Owner'
            value={book.ownerName}
            onChange={(v) => onChange('ownerName', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Acquired By'
            value={book.acquiredBy}
            onChange={(v) => onChange('acquiredBy', v)}
            options={[
              { value: 'bought', label: 'Bought' },
              { value: 'gift', label: 'Gift' },
              { value: 'donation', label: 'Donation' },
              { value: 'inherited', label: 'Inherited' },
              { value: 'found', label: 'Found' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Purchase Source'
            value={book.purchaseSource}
            onChange={(v) => onChange('purchaseSource', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormNumberField
            label='Purchase Price'
            value={book.purchasePrice}
            onChange={(v) => onChange('purchasePrice', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Currency'
            value={book.currency}
            onChange={(v) => onChange('currency', v)}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'MYR', label: 'MYR' },
              { value: 'JPY', label: 'JPY' },
              { value: 'CNY', label: 'CNY' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDatePicker
            label='Purchase Date'
            value={book.purchaseDate}
            onChange={(v) => onChange('purchaseDate', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSelectField
            label='Condition'
            value={book.condition}
            onChange={(v) => onChange('condition', v)}
            options={[
              { value: 'new', label: 'New' },
              { value: 'like-new', label: 'Like New' },
              { value: 'very-good', label: 'Very Good' },
              { value: 'good', label: 'Good' },
              { value: 'fair', label: 'Fair' },
              { value: 'poor', label: 'Poor' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Condition Notes'
            value={book.conditionNotes}
            onChange={(v) => onChange('conditionNotes', v)}
            multiline
            rows={2}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormSegmentedControl
            label='Signed'
            value={book.signed ? 'yes' : 'no'}
            onChange={(v) => onChange('signed', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormSegmentedControl
            label='First Edition'
            value={book.firstEdition ? 'yes' : 'no'}
            onChange={(v) => onChange('firstEdition', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormSegmentedControl
            label='Rare'
            value={book.rareBook ? 'yes' : 'no'}
            onChange={(v) => onChange('rareBook', v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label='Provenance'
            value={book.provenance}
            onChange={(v) => onChange('provenance', v)}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}