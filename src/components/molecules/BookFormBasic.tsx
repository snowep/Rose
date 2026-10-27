import { Box, Stack } from '@mui/material'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormISBNInput } from '@/components/atoms/FormISBNInput'
import { FormTagInput } from '@/components/atoms/FormTagInput'
import { FormYearInput } from '@/components/atoms/FormYearInput'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { FormDragDropUpload } from '@/components/atoms/FormDragDropUpload'
import type { BookFormState } from '@/types/book-form'
import type { Book } from '@/lib/db'

export function BookFormBasic({ book, onChange }: { book: BookFormState; onChange: (book: BookFormState) => void }) {
  const update = (values: Partial<BookFormState>) => onChange({ ...book, ...values })
  const statusOptions: { value: Book['status']; label: string }[] = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'read', label: 'Read' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'dnf', label: 'DNF' },
  ]
  const handleStatusChange = (value: string) => {
    const option = statusOptions.find((status) => status.value === value)
    if (option) update({ status: option.value })
  }

  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <FormTextField label="Title" value={book.title} onChange={(title) => update({ title })} required />
      <FormTextField label="Subtitle" value={book.subtitle || ''} onChange={(subtitle) => update({ subtitle })} />
      <FormDragDropUpload label="Cover image" value={book.coverImage} onChange={(coverImage) => update({ coverImage })} />
      <FormTagInput
        label="Primary author(s)"
        value={book.authors}
        onChange={(authors) => update({ authors })}
        options={[]}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <FormISBNInput type="ISBN-10" label="ISBN-10" value={book.isbn10} onChange={(isbn10) => update({ isbn10 })} />
        <FormISBNInput type="ISBN-13" label="ISBN-13" value={book.isbn13} onChange={(isbn13) => update({ isbn13 })} />
      </Box>
      <FormYearInput
        label="Publication year"
        value={book.publicationYear}
        onChange={(value) => update({ publicationYear: value === '' ? undefined : Number(value) })}
      />
      <FormTagInput
        label="Genre(s)"
        value={book.genre ? book.genre.split(',').map((genre) => genre.trim()).filter(Boolean) : []}
        onChange={(genres) => update({ genre: genres.join(', ') })}
        options={['Fiction', 'Non-fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'History', 'Biography', 'Children']}
      />
      <FormTagInput
        label="Tags"
        value={book.tags || []}
        onChange={(tags) => update({ tags })}
        options={[]}
      />
      <FormSelectField
        label="Reading status"
        value={book.status || 'want-to-read'}
        onChange={handleStatusChange}
        options={statusOptions}
      />
    </Stack>
  )
}