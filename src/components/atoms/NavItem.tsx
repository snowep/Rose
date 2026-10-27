'use client'

import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NavItemProps {
  label: string;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function NavItem({ label, href, onClick, selected = false }: NavItemProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const normalizedPathname = pathname.replace(/\/$/, '')
  const normalizedHref = href?.replace(/\/$/, '')
  const isActive = isMounted && normalizedHref
    ? normalizedPathname === normalizedHref
    : selected

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={href ? Link : 'button'}
        href={href}
        selected={isActive}
        onClick={handleClick}
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