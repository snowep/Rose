import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create a theme with Material Design 3 enabled
const theme = createTheme({
  // Enable Material Design 3
  defaultV3: true,
  // Optional: customize the palette
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

export { theme };

export default function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}