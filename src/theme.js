import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create a theme with Material Design 3 enabled
const theme = createTheme({
  // Enable Material Design 3
  defaultV3: true,
  // Optional: customize the palette
  palette: {
    mode: 'light', // or 'dark' - we'll handle toggle later
    primary: {
      main: '#1976d2', // MD3 blue
    },
    secondary: {
      main: '#dc004e', // MD3 pink
    },
  },
  components: {
    // Optional: customize component defaults for MD3
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // MD3 buttons typically don't uppercase
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          // MD3 FAB is larger and uses tonal elevation
        },
      },
    },
  },
});

export { theme };
export default function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}