import { Grid } from '@mui/material';
import BookCard from '../molecules/BookCard.jsx';

export default function BookGrid({ books, onEdit, onDelete }) {
  return (
    <Grid container spacing={3}>
      {books.map(b => (
        <Grid size={{ xs:12, sm:6, md:4, lg:3 }} key={b.id}>
          <BookCard book={b} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
