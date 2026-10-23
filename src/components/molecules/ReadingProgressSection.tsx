'use client'

import { Box, Typography, Button } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'

export function ReadingProgressSection({ book, onLogProgress, onEdit, onDelete }: { book: any; onLogProgress: () => void; onEdit: () => void; onDelete: () => void }) {
  const handleDelete = async () => {
    if (confirm('Delete this book?')) { onDelete() }
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #424242', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Reading Progress</Typography>
        <Button startIcon={<Add />} onClick={onLogProgress} variant="outlined" size="small">Log</Button>
      </Box>
      {book.dailyLog && book.dailyLog.length > 0 ? (
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {book.dailyLog.slice().sort((a: any, b: any)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map((log: any, idx: number)=><Box key={`${log.date}-${idx}`} sx={{ py: 1, borderBottom: '1px solid #424242' }}><Typography variant="body2">{new Date(log.date).toLocaleDateString()}: {log.pagesRead} pages</Typography></Box>)}
        </Box>
      ) : <Typography color="text.secondary">No reading sessions logged yet.</Typography>}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="outlined" startIcon={<Edit />} onClick={onEdit}>Edit</Button>
        <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>Delete</Button>
      </Box>
    </Box>
  )
}
