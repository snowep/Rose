'use client'

import { TextField } from '@mui/material'

interface FormNumberFieldProps {
  label: string
  value: number | undefined
  onChange: (value: number) => void
}

export function FormNumberField({ label, value, onChange }: FormNumberFieldProps) {
  return (
    <TextField
      label={label}
      type='number'
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      fullWidth
      size='small'
    />
  )
}

export function FormNumberFieldStr({ label, value, onChange }: FormNumberFieldProps) {
  return (
    <TextField
      label={label}
      type='number'
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      fullWidth
      size='small'
    />
  )
}

