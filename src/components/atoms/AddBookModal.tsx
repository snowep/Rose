'use client'

import * as React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material'

type BookForm = {
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
}

export function AddBookModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (book: BookForm) => void
}) {
  const [form, setForm] = React.useState<BookForm>({
    title: '',
    author: '',
    status: 'want-to-read',
  })

  const handleClose = () => {
    setForm({ title: '', author: '', status: 'want-to-read' })
    onClose()
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.author.trim()) return
    onSave(form)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Book</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Author"
          fullWidth
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <TextField
          select
          margin="dense"
          label="Status"
          fullWidth
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as BookForm['status'] })}
        >
          <MenuItem value="reading">Reading</MenuItem>
          <MenuItem value="read">Read</MenuItem>
          <MenuItem value="want-to-read">Want to Read</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}