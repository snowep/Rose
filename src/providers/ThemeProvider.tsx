'use client'

import * as React from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E1E1E',
      light: '#3A3A3A',
      dark: '#000000',
      contrastText: '#F5F1E8',
    },
    secondary: {
      main: '#D43131',
      light: '#E55A5A',
      dark: '#A81F1F',
    },
    background: {
      default: '#F5F1E8',
      paper: '#F5F1E8',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#A8A8A8',
    },
    warning: {
      main: '#F2C55E',
      light: '#F7D98A',
      dark: '#D4A83A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F1E8',
          color: '#1E1E1E',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F1E8',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#F5F1E8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          backgroundColor: '#D43131',
          color: '#F5F1E8',
          '&:hover': {
            backgroundColor: '#A81F1F',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#D43131',
        },
      },
    },
  },
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
