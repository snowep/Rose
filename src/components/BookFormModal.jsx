import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Stack
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 480 },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const TAG_OPTIONS = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Self-Help',
  'Technology',
  'Programming',
  'Science'
];

export default function BookFormModal({
  open,
  onClose,
  onSave,
  initialValues = {}
}) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [author, setAuthor] = useState(initialValues.author || '');
  const [isbn, setIsbn] = useState(initialValues.isbn || '');
  const [tags, setTags] = useState(initialValues.tags || []);
  const [status, setStatus] = useState(initialValues.status || 'want-to-read');
  const [progress, setProgress] = useState(initialValues.progress || 0);

  useEffect(() => {
    setTitle(initialValues.title || '');
    setAuthor(initialValues.author || '');
    setIsbn(initialValues.isbn || '');
    setTags(initialValues.tags || []);
    setStatus(initialValues.status || 'want-to-read');
    setProgress(initialValues.progress || 0);
  }, [initialValues]);

  const handleSave = () => {
    if (!title.trim() || !author.trim()) return;
    onSave({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      tags,
      status,
      progress: Number(progress) || 0
    });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="book-modal-title">
      <Box sx={modalStyle} component="form" noValidate autoComplete="off">
        <Typography id="book-modal-title" variant="h6" component="h2" gutterBottom>
          {initialValues.id ? 'Edit Book' : 'Add New Book'}
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={tags}
              onChange={(e) => {
                const val = e.target.value;
                setTags(typeof val === 'string' ? val.split(',') : val);
              }}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {TAG_OPTIONS.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="want-to-read">Want to Read</MenuItem>
              <MenuItem value="reading">Reading</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          {status === 'reading' && (
            <TextField
              type="number"
              label="Progress (%)"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              inputProps={{ min: 0, max: 100 }}
              fullWidth
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!title.trim() || !author.trim()}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
