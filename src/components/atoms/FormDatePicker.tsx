'use client'

import { TextField } from '@mui/material'

interface FormDatePickerProps {
  label: string
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
}

export function FormDatePicker({ label, value, onChange, disabled, required }: FormDatePickerProps) {
  return (
    <TextField
      label={label}
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      fullWidth
      size="small"
      slotProps={{ inputLabel: { shrink: true } }}
    />
  )
}