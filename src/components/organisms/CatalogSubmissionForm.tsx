import { useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { FormField } from '../atoms/FormField'
import { BookService } from '../../lib/book-service'

export default function CatalogSubmissionForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [form, setForm] = useState({ title: '', subtitle: '', author: '', isbn13: '', publisher: '', genre: '', notes: '' })
  const [loading, setLoading] = useState(false)

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
        <FormField label="Title" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} required />
        <FormField label="Subtitle" value={form.subtitle} onChange={v => setForm({ ...form, subtitle: v })} />
        <FormField label="Author" value={form.author} onChange={v => setForm({ ...form, author: v })} />
        <FormField label="ISBN13" value={form.isbn13} onChange={v => setForm({ ...form, isbn13: v })} />
        <FormField label="Publisher" value={form.publisher} onChange={v => setForm({ ...form, publisher: v })} />
        <FormField label="Genre" value={form.genre} onChange={v => setForm({ ...form, genre: v })} />
        <FormField label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} multiline />
        <Button type="submit" disabled={loading || !form.title}>Submit</Button>
      </Box>
    </Paper>
  )
}
