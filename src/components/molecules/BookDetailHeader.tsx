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

export function BookDetailHeader({ book, onEdit, onDelete }: { book: Book; onEdit: () => void; onDelete: () => void }) {
  const router = useRouter()
  const statusColors = { reading: 'primary', read: 'success', 'want-to-read': 'info' } as const

  const handleDelete = async () => {
    if (confirm('Delete this book?')) { onDelete(); router.push('/library') }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <IconButton onClick={() => router.back()} sx={{ mb: -2, ml: -1 }}><ArrowBack /></IconButton>
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
  )
}
