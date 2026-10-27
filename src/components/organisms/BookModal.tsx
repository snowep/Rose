'use client'

import { Alert, Box, Dialog, DialogContent, DialogTitle, DialogActions, TextField, Button, MenuItem } from '@mui/material'
import { Book } from '@/lib/db'

import { useState, type FormEvent } from 'react'

interface BookModalProps {
  open: boolean
  onClose: () => void
  onSave: (book: Partial<Book>) => void | Promise<void>
  editingBook?: Book | null
}

export function BookModal({ open, onClose, onSave, editingBook }: BookModalProps) {
  return (
    <BookModalForm
      key={`${open}-${editingBook?.id ?? 'new'}-${editingBook?.updatedAt ?? ''}`}
      open={open}
      onClose={onClose}
      onSave={onSave}
      editingBook={editingBook}
    />
  )
}

function BookModalForm({ open, onClose, onSave, editingBook }: BookModalProps) {
  const [book, setBook] = useState<Partial<Book>>(() => editingBook ?? ({
    title: '',
    author: '',
    status: 'want-to-read',
    genre: '',
    rating: 0,
    pages: 0,
    progress: 0,
    tags: [],
    notes: '',
  }))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    if (!book.title?.trim() || !book.author?.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      await onSave(book)
      onClose()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save this book.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'calc(100% - 32px)' },
          maxHeight: { xs: '100dvh', sm: 'calc(100% - 64px)' },
          height: { xs: '100dvh', sm: 'auto' },
          borderRadius: { xs: 0, sm: 2 },
          display: 'flex',
        },
      }}
    >
      <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', py: 2 }}>
        <Box component="form" id="edit-book-form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={book.title || ''}
            onChange={e => setBook({ ...book, title: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Author"
            value={book.author || ''}
            onChange={e => setBook({ ...book, author: e.target.value })}
            fullWidth
            required
          />
          <TextField
            select
            label="Status"
            value={book.status || 'want-to-read'}
            onChange={e => setBook({ ...book, status: e.target.value as Book['status'] })}
            fullWidth
            required
          >
            <MenuItem value="reading">Reading</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="want-to-read">Want to Read</MenuItem>
          </TextField>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Genre"
              value={book.genre || ''}
              onChange={e => setBook({ ...book, genre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rating (0-5)"
              type="number"
              value={book.rating ?? ''}
              onChange={e => setBook({ ...book, rating: e.target.value === '' ? undefined : Number(e.target.value) })}
              fullWidth
              slotProps={{ htmlInput: { min: 0, max: 5, step: 1, inputMode: 'numeric' } }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Total Pages"
              type="number"
              value={book.pages ?? ''}
              onChange={e => setBook({ ...book, pages: e.target.value === '' ? undefined : Number(e.target.value) })}
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1, inputMode: 'numeric' } }}
            />
            <TextField
              label="Progress %"
              type="number"
              value={book.progress ?? ''}
              onChange={e => setBook({ ...book, progress: e.target.value === '' ? undefined : Number(e.target.value) })}
              fullWidth
              helperText="0-100"
              slotProps={{ htmlInput: { min: 0, max: 100, step: 1, inputMode: 'numeric' } }}
            />
          </Box>
          <TextField
            label="Tags (comma separated)"
            value={book.tags?.join(', ') || ''}
            onChange={e => setBook({ ...book, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            fullWidth
          />
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={book.notes || ''}
            onChange={e => setBook({ ...book, notes: e.target.value })}
            fullWidth
          />
          {saveError && <Alert severity="error">{saveError}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, justifyContent: 'flex-end', pb: { xs: 'calc(12px + env(safe-area-inset-bottom))', sm: 1.5 } }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" form="edit-book-form" variant="contained" disabled={saving || !book.title?.trim() || !book.author?.trim()}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}