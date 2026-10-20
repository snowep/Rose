import { Container } from '@mui/material';
import LibraryGrid from '../organisms/LibraryGrid.jsx';

export default function LibraryPage() {
  return (
    <Container maxWidth="lg" sx={{ mt:3 }}>
      <LibraryGrid />
    </Container>
  );
}
