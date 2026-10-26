'use client'

import { useState } from 'react'
import { Box, Card, CardContent, Typography, Button, Drawer, IconButton, Snackbar, Alert, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Bookmarks } from '@mui/icons-material'
import { BookService } from '@/lib/book-service'

export function BooksDiscoveryList({ books = [], userId }: { books?: any[], userId?: string }) {
  const [selected, setSelected] = useState<any | null>(null)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  const handleAddToShelf = async (bookId: string) => {
    if (!userId) return
    try {
      // Save to local Dexie first
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      await (BookService as any).db.user_books.add({
        id,
        user_id: userId,
        book_id: bookId,
        read_count: 0,
        added_at: now,
      })
      setSnack({ open: true, message: 'Added to your shelf! Sync in Settings to push to cloud.', severity: 'success' })
      setSelected(null)
    } catch (err) {
      setSnack({ open: true, message: 'Failed to add to shelf', severity: 'error' })
    }
  }

  return (
    <Box>
      {books.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Bookmarks sx={{ fontSize: 64, color: 'text.disabled' }} />
            <Typography variant="h6" color="text.secondary">
              No books in the catalog yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a book to your library to see it here.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 2 }}>
          {books.map((b) => (
            <Card key={b.id} sx={{ cursor: 'pointer' }} onClick={() => setSelected(b)}>
              <CardContent>
                <Typography variant="h6">{b.title}</Typography>
                <Typography variant="body2" color="text.secondary">{b.author}</Typography>
                <Button size="small" sx={{ mt: 1 }} onClick={(e) => { e.stopPropagation(); handleAddToShelf(b.id) }}>
                  Add to Shelf
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
        <Box sx={{ width: 400, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Book Details</Typography>
            <IconButton onClick={() => setSelected(null)}><CloseIcon /></IconButton>
          </Box>
          {selected && (
            <>
              <Typography variant="h5">{selected.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{selected.author}</Typography>
              <Typography sx={{ mt: 2 }}>{selected.description}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleAddToShelf(selected.id)}>
                Add to Shelf
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({...snack, open: false})}>
        <Alert severity={snack.severity} onClose={() => setSnack({...snack, open: false})}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
