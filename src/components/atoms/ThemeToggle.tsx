'use client'

import { IconButton, Tooltip } from '@mui/material'
import { DarkMode } from '@mui/icons-material'
import { useTheme } from '@/providers/ThemeContext'

export function ThemeToggle() {
  const { toggleMode } = useTheme()

  return (
    <Tooltip title="Dark mode">
      <IconButton onClick={toggleMode} color="inherit">
        <DarkMode />
      </IconButton>
    </Tooltip>
  )
}