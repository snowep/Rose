import { useEffect, useState } from 'react';
import { Paper, Typography, Stack, Box, Chip, Fab, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../lib/AuthContext.jsx';
import { bookService } from '../../lib/bookService.js';
import BookForm from './BookForm.jsx';

export const GENRES = ['Fiction','Non-Fiction','Sci-Fi','Fantasy','Mystery','Biography','History','Tech','Self-Help'];
export const STATUSES = ['want-to-read','reading','completed','paused'];

export default function LibraryGrid() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    if (!user) return;
    const list = await bookService.list(user.id);
    setBooks(list);
  };
  useEffect(()=>{ load(); }, [user]);

  const total = books.length;
  const freeLimit = user?.plan === 'free' ? 50 : Infinity;
  const overLimit = total >= freeLimit;

  return (
    <Paper sx={{ p:3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">My Library</Typography>
      </Stack>
      {user?.plan === 'free' && (
        <Box sx={{ mt:1 }}>
          <Chip label={`${total}/${freeLimit} books used`} color={overLimit ? 'error' : 'default'} size="small" />
        </Box>
      )}
      <Box sx={{ mt:3 }}>
        {books.length === 0 ? <Typography>No books yet</Typography> : books.map(b=>(
          <Box key={b.id} sx={{ p:2, border:'1px solid', borderColor:'divider', borderRadius:2, mb:2 }}>
            <Typography variant="subtitle1">{b.title}</Typography>
            <Typography variant="body2" color="text.secondary">{b.author} • {b.genre} • {b.status}</Typography>
          </Box>
        ))}
      </Box>
      <Zoom in={!overLimit}>
        <Fab color="primary" aria-label="add" onClick={()=>{ setEditing(null); setOpen(true); }} sx={{ position:'fixed', bottom:32, right:32 }}>
          <AddIcon />
        </Fab>
      </Zoom>
      <BookForm open={open} onClose={()=>setOpen(false)} initialValues={editing||{}} onSave={async form=>{ 
  if (form.id) {
    await bookService.update(form.id, form, user.id);
  } else {
    await bookService.create(form, user.id);
  }
  setOpen(false);
  load();
}} />
    </Paper>
  );
}