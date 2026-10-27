'use client'

import { Box, Toolbar } from '@mui/material'
import { AppBar } from '@/components/atoms/AppBar'
import { NavDrawer } from '@/components/molecules/NavDrawer'
import { MobileNavigation } from '@/components/organisms/MobileNavigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <AppBar />
      <NavDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pb: { xs: 'calc(64px + env(safe-area-inset-bottom))', md: 0 },
        }}
      >
        <Toolbar />
        {children}
      </Box>
      <MobileNavigation />
    </Box>
  )
}