'use client';

import { Button, ButtonProps } from '@mui/material';

interface AuthButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
}

export function AuthButton({ children, loading = false, ...props }: AuthButtonProps) {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}
