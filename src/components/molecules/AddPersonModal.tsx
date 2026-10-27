'use client'

import { useEffect, useState, type FormEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import { PersonAdd } from '@mui/icons-material'

interface AddPersonModalProps {
  open: boolean
  onClose: () => void
  onSave: (person: Record<string, unknown>) => void | Promise<void>
}

const emptyPerson = {
  first_name: '',
  last_name: '',
  middle_name: '',
  nationality: '',
  birth_year: '',
  death_year: '',
  biography: '',
  website: '',
  photoUrl: '',
}

export function AddPersonModal({ open, onClose, onSave }: AddPersonModalProps) {
  const [person, setPerson] = useState(emptyPerson)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setPerson(emptyPerson)
      setSaving(false)
      setSaveError(null)
    }
  }, [open])

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSave || saving) return
    const birthYear = person.birth_year ? Number(person.birth_year) : undefined
    const deathYear = person.death_year ? Number(person.death_year) : undefined
    if (birthYear && deathYear && deathYear < birthYear) {
      setSaveError('Death year cannot be earlier than birth year.')
      return
    }
    setSaving(true)
    setSaveError(null)

    const personData = {
      ...person,
      first_name: person.first_name.trim() || undefined,
      last_name: person.last_name.trim() || undefined,
      middle_name: person.middle_name.trim() || undefined,
      full_name: `${person.first_name} ${person.middle_name} ${person.last_name}`.trim().replace(/\s+/g, ' ') || undefined,
      nationality: person.nationality.trim() || undefined,
      birth_year: birthYear,
      death_year: deathYear,
      biography: person.biography.trim() || undefined,
      website: person.website.trim() || undefined,
      photoUrl: person.photoUrl.trim() || undefined
    }

    try {
      await onSave(personData)
      setPerson(emptyPerson)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save this person.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setPerson({ ...person, [field]: value })
  }

  const canSave = Boolean(person.first_name.trim() || person.last_name.trim())

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
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAdd />
          Add New Person
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ py: 2, overflowY: 'auto' }}>
        <Box component="form" id="add-person-form" onSubmit={handleSave}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Basic Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                value={person.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Middle Name"
                value={person.middle_name}
                onChange={(e) => handleChange('middle_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                value={person.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Nationality"
                value={person.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Birth Year"
                type="number"
                value={person.birth_year}
                onChange={(e) => handleChange('birth_year', e.target.value)}
                slotProps={{ htmlInput: { min: 1, max: new Date().getFullYear(), step: 1, inputMode: 'numeric' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Death Year"
                type="number"
                value={person.death_year}
                onChange={(e) => handleChange('death_year', e.target.value)}
                slotProps={{ htmlInput: { min: 1, max: new Date().getFullYear(), step: 1, inputMode: 'numeric' } }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Additional Details</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Website"
                type="url"
                value={person.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Photo URL"
                type="url"
                value={person.photoUrl}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Biography"
                multiline
                rows={4}
                value={person.biography}
                onChange={(e) => handleChange('biography', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
        {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, pb: { xs: 'calc(12px + env(safe-area-inset-bottom))', sm: 1.5 } }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" form="add-person-form" variant="contained" disabled={!canSave || saving}>
          {saving ? 'Saving...' : 'Add Person'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
