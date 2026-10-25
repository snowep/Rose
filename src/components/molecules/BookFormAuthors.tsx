'use client'

import { Grid } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookFormAuthorsProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormAuthors({ book, onChange }: BookFormAuthorsProps) {
  return (
    <BookFormSection title='Authors and Contributors'>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Author Role' value={book.authorRole} onChange={(v) => onChange('authorRole', v)} field='authorRole' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Translator' value={book.translator} onChange={(v) => onChange('translator', v)} field='translator' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Editor' value={book.editor} onChange={(v) => onChange('editor', v)} field='editor' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Illustrator' value={book.illustrator} onChange={(v) => onChange('illustrator', v)} field='illustrator' />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField label='Cover Artist' value={book.coverArtist} onChange={(v) => onChange('coverArtist', v)} field='coverArtist' />
        </Grid>
      </Grid>
    </BookFormSection>
  )
}
