'use client'

import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavItem({ key, label, href }: { key: string; label: string; href: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <ListItem key={key} disablePadding>
      <ListItemButton
        component={Link}
        href={href}
        selected={isActive}
        sx={{
          ...(isActive && {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderLeft: '3px solid',
            borderLeftColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            }
          })
        }}
      >
        <ListItemText
          primary={label}
          sx={{
            pl: 2,
            '& .MuiListItemText-primary': {
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'primary.main' : 'inherit'
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}
