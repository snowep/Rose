import { IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export default function ThemeToggleIcon({ onClick, isDark }) {
  return <IconButton color="inherit" onClick={onClick}>{isDark ? <Brightness4Icon /> : <Brightness7Icon />}</IconButton>
}
