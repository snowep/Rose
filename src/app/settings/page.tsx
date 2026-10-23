import { Box, Typography } from '@mui/material'

export default function SettingsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>
      <Typography>Settings page content</Typography>
    </Box>
  )
}