'use client'

import { AppBar as MuiAppBar, Toolbar, Box, MenuItem } from '@mui/material'
import { IconButton } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/atoms/Logo'

export function AppBar() {
  const { user, signOut } = useAuth()

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <MenuItem onClick={signOut}>Logout</MenuItem>
        )}
      </Toolbar>
    </MuiAppBar>
  )
}