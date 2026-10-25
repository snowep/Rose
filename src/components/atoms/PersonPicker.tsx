'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Box, TextField, Chip, Avatar, Typography, Fade, IconButton } from '@mui/material'
import { PersonAdd, Search, Clear } from '@mui/icons-material'
import { normalizedDb } from '@/lib/db-normalized'

interface Person {
  id: string
  first_name?: string
  last_name?: string
  middle_name?: string
  full_name?: string
  nationality?: string
  birth_year?: number
}

interface PersonPickerProps {
  label: string
  value: { personId: string; personName: string; role: string }[]
  onChange: (value: { personId: string; personName: string; role: string }[]) => void
  roleOptions: { value: string; label: string }[]
  defaultRole?: string
}

export function PersonPicker({ label, value, onChange, roleOptions, defaultRole = 'author' }: PersonPickerProps) {
  const [people, setPeople] = useState<Person[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedRole, setSelectedRole] = useState(defaultRole)

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      const allPeople = await normalizedDb.people.toArray()
      setPeople(allPeople)
    } catch (err) {
      console.error('Failed to load people:', err)
    }
  }

  const formatPersonName = (person: Person) => {
    if (person.full_name) return person.full_name
    const parts = [person.first_name, person.middle_name, person.last_name].filter(Boolean)
    return parts.join(' ') || 'Unknown'
  }

  const getInitials = (person: Person) => {
    const name = formatPersonName(person)
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const filteredPeople = useMemo(() => {
    if (!inputValue) return people.slice(0, 10)

    const query = inputValue.toLowerCase()
    return people
      .filter(p => {
        const name = formatPersonName(p).toLowerCase()
        return name.includes(query) || name.split(' ')[0].toLowerCase() === query
      })
      .slice(0, 10)
  }, [inputValue, people])

  const getDidYouMean = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return null

    const query = inputValue.toLowerCase()
    const candidates = people
      .map(p => {
        const name = formatPersonName(p).toLowerCase()
        let score = 0
        if (name.startsWith(query)) score += 10
        if (name.includes(query)) score += 5
        if (name.split(' ').some(n => n.startsWith(query))) score += 3
        return { person: p, score, name: formatPersonName(p) }
      })
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    return candidates.length > 0 ? candidates : null
  }, [inputValue, people])

  const handleSelectPerson = (person: Person | null) => {
    if (!person) return

    const personName = formatPersonName(person)
    const newEntry = {
      personId: person.id,
      personName,
      role: selectedRole
    }

    const exists = value.find(v => v.personId === person.id && v.role === selectedRole)
    if (!exists) {
      onChange([...value, newEntry])
    }

    setInputValue('')
    setShowSuggestions(false)
  }

  const handleRemovePerson = (personId: string, role: string) => {
    onChange(value.filter(v => !(v.personId === personId && v.role === role)))
  }

  const handleAddNewPerson = () => {
    if (!inputValue.trim()) return

    const newEntry = {
      personId: `temp-${Date.now()}`,
      personName: inputValue.trim(),
      role: selectedRole
    }

    onChange([...value, newEntry])
    setInputValue('')
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {value.map((item) => (
          <Chip
            key={`${item.personId}-${item.role}`}
            avatar={<Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
              {item.personName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </Avatar>}
            label={`${item.personName} • ${item.role}`}
            onDelete={() => handleRemovePerson(item.personId, item.role)}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type to search people..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />,
            endAdornment: inputValue && (
              <IconButton size="small" onClick={() => setInputValue('')}>
                <Clear fontSize="small" />
              </IconButton>
            )
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {roleOptions.map(role => (
          <Chip
            key={role.value}
            label={role.label}
            onClick={() => setSelectedRole(role.value)}
            color={selectedRole === role.value ? 'primary' : 'default'}
            variant={selectedRole === role.value ? 'filled' : 'outlined'}
            size="small"
          />
        ))}
      </Box>

      <Fade in={showSuggestions && (filteredPeople.length > 0 || getDidYouMean)}>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 3,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {filteredPeople.length > 0 && (
            <>
              <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
                Existing people
              </Typography>
              {filteredPeople.map(person => (
                <Box
                  key={person.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelectPerson(person)
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                    {getInitials(person)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{formatPersonName(person)}</Typography>
                    {person.nationality && (
                      <Typography variant="caption" color="text.secondary">
                        {person.nationality}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </>
          )}

          {getDidYouMean && (
            <>
              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1, pt: 1 }}>
                <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
                  Did you mean?
                </Typography>
                {getDidYouMean.map(item => (
                  <Box
                    key={item.person.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelectPerson(item.person)
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                      {getInitials(item.person)}
                    </Avatar>
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {inputValue && filteredPeople.length === 0 && !getDidYouMean && (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                No existing people found for "{inputValue}"
              </Typography>
              <Box
                onClick={handleAddNewPerson}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'action.hover' },
                  p: 1,
                  borderRadius: 1
                }}
              >
                <PersonAdd fontSize="small" />
                <Typography variant="body2">Add "{inputValue}" as new person (will create later)</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  )
}
