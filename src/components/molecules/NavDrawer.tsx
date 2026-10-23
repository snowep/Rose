'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Divider } from '@mui/material'

const DRAWER_WIDTH = 240

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/' },
  { key: 'library', label: 'Library', href: '/library' },
  { key: 'settings', label: 'Settings', href: '/settings' },
]

export function NavDrawer() {
  const pathname = usePathname()
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <ListItem key={item.key} disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={item.href}
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
                    primary={item.label} 
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
          })}
        </List>
        <Divider />
      </Box>
    </Drawer>
  )
}
