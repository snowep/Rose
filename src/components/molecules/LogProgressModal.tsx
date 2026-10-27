'use client'

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material'
import { Alert } from '@mui/material'
import { useState, type FormEvent } from 'react'

interface LogProgressModalProps {
  open: boolean
  onClose: () => void
  onSave: (pagesRead: number, date: string) => void | Promise<void>
}

function getLocalDateValue() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function LogProgressModal({ open, onClose, onSave }: LogProgressModalProps) {
  const [pagesRead, setPagesRead] = useState('')
  const [date, setDate] = useState(getLocalDateValue)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const pages = Number(pagesRead)
    if (!Number.isInteger(pages) || pages <= 0 || !date || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await onSave(pages, date)
      setPagesRead('')
      setDate(getLocalDateValue())
      onClose()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to log reading progress.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
          maxHeight: 'calc(100% - 32px)',
          borderRadius: { xs: 2, sm: 2 },
        },
      }}
    >
      <DialogTitle>Log Reading Progress</DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        <Box component="form" id="log-progress-form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} fullWidth required slotProps={{ htmlInput: { max: getLocalDateValue() } }} />
          <TextField label="Pages Read" type="number" value={pagesRead} onChange={e => setPagesRead(e.target.value)} fullWidth required helperText="Whole number greater than zero" slotProps={{ htmlInput: { min: 1, step: 1, inputMode: 'numeric' } }} />
          {saveError && <Alert severity="error">{saveError}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" form="log-progress-form" variant="contained" disabled={saving || !pagesRead || Number(pagesRead) <= 0 || !date}>
          {saving ? 'Saving...' : 'Log Progress'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
