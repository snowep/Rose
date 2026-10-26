'use client'

import { Box, Typography, Button, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { CloudSync, CloudDownload, CloudUpload, Delete as DeleteIcon } from '@mui/icons-material'
import { useState } from 'react'
import { BookService, db } from '@/lib/book-service'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user } = useAuth()
  const [syncStatus, setSyncStatus] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [pulling, setPulling] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleSyncToSupabase = async () => {
    if (!user) return
    setSyncing(true)
    setSyncStatus(null)
    try {
      const result = await BookService.syncToSupabase(user.id)
      setSyncStatus(result)
    } finally {
      setSyncing(false)
    }
  }

  const handlePullFromSupabase = async () => {
    if (!user) return
    setPulling(true)
    setSyncStatus(null)
    try {
      const result = await BookService.pullFromSupabase(user.id)
      setSyncStatus(result)
    } finally {
      setPulling(false)
    }
  }

  const handleClearLocalData = async () => {
    setClearing(true)
    try {
      await (db as any).books.clear()
      setSyncStatus({ success: 0, failed: 0, errors: [] })
    } finally {
      setClearing(false)
      setClearDialogOpen(false)
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Box sx={{ mb: 4, p: 3, border: '1px solid #424242', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudSync sx={{ fontSize: 24 }} />
          Supabase Sync
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your books are stored locally in IndexedDB. Use the buttons below to manually sync with Supabase for cross-device access.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleSyncToSupabase}
            disabled={syncing}
            size="large"
          >
            {syncing ? 'Syncing...' : 'Sync to Supabase'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            onClick={handlePullFromSupabase}
            disabled={pulling}
            size="large"
          >
            {pulling ? 'Pulling...' : 'Pull from Supabase'}
          </Button>
        </Box>

        {syncStatus && (
          <Alert severity={syncStatus.failed > 0 ? 'error' : 'success'} sx={{ mb: 2 }}>
            <AlertTitle>{syncStatus.failed > 0 ? 'Sync Completed with Errors' : 'Sync Successful'}</AlertTitle>
            <Typography variant="body2">
              ✅ Success: {syncStatus.success} books
              {syncStatus.failed > 0 && <Typography color="error" sx={{ ml: 1 }}>❌ Failed: {syncStatus.failed} books</Typography>}
            </Typography>
            {syncStatus.errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Errors:</Typography>
                <Box sx={{ mt: 1, fontSize: '0.8rem' }}>
                  {syncStatus.errors.map((err, i) => (
                    <Typography key={i} variant="caption" color="error">{err}</Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Local data is stored in browser IndexedDB. Supabase sync is optional for cross-device access.
        </Typography>
      </Box>

      <Box sx={{ p: 3, border: '1px solid #424242', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your reading data is stored locally in your browser. It persists across sessions and works offline.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setClearDialogOpen(true)}
                  disabled={clearing}
                >
                  {clearing ? 'Clearing...' : 'Clear Local Data'}
                </Button>
              </Box>
            </Box>

            <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)} maxWidth="sm">
              <DialogTitle>
                <DeleteIcon color="error" sx={{ mr: 1 }} /> Clear All Local Data?
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  This will permanently delete all your books from local IndexedDB storage. This action cannot be undone.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Books already synced to Supabase will NOT be affected.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setClearDialogOpen(false)} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleClearLocalData}
                  variant="contained"
                  color="error"
                  disabled={clearing}
                >
                  {clearing ? 'Deleting...' : 'Delete All Data'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )
      }