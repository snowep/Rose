'use client'

import { Box, Chip, TextField, Autocomplete } from '@mui/material'

interface FormTagInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options?: string[]
}

export function FormTagInput({ label, value, onChange, options = [] }: FormTagInputProps) {
  return (
    <Box>
      <Autocomplete
        multiple
        freeSolo
        options={options}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField {...params} label={label} size="small" />
        )}
      />
    </Box>
  )
}
