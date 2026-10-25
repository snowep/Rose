'use client';

import { TextField, TextFieldProps } from '@mui/material';

interface AuthTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  error?: boolean;
  helperText?: string;
}

export function AuthTextField({ label, error, helperText, ...props }: AuthTextFieldProps) {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      error={error}
      helperText={helperText}
      margin="normal"
      {...props}
    />
  );
}
