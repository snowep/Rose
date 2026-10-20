import { Box, Toolbar, Typography, List, Drawer, Button } from '@mui/material'
import NavItem from '../molecules/NavItem.jsx'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

export default function AppDrawerContent({ activePage, onLogout }) {
  return (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography variant="h6" noWrap>Rose</Typography>
      </Toolbar>
      <List>
        <NavItem icon={<DashboardIcon />} label="Dashboard" active={activePage === 'dashboard'} />
        <NavItem icon={<LibraryBooksIcon />} label="Library" active={activePage === 'library'} />
        <NavItem component={Button} variant="text" sx={{ px: 2, my: 2, textTransform: 'none' }} onClick={onLogout}>
          <LogoutIcon />Logout
        </NavItem>
      </List>
    </Box>
  )
}
