'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import PeopleOutlined from '@mui/icons-material/People'
import PublishOutlined from '@mui/icons-material/PublishOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'

const moreItems = [
  { label: 'People', href: '/people', icon: <PeopleOutlined /> },
  { label: 'Publishers', href: '/publishers', icon: <PublishOutlined /> },
  { label: 'Settings', href: '/settings', icon: <SettingsOutlined /> },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const isHome = pathname === '/'
  const isLibrary = pathname === '/library' || pathname.startsWith('/library/')
  const isBooks = pathname === '/books'
  const currentValue = isHome ? '/' : isLibrary ? '/library' : isBooks ? '/books' : 'more'

  return (
    <>
      <Paper
        component="nav"
        aria-label="Primary navigation"
        elevation={8}
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderTop: 1,
          borderColor: 'divider',
          pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <BottomNavigation
          showLabels
          value={moreOpen ? 'more' : currentValue}
          onChange={(_, value: string) => {
            if (value === 'more') setMoreOpen(true)
          }}
          sx={{ height: 64, bgcolor: 'background.paper' }}
        >
          <BottomNavigationAction
            component={Link}
            href="/"
            label="Home"
            value="/"
            icon={<HomeOutlined />}
          />
          <BottomNavigationAction
            component={Link}
            href="/library"
            label="Library"
            value="/library"
            icon={<LibraryBooksOutlined />}
          />
          <BottomNavigationAction
            component={Link}
            href="/books"
            label="Books"
            value="/books"
            icon={<MenuBookOutlined />}
          />
          <BottomNavigationAction
            label="More"
            value="more"
            icon={<MoreHoriz />}
          />
        </BottomNavigation>
      </Paper>

      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              pb: 'calc(env(safe-area-inset-bottom) + 16px)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            More
          </Typography>
          <List>
            {moreItems.map((item) => (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                onClick={() => setMoreOpen(false)}
                sx={{ borderRadius: 2, minHeight: 52 }}
              >
                <Box sx={{ display: 'flex', mr: 2, color: 'text.secondary' }}>
                  {item.icon}
                </Box>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
