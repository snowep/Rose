'use client'
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { BookService } from '@/lib/book-service'

export function ReadingProgressSection({ book, onLogProgress, onEdit, onDelete }: { book: any; onLogProgress: () => void; onEdit: () => void; onDelete: () => void }) {
  const handleDelete = async () => {
    if (confirm('Delete this book?')) { onDelete() }
  }

  const handleStatusChange = async (e: any) => {
    await BookService.updateStatus(book.id, e.target.value)
    window.location.reload()
  }

  const statuses = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'read', label: 'Read' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'dnf', label: 'DNF' },
  ]

  return (
    <Box sx={{ p: 2, border: '1px solid #424242', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Reading Progress</Typography>
        <Button startIcon={<Add />} onClick={onLogProgress} variant="outlined" size="small">Log</Button>
      </Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select labelId="status-label" value={book.status || 'want-to-read'} label="Status" onChange={handleStatusChange}>
          {statuses.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
        </Select>
      </FormControl>
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