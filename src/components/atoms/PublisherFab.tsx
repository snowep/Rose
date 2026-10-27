'use client'

import { Fab } from '@mui/material'
import { Publish } from '@mui/icons-material'

export function PublisherFab({ onClick }: { onClick?: () => void }) {
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="Add a publisher"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: { xs: 'calc(80px + env(safe-area-inset-bottom))', md: 24 },
        right: 24,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Publish />
    </Fab>
  )
}