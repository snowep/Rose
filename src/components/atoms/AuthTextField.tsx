'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent } from 'react';

interface AuthTextFieldProps extends Omit<TextFieldProps, 'variant' | 'onChange'> {
  label: string;
  error?: boolean;
  helperText?: string;
  onChange?: (value: string) => void;
}

export function AuthTextField({ label, error, helperText, onChange, ...props }: AuthTextFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      error={error}
      helperText={helperText}
      margin="normal"
      onChange={handleChange}
      {...props}
    />
  );
}
