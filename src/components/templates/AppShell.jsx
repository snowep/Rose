import { Box, Drawer, Toolbar } from '@mui/material'
import AppDrawerContent from '../organisms/AppDrawer.jsx'

export default function AppDrawerLayout({ open, onClose, variant, width = 240 }) {
  return (
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant={variant === 'temporary' ? 'temporary' : 'permanent'}
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: variant === 'temporary' ? 'block' : 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width }
        }}
      >
        <Toolbar />
        <AppDrawerContent />
      </Drawer>
    </Box>
  )
}
