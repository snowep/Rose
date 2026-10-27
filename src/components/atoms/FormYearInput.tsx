'use client'

import { TextField } from '@mui/material'

interface FormYearInputProps {
  label: string
  value: string | number | undefined
  onChange: (value: string) => void
}

export function FormYearInput({ label, value, onChange }: FormYearInputProps) {
  const currentYear = new Date().getFullYear()

  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      type="number"
      fullWidth
      size="small"
      slotProps={{ htmlInput: { min: 1400, max: currentYear, step: 1, inputMode: 'numeric' } }}
    />
  )
}
