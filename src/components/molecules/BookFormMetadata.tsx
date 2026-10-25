'use client'

import { Grid } from '@mui/material'
import { FormTagInput } from '@/components/atoms/FormTagInput'
import { FormISBNInput } from '@/components/atoms/FormISBNInput'
import { FormYearInput } from '@/components/atoms/FormYearInput'
import { FormSegmentedControl } from '@/components/atoms/FormSegmentedControl'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormMetadataProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormMetadata({ book, onChange }: BookFormMetadataProps) {
  const authors = book.author ? book.author.split(',').map((a: string) => a.trim()) : []
  const genres = book.genre ? book.genre.split(',').map((g: string) => g.trim()) : []
  const shelves = book.shelf ? book.shelf.split(',').map((s: string) => s.trim()) : []

  return (
    <BookFormSection title='Metadata'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Primary Author(s)'
            value={authors}
            onChange={(v) => onChange('author', v.join(', '))}
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormISBNInput
            label='ISBN-10'
            value={book.isbn10}
            onChange={(v) => onChange('isbn10', v)}
            type='ISBN-10'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormISBNInput
            label='ISBN-13'
            value={book.isbn13}
            onChange={(v) => onChange('isbn13', v)}
            type='ISBN-13'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormYearInput
            label='Publication Year'
            value={book.publicationYear}
            onChange={(v) => onChange('publicationYear', v)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormSegmentedControl
            label='Reading Status'
            value={book.status || 'want-to-read'}
            onChange={(v) => onChange('status', v)}
            options={[
              { value: 'reading', label: 'Reading' },
              { value: 'read', label: 'Read' },
              { value: 'want-to-read', label: 'Want to Read' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Genre / Tags'
            value={genres}
            onChange={(v) => onChange('genre', v.join(', '))}
            options={['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Fantasy', 'Romance', 'Biography']}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTagInput
            label='Shelf List'
            value={shelves}
            onChange={(v) => onChange('shelf', v.join(', '))}
            options={['Fiction', 'Non-Fiction', 'Reference', 'Classics', 'Favorites']}
          />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}