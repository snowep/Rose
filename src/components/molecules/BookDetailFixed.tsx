'use client'

import { Box, Typography, Chip, Divider, Button, IconButton } from '@mui/material'
import { ArrowBack, Edit, Delete, Star, Add } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { Book } from '@/lib/db'

interface BookDetailProps {
  book: Book | undefined
  onEdit: () => void
  onDelete: () => void
  onLogProgress: () => void
}

export function BookDetail({ book, onEdit, onDelete, onLogProgress }: BookDetailProps) {
  const router = useRouter()
  if (!book) return <Typography>Loading...</Typography>
  const statusColors = { reading: 'primary', read: 'success', 'want-to-read': 'info' } as const
  const handleDelete = async () => {
    if (confirm('Delete this book?')) { onDelete(); router.push('/library') }
  }
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <IconButton onClick={() => router.back()} sx={{ mb: -2, ml: -1 }}><ArrowBack /></IconButton>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 1 }}>{book.title}</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>by {book.author}</Typography>
        <Chip label={book.status} color={statusColors[book.status as keyof typeof statusColors]} sx={{ mb: 1 }} />
        {book.genre && <Chip label={book.genre} variant="outlined" sx={{ mr: 1, mb: 1 }} />}
        {book.tags && book.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {book.tags.map(tag => <Chip key={tag} label={tag} variant="outlined" />)}
          </Box>
        )}
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box sx={{ p: 2, border: '1px solid #424242', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Details</Typography>
          {book.rating && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Star color="warning" /><Typography>{book.rating}/5</Typography></Box>}
          {book.pages && <Typography sx={{ mb: 1 }}><strong>Pages:</strong> {book.pages}{book.progress !== undefined && <span style={{ marginLeft: 8 }}> • {book.progress}%</span>}</Typography>}
          {book.startedAt && <Typography sx={{ mb: 1 }}><strong>Started:</strong> {new Date(book.startedAt).toLocaleDateString()}</Typography>}
          {book.finishedAt && <Typography sx={{ mb: 1 }}><strong>Finished:</strong> {new Date(book.finishedAt).toLocaleDateString()}</Typography>}
          {book.notes && <Box sx={{ mt: 3 }}><Typography variant="subtitle2" sx={{ mb: 1 }}>Notes</Typography><Typography variant="body2" sx={{whiteSpace:"pre-wrap"}}>{book.notes}</Typography></Box>}
        </Box>
        <Box sx={{ p: 2, border: '1px solid #424242', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Reading Progress</Typography>
            <Button startIcon={<Add />} onClick={onLogProgress} variant="outlined" size="small">Log</Button>
          </Box>
          {book.dailyLog && book.dailyLog.length > 0 ? (
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {book.dailyLog.slice().sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map((log,idx)=><Box key={`${log.date}-${idx}`} sx={{ py: 1, borderBottom: '1px solid #424242' }}><Typography variant="body2">{new Date(log.date).toLocaleDateString()}: {log.pagesRead} pages</Typography></Box>)}
            </Box>
          ) : <Typography color="text.secondary">No reading sessions logged yet.</Typography>}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<Edit />} onClick={onEdit}>Edit</Button>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
