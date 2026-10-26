'use client'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useState } from 'react'
import { BookService } from '@/lib/book-service'
import { PersonPicker } from '@/components/atoms/PersonPicker'

interface AuthorEntry {
  personId: string
  personName: string
  role: string
}

export function AddBookModalSimple({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState<AuthorEntry[]>([])
  const [isbn10, setIsbn10] = useState('')
  const [isbn13, setIsbn13] = useState('')
  const [status, setStatus] = useState<'reading' | 'read' | 'want-to-read' | 'on-hold' | 'dnf'>('want-to-read')

  const handleSave = async () => {
    if (!title) return
    const authorNames = authors.map(a => a.personName).filter(Boolean)
    await BookService.create({ title, author: authorNames.join(', '), isbn10: isbn10 || undefined, isbn13: isbn13 || undefined, status, progress: 0 })
    setTitle(''); setAuthors([]); setIsbn10(''); setIsbn13(''); setStatus('want-to-read')
    onClose()
  }

  const statuses = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'read', label: 'Read' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'dnf', label: 'DNF' },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Book</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <PersonPicker
          label="Author"
          value={authors}
          onChange={setAuthors}
          roleOptions={[{ value: 'author', label: 'author' }]}
          defaultRole="author"
        />
        <TextField label="ISBN10" value={isbn10} onChange={e => setIsbn10(e.target.value)} />
        <TextField label="ISBN13" value={isbn13} onChange={e => setIsbn13(e.target.value)} />
        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select labelId="status-label" value={status} label="Status" onChange={e => setStatus(e.target.value as any)}>
            {statuses.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  )
}