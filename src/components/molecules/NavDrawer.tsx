'use client'

import { Box, Drawer, Toolbar, Divider } from '@mui/material'
import { NavList } from '@/components/molecules/NavList'

const DRAWER_WIDTH = 240

export function NavDrawer() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <NavList />
        <Divider />
      </Box>
    </Drawer>
  )
}
