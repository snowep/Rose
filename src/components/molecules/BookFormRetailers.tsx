'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormNumberField } from '@/components/atoms/FormNumberField'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { FormTagInput } from '@/components/atoms/FormTagInput'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormRetailersProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormRetailers({ book, onChange }: BookFormRetailersProps) {
  const retailers = book.retailer ? book.retailer.split(',').map((r: string) => r.trim()) : []
  const retailerUrls = book.retailerUrl ? book.retailerUrl.split(',').map((u: string) => u.trim()) : []
  const retailerPrices = book.retailerPrice ? book.retailerPrice.split(',').map((p: string) => parseFloat(p.trim()) || 0) : []
  const retailerCurrencies = book.retailerCurrency ? book.retailerCurrency.split(',').map((c: string) => c.trim()) : []
  const retailerStockStatus = book.retailerStockStatus ? book.retailerStockStatus.split(',').map((s: string) => s.trim()) : []
  const retailerNotes = book.retailerNotes ? book.retailerNotes.split(',').map((n: string) => n.trim()) : []

  return (
    <BookFormSection title='Retailers'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Retailer'
            value={retailers}
            onChange={(v) => onChange('retailer', v.join(', '))}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Retailer URL'
            value={retailerUrls}
            onChange={(v) => onChange('retailerUrl', v.join(', '))}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTagInput
            label='Price'
            value={retailerPrices.map(String)}
            onChange={(v) => onChange('retailerPrice', v.join(', '))}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTagInput
            label='Currency'
            value={retailerCurrencies}
            onChange={(v) => onChange('retailerCurrency', v.join(', '))}
            options={['USD', 'EUR', 'GBP', 'MYR', 'JPY', 'CNY']}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTagInput
            label='Stock Status'
            value={retailerStockStatus}
            onChange={(v) => onChange('retailerStockStatus', v.join(', '))}
            options={['In Stock', 'Out of Stock', 'Limited', 'Pre-order', 'Discontinued']}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Retailer Notes'
            value={retailerNotes}
            onChange={(v) => onChange('retailerNotes', v.join(', '))}
            options={[]}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}