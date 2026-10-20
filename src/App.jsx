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
  Grid,
  Fab,
  Zoom,
  TextField,
  Autocomplete,
  Stack,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BookFormModal from './components/BookFormModal.jsx';
import { addBook, getAllBooks, initializeDefaultTags, updateBook, deleteBook, getAllTags, getReadingStats } from './lib/bookService.js';

const drawerWidth = 240;

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [view, setView] = useState('library'); // 'library' or 'stats'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ py: 3 }}>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setView('library'); handleDrawerToggle(); }}>
            <ListItemText primary="Library" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setView('stats'); handleDrawerToggle(); }}>
            <ListItemText primary="Statistics" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setView('library'); handleDrawerToggle(); }}>
            <ListItemText primary="Reading" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setView('library'); handleDrawerToggle(); }}>
            <ListItemText primary="Completed" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setView('library'); handleDrawerToggle(); }}>
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
      const tags = await getAllTags();
      setAllTags(tags);
      // Load initial stats
      await loadStats();
    }
    init();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const statsData = await getReadingStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

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
    // Refresh stats after adding/updating a book
    await loadStats();
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    setBooks(books.filter(b => b.id !== id));
    await loadStats();
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = book.title?.toLowerCase().includes(query);
      const matchesAuthor = book.author?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesAuthor) return false;
    }
    // Tag filter (AND: book must have ALL selected tags)
    if (selectedTags.length > 0) {
      const bookTags = book.tags || [];
      return selectedTags.every(tag => bookTags.includes(tag));
    }
    return true;
  });

  // Function to toggle theme
  const toggleTheme = () => {
    const currentMode = localStorage.getItem('themeMode') || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    // No need to force re-render; ThemeProvider will pick up the change on next render
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
          <IconButton
            aria-label="toggle theme"
            onClick={toggleTheme}
            sx={{ ml: 2 }}
          >
            {/* Determine current icon based on stored mode */}
            {(localStorage.getItem('themeMode') === 'light' ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            ))}
          </IconButton>
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
        <Container maxWidth="lg" sx={{ pb: 15 }}>
          {view === 'library' ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">My Collection</Typography>
                <Button variant="contained" onClick={handleOpenAdd}>Add Book</Button>
              </Box>
              {/* Filter Bar */}
              <Box sx={{ mb: 3, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Search by title or author"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    sx={{ flexGrow: 1, minWidth: 200 }}
                  />
                  {allTags.length > 0 && (
                    <Autocomplete
                      multiple
                      options={allTags}
                      value={selectedTags}
                      onChange={(event, newValue) => {
                        setSelectedTags(newValue);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                            sx={{ m: 0.5 }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Filter by tags"
                          placeholder="Select tags"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      sx={{ minWidth: 200 }}
                    />
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTags([]);
                    }}
                    disabled={searchQuery === '' && selectedTags.length === 0}
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
              <Grid container spacing={3}>
                {filteredBooks.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                      No books match your filters.
                    </Typography>
                  </Grid>
                ) : (
                  filteredBooks.map((b) => (
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
                    ))}
                  )}
                )}
              </Grid>
            </>
          ) : (
            // Stats View
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4">Reading Statistics</Typography>
              {loadingStats ? (
                <CircularProgress size={48} />
              ) : stats ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                  <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                    <Box sx={{ textAlign: 'center', minWidth: 96 }}>
                      <Typography variant="h5">{stats.totalBooks}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Books
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 96 }}>
                      <Typography variant="h5">{stats.completedBooks}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 96 }}>
                      <Typography variant="h5">{stats.readingBooks}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Currently Reading
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 96 }}>
                      <Typography variant="h5">{stats.wantToReadBooks}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Want to Read
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Average Progress (Reading Books)</Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {stats.avgProgress !== null && stats.avgProgress !== undefined ? `${stats.avgProgress}%` : '0%'}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1">No data available</Typography>
              )}
            </Box>
          )}
        </Container>
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpenAdd}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
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