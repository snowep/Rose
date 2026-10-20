import { Chip as MuiChip } from '@mui/material';

export default function Chip({ label, size='small', variant='outlined', ...props }) {
  return <MuiChip label={label} size={size} variant={variant} {...props} />;
}
