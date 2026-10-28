'use client'

import { Box, Typography, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, CircularProgress, Divider, Paper } from '@mui/material'
import { CloudSync, Download as DownloadIcon, Upload as UploadIcon, Delete as DeleteIcon, Sync as SyncIcon, SyncDisabled as SyncDisabledIcon, Visibility as VisibilityIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { BookService, SYNC_OUTBOX_CHANGED_EVENT, BOOKS_CHANGED_EVENT, type SyncOutboxEntry } from '@/lib/book-service'
import { useAuth } from '@/hooks/useAuth'
import { MAX_LOCAL_BACKUP_BYTES, type LocalBackup } from '@/lib/local-backup'
import { todayISO } from '@/lib/utils'

export default function SettingsPage() {
  const { user } = useAuth()
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [clearError, setClearError] = useState<string | null>(null)
  const [pendingOutbox, setPendingOutbox] = useState<{ userId: string; count: number } | null>(null)
  const [outboxError, setOutboxError] = useState<{ userId: string; message: string } | null>(null)
  const [backupDialogOpen, setBackupDialogOpen] = useState(false)
  const [backupPreview, setBackupPreview] = useState<{
    backup: LocalBackup
    report: Awaited<ReturnType<typeof BookService.previewLocalBackup>>['report']
  } | null>(null)
  const [backupBusy, setBackupBusy] = useState(false)
  const [backupError, setBackupError] = useState<string | null>(null)
  const [backupNotice, setBackupNotice] = useState<string | null>(null)
  const backupInputRef = useRef<HTMLInputElement>(null)
  const pendingOutboxCount = user && pendingOutbox?.userId === user.id ? pendingOutbox.count : null
  const outboxErrorMessage = user && outboxError?.userId === user.id ? outboxError.message : null

  // Manual Sync Center state
  const [outboxEntries, setOutboxEntries] = useState<SyncOutboxEntry[]>([])
  const [outboxLoading, setOutboxLoading] = useState(false)
  const [syncCenterOpen, setSyncCenterOpen] = useState(false)
  const [processingEntry, setProcessingEntry] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let active = true
    const refreshPendingCount = async () => {
      try {
        const count = await BookService.getPendingOutboxCount(user.id)
        if (active) {
          setPendingOutbox({ userId: user.id, count })
          setOutboxError(null)
        }
      } catch (error) {
        if (active) {
          setOutboxError({
            userId: user.id,
            message: error instanceof Error ? error.message : 'Unable to read pending sync changes.',
          })
        }
      }
    }

    void refreshPendingCount()
    window.addEventListener(SYNC_OUTBOX_CHANGED_EVENT, refreshPendingCount)
    return () => {
      active = false
      window.removeEventListener(SYNC_OUTBOX_CHANGED_EVENT, refreshPendingCount)
    }
  }, [user])

  const loadOutboxEntries = async () => {
    if (!user) return
    setOutboxLoading(true)
    try {
      const entries = await BookService.getPendingOutbox(user.id)
      setOutboxEntries(entries)
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to load sync queue.')
    } finally {
      setOutboxLoading(false)
    }
  }

  const handleSyncAll = async () => {
    if (!user) return
    setOutboxLoading(true)
    setSyncError(null)
    setSyncSuccess(null)
    try {
      const result = await BookService.processOutbox(user.id)
      if (result.success) {
        setSyncSuccess(`Synced ${result.processed.length} change${result.processed.length === 1 ? '' : 's'}.`)
      } else {
        setSyncError(`Failed to sync ${result.failed.length} change${result.failed.length === 1 ? '' : 's'}.`)
      }
      await loadOutboxEntries()
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Sync failed.')
    } finally {
      setOutboxLoading(false)
    }
  }

  const handleOpenSyncCenter = () => {
    setSyncCenterOpen(true)
    loadOutboxEntries()
  }

  const handleExportBackup = async () => {
    setBackupBusy(true)
    setBackupError(null)
    setBackupNotice(null)
    try {
      const contents = await BookService.createLocalBackup()
      const blob = new Blob([contents], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rose-local-backup-${todayISO()}.json`
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
      setBackupNotice('Local backup downloaded.')
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : 'Unable to export local data.')
    } finally {
      setBackupBusy(false)
    }
  }

  const handleBackupFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setBackupBusy(true)
    setBackupError(null)
    setBackupNotice(null)
    try {
      if (file.size > MAX_LOCAL_BACKUP_BYTES) {
        throw new Error('Backup file exceeds the 25 MB size limit.')
      }
      const contents = await file.text()
      const preview = await BookService.previewLocalBackup(contents)
      setBackupPreview(preview)
      setBackupDialogOpen(true)
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : 'Unable to read this backup file.')
    } finally {
      setBackupBusy(false)
    }
  }

  const handleRestoreBackup = async () => {
    if (!backupPreview || backupBusy) return
    setBackupBusy(true)
    setBackupError(null)
    setBackupNotice(null)
    try {
      const result = await BookService.restoreLocalBackup(backupPreview.backup)
      setBackupDialogOpen(false)
      setBackupPreview(null)
      setBackupNotice(
        `Restore complete. Added ${result.imported.books} books, ${result.imported.people} people, and ${result.imported.userBooks} shelf entries. Skipped ${result.skipped.books + result.skipped.people + result.skipped.userBooks} records with existing IDs.`,
      )
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : 'Unable to restore this backup.')
    } finally {
      setBackupBusy(false)
    }
  }

  const handleClearLocalData = async () => {
    setClearing(true)
    setClearError(null)
    try {
      await BookService.clearAllLocalData()
      setClearDialogOpen(false)
    } catch (error) {
      setClearError(error instanceof Error ? error.message : 'Unable to clear local data.')
    } finally {
      setClearing(false)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Box sx={{ mb: 4, p: 3, border: '1px solid #424242', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudSync sx={{ fontSize: 24 }} />
          Supabase Sync
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Cloud sync is temporarily unavailable while the account-scoped schema and access policies are verified.
        </Typography>
        {pendingOutboxCount !== null && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {pendingOutboxCount} pending local change{pendingOutboxCount === 1 ? '' : 's'} queued.
          </Typography>
        )}
        {outboxErrorMessage && <Alert severity="error" sx={{ mb: 2 }}>{outboxErrorMessage}</Alert>}

        <Alert severity="warning" sx={{ mb: 2 }}>
          Cloud sync is paused. Changes remain on this device and are not uploaded or backed up in the cloud.
        </Alert>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Local data is stored in this browser&apos;s IndexedDB.
        </Typography>
      </Box>

      {/* Manual Sync Center */}
      <Box sx={{ mb: 4, p: 3, border: '1px solid #424242', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SyncIcon sx={{ fontSize: 24 }} />
          Manual Sync Center
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Review and manually process queued local changes. Cloud sync is paused; this center lets you push changes when ready.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={handleOpenSyncCenter}
            disabled={outboxLoading}
          >
            {outboxLoading ? <CircularProgress size={18} color="inherit" /> : 'Open Sync Center'}
          </Button>
        </Stack>
        {syncError && <Alert severity="error" sx={{ mb: 2 }}>{syncError}</Alert>}
        {syncSuccess && <Alert severity="success" sx={{ mb: 2 }}>{syncSuccess}</Alert>}
      </Box>

      <Box sx={{ p: 3, border: '1px solid #424242', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Export or restore a validated backup of this browser&apos;s current Rose library. Restore adds records whose IDs are not already present and never overwrites existing records.
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Backup files contain private library data. Store them securely. This format backs up the active Rose database only; it does not include Supabase data or records in the separate legacy normalized database.
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportBackup}
            disabled={backupBusy}
          >
            Export local backup
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => backupInputRef.current?.click()}
            disabled={backupBusy}
          >
            {backupBusy ? 'Processing...' : 'Preview backup restore'}
          </Button>
          <input
            ref={backupInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleBackupFileChange}
          />
        </Stack>
        {backupError && <Alert severity="error" sx={{ mb: 2 }}>{backupError}</Alert>}
        {backupNotice && <Alert severity="success" sx={{ mb: 2 }}>{backupNotice}</Alert>}
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setClearDialogOpen(true)}
          disabled={clearing}
        >
          {clearing ? 'Clearing...' : 'Clear Active Local Data'}
        </Button>
      </Box>

            <Dialog
              open={clearDialogOpen}
              onClose={clearing ? undefined : () => {
                setClearDialogOpen(false)
                setClearError(null)
              }}
              maxWidth="xs"
              fullWidth
              sx={{
                '& .MuiDialog-paper': {
                  m: { xs: 1, sm: 2 },
                  width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
                  maxHeight: 'calc(100% - 32px)',
                },
              }}
            >
              <DialogTitle>
                <DeleteIcon color="error" sx={{ mr: 1 }} /> Clear Active Local Data?
              </DialogTitle>
              <DialogContent>
                {clearError && <Alert severity="error" sx={{ mb: 2 }}>{clearError}</Alert>}
                <Typography variant="body1">
                  This permanently deletes the active local Rose database&apos;s books, people, shelf entries, and all queued sync operations on this browser. This action cannot be undone.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  The separate legacy normalized database and data already stored in Supabase are not affected.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setClearDialogOpen(false)
                  setClearError(null)
                }} variant="outlined" disabled={clearing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleClearLocalData}
                  variant="contained"
                  color="error"
                  disabled={clearing}
                >
                  {clearing ? 'Deleting...' : 'Clear Active Data'}
                </Button>
              </DialogActions>
            </Dialog>
      <Dialog
        open={backupDialogOpen}
        onClose={() => {
          if (backupBusy) return
          setBackupDialogOpen(false)
          setBackupPreview(null)
          setBackupError(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Local Backup</DialogTitle>
        <DialogContent dividers>
          {backupPreview && (
            <Stack spacing={2}>
              <Typography>
                Created {new Date(backupPreview.backup.createdAt).toLocaleString()}.
                {backupPreview.backup.ownerUserId
                  ? ' This backup is tied to the currently signed-in account.'
                  : ' This backup has no account-owned shelf entries.'}
              </Typography>
              <Typography>
                Contains {backupPreview.backup.data.books.length} books, {backupPreview.backup.data.people.length} people, and {backupPreview.backup.data.userBooks.length} shelf entries.
              </Typography>
              <Typography>
                Existing IDs to skip: {backupPreview.report.duplicateIds.books} books, {backupPreview.report.duplicateIds.people} people, and {backupPreview.report.duplicateIds.userBooks} shelf entries.
              </Typography>
              {backupPreview.report.possibleBookDuplicates.length > 0 && (
                <Alert severity="warning">
                  {backupPreview.report.possibleBookDuplicates.length} book(s) have ISBNs that match existing records. They will be imported because their IDs differ; review for duplicates afterward.
                </Alert>
              )}
              {backupError && <Alert severity="error">{backupError}</Alert>}
              <Alert severity="info">
                Import adds only records with IDs not already in this browser. It does not overwrite existing data or upload anything.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setBackupDialogOpen(false)
              setBackupPreview(null)
              setBackupError(null)
            }}
            disabled={backupBusy}
          >
            Cancel
          </Button>
          <Button onClick={handleRestoreBackup} variant="contained" disabled={backupBusy || !backupPreview}>
            {backupBusy ? 'Restoring...' : 'Add missing records'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Sync Center Dialog */}
      <Dialog
        open={syncCenterOpen}
        onClose={() => {
          setSyncCenterOpen(false)
          setSyncError(null)
          setSyncSuccess(null)
        }}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
            maxHeight: 'calc(100% - 32px)',
          },
        }}
      >
        <DialogTitle>
          <SyncIcon color="primary" sx={{ mr: 1 }} /> Manual Sync Center
        </DialogTitle>
        <DialogContent dividers>
          {syncError && <Alert severity="error" sx={{ mb: 2 }}>{syncError}</Alert>}
          {syncSuccess && <Alert severity="success" sx={{ mb: 2 }}>{syncSuccess}</Alert>}
          {outboxLoading ? (
            <CircularProgress />
          ) : outboxEntries.length === 0 ? (
            <Typography color="text.secondary">No pending changes to sync.</Typography>
          ) : (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Entity</TableCell>
                      <TableCell>Operation</TableCell>
                      <TableCell>Revision</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outboxEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Chip
                            label={entry.entity}
                            size="small"
                            variant="outlined"
                            color={entry.entity === 'book' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.operation}
                            size="small"
                            variant={entry.operation === 'delete' ? 'filled' : 'outlined'}
                            color={entry.operation === 'delete' ? 'error' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{entry.revision}</TableCell>
                        <TableCell>{new Date(entry.createdAt).toLocaleString('en-US', { timeZone: 'UTC' })}</TableCell>
                        <TableCell>
                          <Chip
                            label={entry.status}
                            size="small"
                            variant={
                              entry.status === 'conflict' ? 'filled' :
                              entry.status === 'failed' ? 'filled' :
                              entry.status === 'processed' ? 'outlined' :
                              'outlined'
                            }
                            color={
                              entry.status === 'conflict' ? 'warning' :
                              entry.status === 'failed' ? 'error' :
                              entry.status === 'processed' ? 'success' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => setProcessingEntry(entry.id)}
                            disabled={processingEntry === entry.id || entry.status === 'processed'}
                          >
                            <SyncIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider sx={{ my: 2 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} component="div" sx={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SyncIcon />}
                  onClick={handleSyncAll}
                  disabled={outboxLoading || outboxEntries.length === 0}
                >
                  {outboxLoading ? <CircularProgress size={18} color="inherit" /> : 'Sync All Pending'}
                </Button>
                <Button variant="outlined" onClick={() => setSyncCenterOpen(false)} disabled={outboxLoading}>
                  Close
                </Button>
              </Stack>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}