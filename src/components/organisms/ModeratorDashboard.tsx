import { useEffect, useState, useCallback, useRef } from 'react'
import { Box, Button, Paper, Typography, List, ListItem, ListItemText } from '@mui/material'
import { createBrowserClient as createClient } from '../../lib/supabase'

export default function ModeratorDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const supabase = createClient()
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const load = useCallback(async () => {
    const { data } = await supabase.from('catalog_submissions').select('*').eq('status', 'pending')
    if (mounted.current) setSubmissions(data || [])
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  const approve = async (id: string) => {
    await supabase.from('catalog_submissions').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', id)
    load()
  }

  const reject = async (id: string) => {
    await supabase.from('catalog_submissions').update({ status: 'rejected' }).eq('id', id)
    load()
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Moderator Dashboard</Typography>
      <List>
        {submissions.map(s => (
          <ListItem key={s.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText primary={s.title} secondary={`Author: ${s.author} • ISBN: ${s.isbn13}`} />
            <Box sx={{ mt: 1 }}>
              <Button size="small" onClick={() => approve(s.id)}>Approve</Button>
              <Button size="small" onClick={() => reject(s.id)}>Reject</Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
