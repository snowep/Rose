import { Modal, Box, Typography, Stack, Button } from '@mui/material';
import { useState } from 'react';
import Input from '../atoms/Input.jsx';
import Select from '../atoms/Select.jsx';
import { GENRES, STATUSES } from '../organisms/LibraryGrid.jsx';

export default function BookForm({ open, onClose, initialValues = {}, onSave }) {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    author: initialValues.author || '',
    isbn: initialValues.isbn || '',
    year: initialValues.year || '',
    genre: initialValues.genre || '',
    status: initialValues.status || 'want-to-read',
    notes: initialValues.notes || ''
  });

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title required');
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: { xs: '90%', sm: 600 }, bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{initialValues.id ? 'Edit Book' : 'Add Book'}</Typography>
        <Stack spacing={2}>
          <Input name="title" label="Title *" value={form.title} onChange={handleChange} required />
          <Input name="author" label="Author" value={form.author} onChange={handleChange} />
          <Input name="isbn" label="ISBN" value={form.isbn} onChange={handleChange} />
          <Select name="genre" label="Genre" value={form.genre} onChange={handleChange} options={GENRES.map(g => ({ value: g, label: g }))} />
          <Select name="status" label="Status" value={form.status} onChange={handleChange} options={STATUSES.map(s => ({ value: s, label: s.replace('-', ' ') }))} />
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>Save</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
