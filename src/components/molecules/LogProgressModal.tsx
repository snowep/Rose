'use client'

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material'
import { useState } from 'react'

interface LogProgressModalProps {
  open: boolean
  onClose: () => void
  onSave: (pagesRead: number, date: string) => void
}

export function LogProgressModal({ open, onClose, onSave }: LogProgressModalProps) {
  const [pagesRead, setPagesRead] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSave = () => {
    const pages = parseInt(pagesRead)
    if (!pages || pages <= 0) return
    onSave(pages, date)
    setPagesRead('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log Reading Progress</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} fullWidth helperText="Pick reading date" />
          <TextField label="Pages Read" type="number" value={pagesRead} onChange={e => setPagesRead(e.target.value)} fullWidth helperText="Number of pages read on this date" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Log Progress</Button>
      </DialogActions>
    </Dialog>
  )
}
