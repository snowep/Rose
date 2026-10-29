'use client'

import { Box, TextField, Select, MenuItem, InputLabel, FormControl, Chip } from '@mui/material'
import { FormField } from '@/components/atoms/FormField'

interface LibraryFiltersProps {
  search: string
  status: string
  genre: string
  author: string
  sortBy: string
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
  onGenreChange: (v: string) => void
  onAuthorChange: (v: string) => void
  onSortChange: (v: string) => void
  genres: string[]
  statuses: string[]
}

export function LibraryFilters({
  search, status, genre, author, sortBy,
  onSearchChange, onStatusChange, onGenreChange, onAuthorChange, onSortChange,
  genres, statuses
}: LibraryFiltersProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <FormField label="Search" value={search} onChange={onSearchChange} placeholder="Title, author..." />

      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={e => onStatusChange(e.target.value as string)}>
          <MenuItem value="">All</MenuItem>
          {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel>Genre</InputLabel>
        <Select value={genre} label="Genre" onChange={e => onGenreChange(e.target.value as string)}>
          <MenuItem value="">All</MenuItem>
          {genres.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 140 }}>
        <InputLabel>Sort</InputLabel>
        <Select value={sortBy} label="Sort" onChange={e => onSortChange(e.target.value as string)}>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="createdAt">Date Added</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
