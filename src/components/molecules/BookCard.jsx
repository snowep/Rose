import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import TagChips from '../molecules/TagChips.jsx';
import Button from '../atoms/Button.jsx';

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <Card sx={{ height:'100%', display:'flex', flexDirection:'column' }}>
      {book.coverUrl && <CardMedia component="img" height="140" image={book.coverUrl} alt={book.title} />}
      <CardContent sx={{ flexGrow:1 }}>
        <Typography variant="subtitle1" fontWeight={600}>{book.title}</Typography>
        <Typography variant="body2" color="text.secondary">{book.author}</Typography>
        <Box sx={{ mt:1 }}>
          <TagChips tags={book.tags} />
        </Box>
        <Typography variant="caption" sx={{ mt:1, display:'block' }}>{book.status}</Typography>
      </CardContent>
      <Box sx={{ p:2, pt:0, display:'flex', gap:1 }}>
        <Button size="small" onClick={()=>onEdit(book)}>Edit</Button>
        <Button size="small" variant="outlined" color="error" onClick={()=>onDelete(book.id)}>Delete</Button>
      </Box>
    </Card>
  );
}
