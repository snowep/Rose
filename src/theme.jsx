import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create themes
const lightTheme = createTheme({
  defaultV3: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

const darkTheme = createTheme({
  defaultV3: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

export { lightTheme, darkTheme };

export default function ThemeProvider({ children }) {
  // Get theme from localStorage or default to light
  const storedMode = localStorage.getItem('themeMode') || 'light';
  const theme = storedMode === 'dark' ? darkTheme : lightTheme;

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}