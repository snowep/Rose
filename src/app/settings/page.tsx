'use client'

import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider } from '@mui/material'

export default function SettingsPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          Settings
        </Typography>
      </Box>
      <Box sx={{ pl: 4 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/">
              <ListItemText primary="General settings" sx={{ py: 2 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/library">
              <ListItemText primary="Library settings" sx={{ py: 2 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Box>
  )
}
