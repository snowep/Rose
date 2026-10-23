'use client'

import { AppBar as MuiAppBar, Toolbar } from '@mui/material'
import { Logo } from '@/components/atoms/Logo'

export function AppBar() {
  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Logo />
      </Toolbar>
    </MuiAppBar>
  )
}
