'use client'
import { List } from '@mui/material'
import { NavItem } from '@/components/atoms/NavItem'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/' },
  { key: 'library', label: 'Library', href: '/library' },
  { key: 'books', label: 'All Books', href: '/books' },
  { key: 'people', label: 'People', href: '/people' },
  { key: 'settings', label: 'Settings', href: '/settings' },
]

export function NavList() {
  return (
    <List>
      {menuItems.map((item) => (
        <NavItem key={item.key} label={item.label} href={item.href} />
      ))}
    </List>
  )
}