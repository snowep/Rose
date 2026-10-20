import { Box, AppBar, Toolbar, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AppTitle from '../atoms/AppTitle.jsx'
import ThemeToggleIcon from '../atoms/ThemeToggleIcon.jsx'

export default function AppHeader({ onMenuClick, onThemeToggle, isDark }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <AppTitle />
        <Box sx={{ flexGrow: 1 }} />
        <ThemeToggleIcon onClick={onThemeToggle} isDark={isDark} />
      </Toolbar>
    </AppBar>
  )
}
