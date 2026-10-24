'use client'

import { Box, Dialog, DialogContent, DialogTitle, DialogActions, TextField, Button, MenuItem, Typography, Divider } from '@mui/material'
import { Book } from '@/lib/db'

import React, { useEffect, useState } from 'react'

interface BookModalProps {
  open: boolean
  onClose: () => void
  onSave: (book: Partial<Book>) => void
  editingBook?: Book | null
}

export function BookModal({ open, onClose, onSave, editingBook }: BookModalProps) {
  const [book, setBook] = React.useState<Partial<Book>>({
    title: '',
    author: '',
    status: 'want-to-read',
    genre: '',
    rating: 0,
    pages: 0,
    progress: 0,
    tags: [],
    notes: '',
  })

  useEffect(() => {
    if (editingBook) {
      setBook(editingBook)
    } else if (open) {
      setBook({
        title: '',
        author: '',
        status: 'want-to-read',
        genre: '',
        rating: 0,
        pages: 0,
        progress: 0,
        tags: [],
        notes: '',
      })
    }
  }, [editingBook, open])

  const handleSave = () => {
    if (!book.title?.trim() || !book.author?.trim()) return
    onSave(book)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={book.title || ''}
            onChange={e => setBook({ ...book, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Author"
            value={book.author || ''}
            onChange={e => setBook({ ...book, author: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={book.status || 'want-to-read'}
            onChange={e => setBook({ ...book, status: e.target.value as any })}
            fullWidth
          >
            <MenuItem value="reading">Reading</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="want-to-read">Want to Read</MenuItem>
          </TextField>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Genre"
              value={book.genre || ''}
              onChange={e => setBook({ ...book, genre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rating (0-5)"
              type="number"
              value={book.rating || 0}
              onChange={e => setBook({ ...book, rating: Number(e.target.value) })}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Total Pages"
              type="number"
              value={book.pages || 0}
              onChange={e => setBook({ ...book, pages: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Progress %"
              type="number"
              value={book.progress || 0}
              onChange={e => setBook({ ...book, progress: Number(e.target.value) })}
              fullWidth
              helperText="0-100"
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}