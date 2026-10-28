'use client'

import { Fab, FabProps } from '@mui/material'
import { SvgIconProps } from '@mui/material'

interface ActionFabProps extends Omit<FabProps, 'variant' | 'color' | 'children'> {
  icon: React.ElementType<SvgIconProps>
  ariaLabel: string
  position?: 'fixed' | 'absolute' | 'relative'
  bottom?: number | string | Record<string, number | string>
  right?: number | string
}

export function ActionFab({
  icon: Icon,
  ariaLabel,
  position = 'fixed',
  bottom = { xs: 'calc(80px + env(safe-area-inset-bottom))', md: 24 },
  right = 24,
  onClick,
  ...props
}: ActionFabProps) {
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label={ariaLabel}
      onClick={onClick}
      sx={{
        position,
        bottom,
        right,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      {...props}
    >
      <Icon />
    </Fab>
  )
}