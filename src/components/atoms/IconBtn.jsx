import { IconButton as MuiIconButton } from '@mui/material';

export default function IconBtn({ children, onClick, ...props }) {
  return <MuiIconButton onClick={onClick} {...props}>{children}</MuiIconButton>;
}
