'use client'

import { Box, Toolbar } from '@mui/material'
import { AppBar } from '@/components/atoms/AppBar'
import { NavDrawer } from '@/components/molecules/NavDrawer'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar />
      <NavDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}