'use client'

import { TextField, TextFieldProps } from '@mui/material'

interface FormTextFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string | number | undefined
  onChange: (value: string) => void
  field?: string
}

export function FormTextField({ value, onChange, label, ...props }: FormTextFieldProps) {
  return (
    <TextField
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size='small'
      {...props}
    />
  )
}

