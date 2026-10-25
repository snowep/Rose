'use client'
import { List } from '@mui/material'
import { NavItem } from '@/components/atoms/NavItem'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/' },
  { key: 'library', label: 'Library', href: '/library' },
  { key: 'people', label: 'People', href: '/people' },
  { key: 'settings', label: 'Settings', href: '/settings' },
]

export function NavList() {
  const { user } = useAuth()

  return (
    <List>
      {menuItems.map((item) => (
        <NavItem key={item.key} label={item.label} href={item.href} />
      ))}
      {user && (
        <NavItem key="logout" onClick={user => user.signOut()}>Logout</NavItem>
      )}
    </List>
  )
}