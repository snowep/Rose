import { Modal, Box, Typography, Stack } from '@mui/material';
import Input from '../atoms/Input.jsx';
import Select from '../atoms/Select.jsx';
import Button from '../atoms/Button.jsx';

const TAG_OPTIONS = ['Fiction','Non-Fiction','Science Fiction','Fantasy','Mystery','Thriller','Romance','Biography','History','Self-Help','Technology','Programming','Science'];
const FORMAT_OPTIONS = ['Hardcover','Paperback','eBook','Audiobook'];
const LANG_OPTIONS = ['en','ru','es','fr','de','zh','ja','other'];

export default function BookForm({ open, onClose, initialValues={}, onSave }) {
  // Simplified state for demo; real form would manage all fields
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:{xs:'90%', sm:600}, bgcolor:'background.paper', p:3, borderRadius:2 }}>
        <Typography variant="h6" gutterBottom>{initialValues.id ? 'Edit Book' : 'Add Book'}</Typography>
        <Stack spacing={2}>
          <Input label="Title *" />
          <Input label="Author *" />
          <Input label="ISBN" />
          <Select label="Format" options={FORMAT_OPTIONS.map(f=>({value:f,label:f}))} />
          <Select label="Language" options={LANG_OPTIONS.map(l=>({value:l,label:l}))} />
          <Select label="Tags" multiple options={TAG_OPTIONS.map(t=>({value:t,label:t}))} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
