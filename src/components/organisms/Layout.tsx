'use client'

import { Box, Toolbar } from '@mui/material'
import { AppBar } from '@/components/atoms/AppBar'
import { NavDrawer } from '@/components/molecules/NavDrawer'
import { AddBookFab } from '@/components/organisms/AddBookFab'
import { AddBookModal } from '@/components/atoms/AddBookModal'
import * as React from 'react'

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  const handleSave = (book: { title: string; author: string; status: string }) => {
    console.log('New book:', book)
  }

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
      <AddBookFab onClick={() => setOpen(true)} />
      <AddBookModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </Box>
  )
}
