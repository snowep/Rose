'use client'

import { TextField, MenuItem } from '@mui/material'

interface FormSelectFieldProps {
  label: string
  value: string | undefined
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function FormSelectField({ label, value, onChange, options }: FormSelectFieldProps) {
  return (
    <TextField
      select
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size='small'
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

