'use client'

import { TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'

interface FormISBNInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string | undefined
  onChange: (value: string) => void
  type: 'ISBN-10' | 'ISBN-13'
}

function validateISBN(isbn: string, type: 'ISBN-10' | 'ISBN-13'): boolean {
  const clean = isbn.replace(/[-\s]/g, '')
  if (type === 'ISBN-10') {
    return clean.length === 10 && /^[0-9]{9}[0-9X]$/.test(clean)
  }
  return clean.length === 13 && /^[0-9]{13}$/.test(clean)
}

export function FormISBNInput({ value, onChange, type, label, ...props }: FormISBNInputProps) {
  const [error, setError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)
    if (val && !validateISBN(val, type)) {
      setError(true)
    } else {
      setError(false)
    }
  }

  return (
    <TextField
      label={label || type}
      value={value || ''}
      onChange={handleChange}
      fullWidth
      size="small"
      error={error}
      helperText={error ? `Invalid ${type} format` : ''}
      {...props}
    />
  )
}
