'use client'

import { Fab } from '@mui/material'
import { PersonAdd } from '@mui/icons-material'

export function PeopleFab({ onClick }: { onClick?: () => void }) {
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="Add a person"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: { xs: 'calc(80px + env(safe-area-inset-bottom))', md: 24 },
        right: 24,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <PersonAdd />
    </Fab>
  )
}