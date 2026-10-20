import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

export default function NavItem({ icon, label, active, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton selected={active} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  )
}
