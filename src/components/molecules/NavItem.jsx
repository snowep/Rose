import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

export default function NavItem({ icon, label, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  )
}
