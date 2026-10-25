'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box
} from '@mui/material'
import { PersonAdd } from '@mui/icons-material'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface AddPersonModalProps {
  open: boolean
  onClose: () => void
  onSave: (person: any) => void
}

export function AddPersonModal({ open, onClose, onSave }: AddPersonModalProps) {
  const [person, setPerson] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    nationality: '',
    birth_year: '',
    death_year: '',
    biography: '',
    website: '',
    photoUrl: ''
  })

  const handleSave = () => {
    const personData = {
      ...person,
      first_name: person.first_name.trim() || undefined,
      last_name: person.last_name.trim() || undefined,
      middle_name: person.middle_name.trim() || undefined,
      full_name: `${person.first_name} ${person.middle_name} ${person.last_name}`.trim().replace(/\s+/g, ' ') || undefined,
      nationality: person.nationality.trim() || undefined,
      birth_year: person.birth_year ? parseInt(person.birth_year) : undefined,
      death_year: person.death_year ? parseInt(person.death_year) : undefined,
      biography: person.biography.trim() || undefined,
      website: person.website.trim() || undefined,
      photoUrl: person.photoUrl.trim() || undefined
    }

    onSave(personData)
    setPerson({
      first_name: '',
      last_name: '',
      middle_name: '',
      nationality: '',
      birth_year: '',
      death_year: '',
      biography: '',
      website: '',
      photoUrl: ''
    })
  }

  const handleChange = (field: string, value: string) => {
    setPerson({ ...person, [field]: value })
  }

  const canSave = person.first_name.trim() || person.last_name.trim()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAdd />
          Add New Person
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <BookFormSection title="Basic Information">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                value={person.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Middle Name"
                value={person.middle_name}
                onChange={(e) => handleChange('middle_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
              />
            </Grid>
          </Grid>
        </BookFormSection>

        <BookFormSection title="Additional Details">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Website"
                value={person.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Photo URL"
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
        </BookFormSection>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave}>
          Add Person
        </Button>
      </DialogActions>
    </Dialog>
  )
}
