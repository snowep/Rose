'use client'

import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material'
import { CloudSync, CloudDownload, CloudUpload } from '@mui/icons-material'
import { useState } from 'react'
import { BookService } from '@/lib/book-service'

export default function SettingsPage() {
  const [syncStatus, setSyncStatus] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [pulling, setPulling] = useState(false)

  const handleSyncToSupabase = async () => {
    setSyncing(true)
    setSyncStatus(null)
    try {
      const result = await BookService.syncToSupabase()
      setSyncStatus(result)
    } finally {
      setSyncing(false)
    }
  }

  const handlePullFromSupabase = async () => {
    setPulling(true)
    setSyncStatus(null)
    try {
      const result = await BookService.pullFromSupabase()
      setSyncStatus(result)
    } finally {
      setPulling(false)
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
          <Button variant="outlined" color="error">Clear Local Data</Button>
        </Box>
      </Box>
    </Box>
  )
}