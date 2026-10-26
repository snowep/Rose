'use client'

import { useState } from 'react'
import { AppBar as MuiAppBar, Toolbar, Box, Button } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/atoms/Logo'
import { LogoutConfirmDialog } from '@/components/molecules/LogoutConfirmDialog'

export function AppBar() {
  const { user, signOut } = useAuth()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleLogoutConfirm = async () => {
    await signOut()
    setLogoutDialogOpen(false)
  }

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Button color="inherit" onClick={() => setLogoutDialogOpen(true)}>
            Sign Out
          </Button>
        )}
      </Toolbar>
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </MuiAppBar>
  )
}