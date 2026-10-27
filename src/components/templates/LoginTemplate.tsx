'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface LoginTemplateProps {
  children: ReactNode;
}

export function LoginTemplate({ children }: LoginTemplateProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
  );
}