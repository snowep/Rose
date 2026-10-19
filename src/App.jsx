import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Chip,
  Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BookFormModal from './components/BookFormModal.jsx';
import { addBook, getAllBooks, initializeDefaultTags, getBookById, updateBook, deleteBook } from './lib/bookService.js';

const drawerWidth = 240;

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ py: 3 }}>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="All Books" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Reading" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Completed" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Want to Read" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  useEffect(() => {
    async function init() {
      await initializeDefaultTags();
      const all = await getAllBooks();
      setBooks(all);
    }
    init();
  }, []);

  const handleOpenAdd = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editingBook) {
      await updateBook(editingBook.id, data);
      setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...data } : b));
    } else {
      const id = await addBook(data);
      setBooks([...books, { ...data, id }]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    setBooks(books.filter(b => b.id !== id));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Rose Library
          </Typography>
          <Button color="inherit" onClick={handleOpenAdd}>
            Add Book
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">My Collection</Typography>
            <Button variant="contained" onClick={handleOpenAdd}>Add Book</Button>
          </Box>
          <Grid container spacing={3}>
            {books.map((b) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={b.id}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {b.tags?.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{b.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{b.author}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {b.status === 'reading' && b.progress !== undefined ? `Progress: ${b.progress}%` : b.status}
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1, pt: 2 }}>
                    <Button size="small" onClick={() => handleEdit(b)}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(b.id)}>Delete</Button>
                  </Box>
                </Box>
              </Grid>
            ))}
            {books.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No books yet. Click "Add Book" to get started!
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      <BookFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialValues={editingBook || {}}
      />
    </Box>
  );
}