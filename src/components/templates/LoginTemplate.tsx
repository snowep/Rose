'use client';

import { ThemeProvider as MuiThemeProvider } from '@/providers/ThemeProvider';
import { ThemeContextProvider } from '@/providers/ThemeContext';
import { EmotionCacheProvider } from '@/providers/EmotionCacheProvider';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface LoginTemplateProps {
  children: ReactNode;
}

export function LoginTemplate({ children }: LoginTemplateProps) {
  return (
    <EmotionCacheProvider>
      <ThemeContextProvider>
        <MuiThemeProvider>
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
        </MuiThemeProvider>
      </ThemeContextProvider>
    </EmotionCacheProvider>
  );
}