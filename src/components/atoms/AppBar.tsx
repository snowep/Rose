'use client'

import { useState } from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Logo } from '@/components/atoms/Logo'
import { LogoutConfirmDialog } from '@/components/molecules/LogoutConfirmDialog'

export function AppBar() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const handleSignOut = async () => {
    setLogoutLoading(true)
    setLogoutError(null)

    try {
      await signOut()
      setLogoutDialogOpen(false)
      router.replace('/login')
      router.refresh()
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out. Please try again.')
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          disabled={authLoading || !user || logoutLoading}
          onClick={() => {
            setLogoutError(null)
            setLogoutDialogOpen(true)
          }}
        >
          Sign Out
        </Button>
      </Toolbar>
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => {
          if (!logoutLoading) setLogoutDialogOpen(false)
        }}
        onConfirm={handleSignOut}
        loading={logoutLoading}
        error={logoutError}
      />
    </MuiAppBar>
  )
}