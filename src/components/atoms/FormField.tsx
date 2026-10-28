'use client'

import { TextField, TextFieldProps, MenuItem } from '@mui/material'
import { ChangeEvent } from 'react'

type FieldType = 'text' | 'textarea' | 'select' | 'password'

interface FormFieldProps extends Omit<TextFieldProps, 'value' | 'onChange' | 'select' | 'multiline' | 'rows'> {
  value: string | number | undefined
  onChange: (value: string) => void
  label: string
  type?: FieldType
  options?: { value: string; label: string }[]
  rows?: number
}

export function FormField({
  value,
  onChange,
  label,
  type = 'text',
  options,
  rows = 3,
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  ...props
}: FormFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  if (type === 'select') {
    return (
      <TextField
        select
        label={label}
        value={value || ''}
        onChange={handleChange}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        {...props}
      >
        {options?.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  if (type === 'textarea') {
    return (
      <TextField
        label={label}
        value={value || ''}
        onChange={handleChange}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        multiline
        rows={rows}
        {...props}
      />
    )
  }

  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={handleChange}
      type={type === 'password' ? 'password' : 'text'}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    />
  )
}