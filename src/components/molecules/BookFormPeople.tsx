'use client'

import { Box } from '@mui/material'
import { PersonPicker } from '@/components/atoms/PersonPicker'
import { BookFormSection } from '@/components/atoms/BookFormSection'

interface BookPersonEntry {
  personId: string
  personName: string
  role: string
}

interface BookFormPeopleProps {
  book: any
  onChange: (field: string, value: any) => void
}

const ROLE_OPTIONS = [
  { value: 'author', label: 'Author' },
  { value: 'translator', label: 'Translator' },
  { value: 'editor', label: 'Editor' },
  { value: 'illustrator', label: 'Illustrator' },
  { value: 'cover_artist', label: 'Cover Artist' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'foreword_by', label: 'Foreword' },
  { value: 'afterword_by', label: 'Afterword' },
  { value: 'introduction_by', label: 'Introduction' },
  { value: 'preface_by', label: 'Preface' },
  { value: 'contributor', label: 'Contributor' },
  { value: 'narrator', label: 'Narrator' },
  { value: 'producer', label: 'Producer' },
  { value: 'director', label: 'Director' },
]

export function BookFormPeople({ book, onChange }: BookFormPeopleProps) {
  const peopleData = book.peopleData || []

  const handlePeopleChange = (newPeople: BookPersonEntry[]) => {
    onChange('peopleData', newPeople)
  }

  return (
    <BookFormSection title='People & Contributors'>
      <Box sx={{ mb: 3 }}>
        <PersonPicker
          label="Add Authors, Translators, and Contributors"
          value={peopleData}
          onChange={handlePeopleChange}
          roleOptions={ROLE_OPTIONS}
          defaultRole="author"
        />
      </Box>

      {/* Debug display of current people */}
      {peopleData.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
            Current selections will be saved with the book:
          </Box>
          <Box sx={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
            {JSON.stringify(peopleData, null, 2)}
          </Box>
        </Box>
      )}
    </BookFormSection>
  )
}
