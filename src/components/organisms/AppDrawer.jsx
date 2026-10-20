import { Box, Toolbar, Typography, List } from '@mui/material'
import NavItem from '../molecules/NavItem.jsx'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

export default function AppDrawerContent() {
  return (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography variant="h6" noWrap>Rose</Typography>
      </Toolbar>
      <List>
        <NavItem icon={<DashboardIcon />} label="Dashboard" />
        <NavItem icon={<LibraryBooksIcon />} label="Library" />
      </List>
    </Box>
  )
}
