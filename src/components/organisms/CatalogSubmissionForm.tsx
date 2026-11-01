import { useState, useCallback } from 'react'
import { Box, Button, Paper, Typography, Alert, InputAdornment, CircularProgress } from '@mui/material'
import { FormField } from '../atoms/FormField'
import { BookService } from '../../lib/book-service'
import { lookupISBN, isValidISBN, normalizeISBN } from '../../lib/utils'

export default function CatalogSubmissionForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [form, setForm] = useState({ title: '', subtitle: '', author: '', isbn13: '', publisher: '', genre: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [isbnError, setIsbnError] = useState<string | null>(null)
  const [isbnLoading, setIsbnLoading] = useState(false)

  const handleIsbnChange = useCallback(async (value: string) => {
    const clean = normalizeISBN(value)
    setForm(prev => ({ ...prev, isbn13: value }))
    setIsbnError(null)

    if (!clean) return
    if (!isValidISBN(clean)) {
      setIsbnError('Invalid ISBN format')
      return
    }

    setIsbnLoading(true)
    try {
      const bookData = await lookupISBN(clean, { timeout: 5000 })
      if (bookData) {
        setForm(prev => ({
          ...prev,
          title: bookData.title || prev.title,
          subtitle: bookData.subtitle || prev.subtitle,
          author: bookData.author || prev.author,
          publisher: bookData.publisher || prev.publisher,
          genre: bookData.genre || prev.genre,
        }))
      } else {
        setIsbnError('No book found for this ISBN')
      }
    } finally {
      setIsbnLoading(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await BookService.recordOutbox('book', crypto.randomUUID(), 'create', form)
      onSubmitted?.()
      setForm({ title: '', subtitle: '', author: '', isbn13: '', publisher: '', genre: '', notes: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Submit to Catalog</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormField
          label="ISBN13"
          value={form.isbn13}
          onChange={handleIsbnChange}
          endAdornment={
            <InputAdornment position="end">
              {isbnLoading ? <CircularProgress size={20} color="inherit" /> : null}
            </InputAdornment>
          }
          error={!!isbnError}
          helperText={isbnError || undefined}
        />
        <FormField label="Title" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} required />
        <FormField label="Subtitle" value={form.subtitle} onChange={v => setForm({ ...form, subtitle: v })} />
        <FormField label="Author" value={form.author} onChange={v => setForm({ ...form, author: v })} />
        <FormField label="Publisher" value={form.publisher} onChange={v => setForm({ ...form, publisher: v })} />
        <FormField label="Genre" value={form.genre} onChange={v => setForm({ ...form, genre: v })} />
        <FormField label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} multiline />
        <Button type="submit" disabled={loading || !form.title || isbnLoading}>Submit</Button>
      </Box>
    </Paper>
  )
}
