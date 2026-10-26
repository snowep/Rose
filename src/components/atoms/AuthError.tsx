'use client';

import { Alert, AlertTitle } from '@mui/material';

interface AuthErrorProps {
  message: string;
  title?: string;
}

export function AuthError({ message, title = 'Error' }: AuthErrorProps) {
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
