'use client'

import { Fab } from '@mui/material'
import { Add } from '@mui/icons-material'

export function AddBookFab({ onClick }: { onClick?: () => void }) {
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="Add a book"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Add />
    </Fab>
  )
}