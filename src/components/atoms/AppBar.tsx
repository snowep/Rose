'use client'

import { AppBar as MuiAppBar, Toolbar, Box } from '@mui/material'
import { Logo } from '@/components/atoms/Logo'
import { ThemeToggle } from '@/components/atoms/ThemeToggle'

export function AppBar() {
  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <ThemeToggle />
      </Toolbar>
    </MuiAppBar>
  )
}
