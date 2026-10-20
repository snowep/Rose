import { Button as MuiButton } from '@mui/material';

export default function Button({ children, variant='contained', color='primary', size='medium', onClick, disabled=false, ...props }) {
  return (
    <MuiButton variant={variant} color={color} size={size} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </MuiButton>
  );
}
