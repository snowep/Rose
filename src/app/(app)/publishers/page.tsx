'use client'

import { useState } from 'react'
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material'
import { BookService } from '@/lib/book-service'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function PublisherPage() {
  const { user } = useAuth()
  const [publishers, setPublishers] = useState<string[]>([])
  const [publisherName, setPublisherName] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [status, setStatus] = useState<{ success: number; failed: number; errors: string[] } | null>(null)

  const handleAddPublisher = async () => {
    if (!publisherName.trim()) return
    setPublishing(true)
    setStatus(null)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('publishers')
        .upsert({ name: publisherName.trim() })
      if (error) throw error
      setPublishers(prev => [...new Set([...prev, publisherName.trim()])])
      setPublisherName('')
      setStatus({ success: 1, failed: 0, errors: [] })
    } catch (err) {
      setStatus({ success: 0, failed: 1, errors: [err instanceof Error ? err.message : 'Unknown error'] })
    } finally {
      setPublishing(false)
    }
  }

  const handleSyncPublishers = async () => {
    if (!user) return
    setStatus(null)
    try {
      await BookService.syncPublishersToSupabase(user.id)
      setStatus({ success: 0, failed: 0, errors: [] })
    } catch (err) {
      setStatus({ success: 0, failed: 1, errors: [err instanceof Error ? err.message : 'Unknown error'] })
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Publishers
      </Typography>

      {status && (
        <Alert severity={status.failed > 0 ? 'error' : 'success'} onClose={() => setStatus(null)}>
          <AlertTitle>{status.failed > 0 ? 'Sync Completed with Errors' : 'Sync Successful'}</AlertTitle>
          <Typography variant="body2">
            ✅ Success: {status.success} publishers
            {status.failed > 0 && (
              <Typography color="error">
                ❌ Failed: {status.failed} publishers
              </Typography>
            )}
            {status.errors.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">Errors:</Typography>
                <Box>
                  {status.errors.map((err, i) => (
                    <Typography key={i} variant="caption" color="error">{err}</Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Typography>
        </Alert>
      )}

      <Box sx={{ p: 3, border: '1px solid #424242', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Publisher
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage publishers for your books.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, my: 3 }}>
          <input
            type="text"
            value={publisherName}
            onChange={e => setPublisherName(e.target.value)}
            placeholder="Publisher name"
            style={{ flexGrow: 1, padding: 8 }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleAddPublisher}
            disabled={publishing}>
            {publishing ? 'Adding...' : 'Add Publisher'}
          </Button>
        </Box>
        {status && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Local data is stored in browser. Supabase sync is optional.
          </Typography>
        )}
      </Box>

      <Box sx={{ p: 3, border: '1px solid #424242', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Publisher Sync
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Your publishers are stored locally in browser IndexedDB. Use the buttons below to manually sync with Supabase for cross-device access.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSyncPublishers}
          >
            Sync to Supabase
          </Button>
        </Box>
        {status && (
          <Alert severity={status.failed > 0 ? 'error' : 'success'} onClose={() => setStatus(null)} sx={{ my: 2 }}>
            <AlertTitle>{status.failed > 0 ? 'Sync Completed with Errors' : 'Sync Successful'}</AlertTitle>
            <Typography variant="body2">
              ✅ Success: {status.success} publishers
              {status.failed > 0 && (
                <Typography color="error">
                  ❌ Failed: {status.failed} publishers
                </Typography>
              )}
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  )
}