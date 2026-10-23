'use client'

import Link from 'next/link'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Divider } from '@mui/material'

const DRAWER_WIDTH = 240

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/' },
  { key: 'library', label: 'Library', href: '/library' },
  { key: 'settings', label: 'Settings', href: '/settings' },
]

export function NavDrawer() {
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
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton component={Link} href={item.href}>
                <ListItemText primary={item.label} sx={{ pl: 2 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  )
}
