import Chip from '../atoms/Chip.jsx';
import { Box } from '@mui/material';

export default function TagChips({ tags }) {
  return (
    <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5 }}>
      {tags?.map(t => <Chip key={t} label={t} size="small" variant="outlined" />)}
    </Box>
  );
}
