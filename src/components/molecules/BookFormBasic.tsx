import { useState, useEffect } from 'react'
import { Box, Stack, TextField, Chip, InputAdornment } from '@mui/material'
import { FormField } from '@/components/atoms/FormField'
import { FormISBNInput } from '@/components/atoms/FormISBNInput'
import { FormTagInput } from '@/components/atoms/FormTagInput'
import { FormYearInput } from '@/components/atoms/FormYearInput'
import { FormDragDropUpload } from '@/components/atoms/FormDragDropUpload'
import { Search as SearchIcon } from '@mui/icons-material'
import type { BookFormState } from '@/types/book-form'
import type { Book } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'

type StatusOption = { value: Book['status']; label: string }

interface AuthorOption {
  id: string
  name: string
  nationality?: string
}

function splitAuthors(input: string[]): string[] {
  const result: string[] = []
  for (const a of input) {
    if (a.includes(',')) {
      result.push(...a.split(',').map((s) => s.trim()).filter(Boolean))
    } else if (a.trim()) {
      result.push(a.trim())
    }
  }
  return result
}

export function BookFormBasic({ book, onChange }: { book: BookFormState; onChange: (book: BookFormState) => void }) {
  const [authorOptions, setAuthorOptions] = useState<AuthorOption[]>([])
  const [authorInputValue, setAuthorInputValue] = useState('')
  const statusOptions: { value: Book['status']; label: string }[] = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Read' },
    { value: 'read', label: 'Read' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'dnf', label: 'Did Not Finish' },
  ]

  // Fetch author suggestions
  useEffect(() => {
    const fetchAuthors = async () => {
      if (authorInputValue.length < 2) {
        setAuthorOptions([])
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('people')
          .select('id, name')
          .ilike('name', `%${authorInputValue}%`)
          .limit(10)

        if (data) {
          setAuthorOptions(data.map((p: any) => ({
            id: p.id,
            name: p.name,
            nationality: undefined
          })))
        }
      } catch (e) {
        console.error('Error fetching authors:', e)
      }
    }

    const timeout = setTimeout(fetchAuthors, 300)
    return () => clearTimeout(timeout)
  }, [authorInputValue])

  const handleStatusChange = (value: string) => {
    const option = statusOptions.find((status) => status.value === value)
    if (option) onChange({ ...book, status: option.value })
  }

  const update = (values: Partial<BookFormState>) => onChange({ ...book, ...values })

  // Handle author selection from dropdown
  const handleSelectAuthor = (option: AuthorOption) => {
    if (!book.authors.includes(option.name)) {
      setAuthorInputValue('')
      update({ authors: [...book.authors, option.name] })
    }
  }

  // Handle author input - add on comma or Enter
  const handleAuthorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setAuthorInputValue(value)

    // Add author on comma
    if (value.endsWith(',')) {
      const newAuthor = value.slice(0, -1).trim()
      if (newAuthor) {
        const allAuthors = [...book.authors, newAuthor]
        update({ authors: Array.from(new Set(allAuthors)) })
      }
      setAuthorInputValue('')
    }

    // Add author on Enter (without comma) - only if not already in list
    if (value.includes('\n') || value.endsWith(' ')) {
      const parts = value.trim().split(/\s+/)
      const newAuthor = parts[0]
      if (newAuthor && !newAuthor.includes(',')) {
        const allAuthors = [...book.authors, newAuthor]
        update({ authors: Array.from(new Set(allAuthors)) })
      }
      setAuthorInputValue('')
    }
  }

  const handleAuthorKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !authorInputValue && book.authors.length > 0) {
      const newAuthors = [...book.authors]
      newAuthors.pop()
      update({ authors: newAuthors })
    } else if (event.key === 'Enter' && authorInputValue.trim()) {
      event.preventDefault()
      const newAuthor = authorInputValue.trim()
      if (!book.authors.includes(newAuthor)) {
        update({ authors: [...book.authors, newAuthor] })
      }
      setAuthorInputValue('')
    }
  }

  const handleAuthorDelete = (authorToDelete: string) => {
    update({ authors: book.authors.filter(a => a !== authorToDelete) })
  }

  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <FormField label="Title" type="text" value={book.title} onChange={(title) => update({ title })} required />
      <FormField label="Subtitle" type="text" value={book.subtitle || ''} onChange={(subtitle) => update({ subtitle })} />
      <FormDragDropUpload label="Cover image" value={book.coverImage} onChange={(coverImage) => update({ coverImage })} />

      {/* Authors - Single input, comma-separated for multiple authors */}
      <Box>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Primary author(s) <span style={{ color: '#d32f2f' }}>*</span>
        </label>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, border: '1px solid #ccc', borderRadius: 4, minHeight: '56px' }}>
          {book.authors.map((author) => (
            <Chip
              key={author}
              label={author}
              onDelete={() => handleAuthorDelete(author)}
              size="small"
            />
          ))}
          <TextField
            size="small"
            variant="outlined"
            value={authorInputValue}
            onChange={handleAuthorInputChange}
            onKeyDown={handleAuthorKeyDown}
            placeholder="Type and press comma or Enter to add..."
            sx={{ flex: 1, minWidth: '120px' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          {authorOptions.length > 0 && book.authors.includes(authorInputValue) === false && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              {authorOptions.map((option) => (
                <Chip
                  key={option.id}
                  label={option.name}
                  size="small"
                  variant="outlined"
                  onClick={() => handleSelectAuthor(option)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
          <Box sx={{ fontSize: '0.85rem', color: '#666' }}>
            Click a name to select, or type and press comma/Enter
          </Box>
        </Box>
      </Box>

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

      <FormField
        label="Reading status"
        type="select"
        value={book.status || 'want-to-read'}
        onChange={handleStatusChange}
        options={statusOptions}
      />
    </Stack>
  )
}