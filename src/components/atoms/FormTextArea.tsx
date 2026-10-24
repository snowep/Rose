'use client'

import { TextField } from '@mui/material'

interface FormTextAreaProps {
  label: string
  value: string | undefined
  onChange: (value: string) => void
  rows?: number
}

export function FormTextArea({ label, value, onChange, rows = 3 }: FormTextAreaProps) {
  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size='small'
      multiline
      rows={rows}
    />
  )
}

