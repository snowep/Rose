'use client'

import { Box } from '@mui/material'
import { PeopleFab } from '@/components/atoms/PeopleFab'
import { AddPersonModal } from '@/components/molecules/AddPersonModal'
import { useState, useMemo, useEffect } from 'react'
import { Typography, TextField, Button, Chip, Avatar, Card, CardContent, Grid } from '@mui/material'
import { PersonAdd, Search, Clear } from '@mui/icons-material'
import { BookService } from '@/lib/book-service'
import { useRouter } from 'next/navigation'
import { formatPersonName, getPersonInitials } from '@/lib/person-format'
import type { PersonNameFields } from '@/lib/person-format'

interface Person extends PersonNameFields {
  id: string
  nationality?: string
  birth_year?: number
  death_year?: number
  biography?: string
}

export function PeopleTemplate() {
  const [modalOpen, setModalOpen] = useState(false)
  const [people, setPeople] = useState<Person[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      const allPeople = await BookService.getPeople()
      setPeople(allPeople.sort((a, b) => formatPersonName(a).localeCompare(formatPersonName(b))))
    } catch (err) {
      console.error('Failed to load people:', err)
    }
  }

  const filteredPeople = useMemo(() => {
    let filtered = people

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p =>
        formatPersonName(p).toLowerCase().includes(term) ||
        p.nationality?.toLowerCase().includes(term)
      )
    }

    if (selectedLetter) {
      filtered = filtered.filter(p =>
        formatPersonName(p)[0]?.toUpperCase() === selectedLetter
      )
    }

    return filtered
  }, [people, searchTerm, selectedLetter])

  const letters = useMemo(() => {
    const uniqueLetters = new Set(people.map(p => formatPersonName(p)[0]?.toUpperCase()))
    return Array.from(uniqueLetters).sort()
  }, [people])

  const handleAddPerson = async (personData: any) => {
    const data = {
      ...personData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    await BookService.createPerson(data)
    setModalOpen(false)
    await loadPeople()
  }

  const handleDeletePerson = async (id: string) => {
    try {
      await BookService.deletePerson(id)
      loadPeople()
    } catch (err) {
      console.error('Failed to delete person:', err)
    }
  }

  return (
    <Box sx={{ pt: 4, pb: 4, maxWidth: 1200, mx: 'auto', px: 3 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        People & Contributors
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage authors and contributors. Search for existing people when adding books to avoid duplicates.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search people by name or nationality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />,
                endAdornment: searchTerm && (
                  <Button size="small" onClick={() => setSearchTerm('')}>
                    <Clear fontSize="small" />
                  </Button>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip
            label="All"
            onClick={() => setSelectedLetter(null)}
            color={selectedLetter === null ? 'primary' : 'default'}
            variant={selectedLetter === null ? 'filled' : 'outlined'}
            size="small"
          />
          {letters.map(letter => (
            <Chip
              key={letter}
              label={letter}
              onClick={() => setSelectedLetter(letter)}
              color={selectedLetter === letter ? 'primary' : 'default'}
              variant={selectedLetter === letter ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {filteredPeople.map(person => (
          <Grid key={person.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar>
                    {getPersonInitials(person)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {formatPersonName(person)}
                    </Typography>
                    {person.nationality && (
                      <Typography variant="body2" color="text.secondary">
                        {person.nationality}
                      </Typography>
                    )}
                    {person.birth_year && (
                      <Typography variant="caption" color="text.secondary">
                        {person.birth_year}{person.death_year ? ` - ${person.death_year}` : ''}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeletePerson(person.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPeople.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No people found{searchTerm ? ` for "${searchTerm}"` : ''}{selectedLetter ? ` starting with "${selectedLetter}"` : ''}
          </Typography>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
        Total people: {people.length} | Showing: {filteredPeople.length}
      </Typography>

      <PeopleFab onClick={() => setModalOpen(true)} />
      <AddPersonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddPerson}
      />
    </Box>
  )
}