import React, { useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Container, Paper, Typography, Button, Toolbar, Drawer } from '@mui/material'
import AppHeader from './components/organisms/AppHeader.jsx'
import AppDrawerContent from './components/organisms/AppDrawer.jsx'
import { AuthProvider, ProtectedRoute } from './lib/AuthContext.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import RegisterPage from './components/pages/RegisterPage.jsx'

const drawerWidth = 240

function SimpleRouter() {
  const path = window.location.pathname
  const isAuthPage = path === '/login' || path === '/register'
  
  if (isAuthPage) {
    if (path === '/login') return <LoginPage />
    if (path === '/register') return <RegisterPage />
  }
  
  return (
    <ProtectedRoute>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Rose</Typography>
        <Typography variant="body1" color="text.secondary">
          Personal home library manager built with atomic design.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained">Create Book</Button>
        </Box>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Free tier</Typography>
        <Typography variant="body2" color="text.secondary">
          Free tier limit: 50 books • Owner only • Manual entry
        </Typography>
      </Paper>
    </ProtectedRoute>
  )
}

export default function App() {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const isDark = mode === 'dark'

  const theme = useMemo(() => createTheme({
    palette: { mode },
    typography: { fontFamily: 'Roboto, Arial, sans-serif' }
  }), [mode])

  const [mobileOpen, setMobileOpen] = useState(false)
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const toggleMode = () => {
    const next = isDark ? 'light' : 'dark'
    setMode(next)
    localStorage.setItem('themeMode', next)
  }

  const path = window.location.pathname
  const isAuthPage = path === '/login' || path === '/register'

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthPage ? (
          <Box>
            <SimpleRouter />
          </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <AppHeader onMenuClick={handleDrawerToggle} onThemeToggle={toggleMode} isDark={isDark} />
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
              >
                <AppDrawerContent />
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
                open
              >
                <AppDrawerContent />
              </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
              <Toolbar />
              <Container maxWidth="lg">
                <SimpleRouter />
              </Container>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </AuthProvider>
  )
}
