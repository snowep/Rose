'use client';

import { ThemeProvider as MuiThemeProvider } from '@/providers/ThemeProvider';
import { ThemeContextProvider } from '@/providers/ThemeContext';
import { EmotionCacheProvider } from '@/providers/EmotionCacheProvider';
import { Box } from '@mui/material';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ThemeContextProvider>
        <MuiThemeProvider>
          <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'background.default' }}>
            {children}
          </Box>
        </MuiThemeProvider>
      </ThemeContextProvider>
    </EmotionCacheProvider>
  );
}