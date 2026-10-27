'use client'

import { TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'

interface FormISBNInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string | undefined
  onChange: (value: string) => void
  type: 'ISBN-10' | 'ISBN-13'
}

export function isValidISBN(isbn: string, type: 'ISBN-10' | 'ISBN-13'): boolean {
  const clean = isbn.replace(/[-\s]/g, '')
  if (type === 'ISBN-10') {
    if (!/^[0-9]{9}[0-9X]$/.test(clean)) return false
    const sum = Array.from(clean).reduce((total, digit, index) => {
      const value = digit === 'X' ? 10 : Number(digit)
      return total + value * (10 - index)
    }, 0)
    return sum % 11 === 0
  }
  if (!/^[0-9]{13}$/.test(clean)) return false
  const sum = Array.from(clean).reduce(
    (total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3),
    0
  )
  return sum % 10 === 0
}

export function FormISBNInput({ value, onChange, type, label, ...props }: FormISBNInputProps) {
  const [touched, setTouched] = useState(false)
  const isbn = value ?? ''
  const invalid = Boolean(isbn.trim()) && !isValidISBN(isbn, type)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <TextField
      label={label || type}
      value={value || ''}
      onChange={handleChange}
      fullWidth
      size="small"
      error={touched && invalid}
      onBlur={() => setTouched(true)}
      helperText={touched && invalid ? `Enter a valid ${type}.` : 'Optional'}
      slotProps={{ htmlInput: { autoComplete: 'off' } }}
      {...props}
    />
  )
}
