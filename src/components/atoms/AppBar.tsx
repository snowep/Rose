'use client'

import { AppBar as MuiAppBar, Toolbar, Box, MenuItem, Divider } from '@mui/material'
import { IconButton } from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { Logout as useLogout } from '@/hooks/useAuth'
import { useAuth } from '@/hooks/useAuth'
import { NavLink } from 'next/export'

export function AppBar() {
  const { user, signOut } = useAuth()

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <>
            <MenuItem onClick={signOut}>
              Logout
            </MenuItem>
            <Divider />
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  )
}
