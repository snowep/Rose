import { AppBar, Toolbar, Typography, Box, Drawer } from '@mui/material';
import IconBtn from '../atoms/IconBtn.jsx';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material';

const drawerWidth = 240;

export default function AppLayout({ children, drawer }) {
  const theme = useTheme();
  return (
    <Box sx={{ display:'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow:1 }}>Rose Library</Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width:{md:drawerWidth}, flexShrink:{md:0} }}>
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper':{boxSizing:'border-box', width:drawerWidth} }}>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow:1, p:3, width:{md:`calc(100% - ${drawerWidth}px)`} }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
