import { Modal, Box, Typography, Stack, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import Input from '../atoms/Input.jsx';
import Select from '../atoms/Select.jsx';
import SnackbarAtom from '../atoms/SnackbarAtom.jsx';
import { GENRES, STATUSES } from '../organisms/LibraryGrid.jsx';

const validate = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (form.isbn && !/^\d{10}(\d{3})?$/.test(form.isbn.replace(/[-\s]/g, ''))) {
    errors.isbn = 'ISBN must be 10 or 13 digits';
  }
  if (form.year && (!/^\d{4}$/.test(form.year) || parseInt(form.year) > new Date().getFullYear())) {
    errors.year = 'Year must be a valid 4-digit year';
  }
  return errors;
};

const getInitialForm = (initialValues) => {
  return {
    title: initialValues.title || '',
    author: initialValues.author || '',
    isbn: initialValues.isbn || '',
    year: initialValues.year || '',
    genre: Array.isArray(initialValues.genre) ? initialValues.genre : (initialValues.genre || ''),
    status: initialValues.status || 'want-to-read',
    notes: initialValues.notes || ''
  };
};

export default function BookForm({ open, onClose, initialValues = {}, onSave }) {
  const [form, setForm] = useState(() => getInitialForm(initialValues));
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or initialValues changes
  useEffect(() => {
    if (open) {
      setForm(getInitialForm(initialValues));
      setErrors({});
    }
  }, [open, initialValues]);

  const handleChange = (field, value) => {
    if (value !== undefined) {
      setForm(f => ({ ...f, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const fieldErrors = validate({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: fieldErrors[e.target.name] }));
    }
  };

  const validate = (form) => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (form.isbn && !/^\d{10}(\d{3})?$/.test(form.isbn.replace(/[-\s]/g, ''))) {
      errors.isbn = 'ISBN must be 10 or 13 digits';
    }
    if (form.year && (!/^\d{4}$/.test(form.year) || parseInt(form.year) > new Date().getFullYear())) {
      errors.year = 'Year must be a valid 4-digit year';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSnackbar({
        open: true,
        message: 'Please correct the highlighted fields.',
        severity: 'error',
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await onSave(form);

      setSnackbar({
        open: true,
        message: 'Book saved successfully.',
        severity: 'success',
      });

      // Close modal and reset form on success
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to save book.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: { xs: '90%', sm: 600 }, bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>{initialValues.id ? 'Edit Book' : 'Add Book'}</Typography>
            <Stack spacing={2}>
              <Input name="title" label="Title *" value={form.title} onChange={(e) => handleChange('title', e.target.value)} onBlur={handleBlur} error={!!errors.title} helperText={errors.title} required />
              <Input name="author" label="Author" value={form.author} onChange={(e) => handleChange('author', e.target.value)} onBlur={handleBlur} />
              <Input name="isbn" label="ISBN" value={form.isbn} onChange={(e) => handleChange('isbn', e.target.value)} onBlur={handleBlur} error={!!errors.isbn} helperText={errors.isbn} />
              <Input name="year" label="Year" type="number" value={form.year} onChange={(e) => handleChange('year', e.target.value)} onBlur={handleBlur} error={!!errors.year} helperText={errors.year} />
              <Select name="genre" label="Genre" value={form.genre} onChange={(value) => handleChange('genre', value)} options={GENRES.map(g => ({ value: g, label: g }))} multiple={form.genre instanceof Array} />
              <Select name="status" label="Status" value={form.status} onChange={(value) => handleChange('status', value)} options={STATUSES.map(s => ({ value: s, label: s.replace('-', ' ') }))} multiple={false} />
              {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  Please fix the errors above
                </Alert>
              )}
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Modal>

      <SnackbarAtom
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
}