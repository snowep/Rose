'use client'

import { TextField, MenuItem } from '@mui/material'

interface FormYearInputProps {
  label: string
  value: string | number | undefined
  onChange: (value: string) => void
}

export function FormYearInput({ label, value, onChange }: FormYearInputProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1400 + 1 }, (_, i) => currentYear - i)

  return (
    <TextField
      select
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
    >
      <MenuItem value="">Select year</MenuItem>
      {years.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </TextField>
  )
}
