'use client'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert, AlertTitle } from '@mui/material'

interface LogoutConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  loading?: boolean
  error?: string | null
}

export function LogoutConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
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
      <DialogTitle>Sign Out?</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Sign out failed</AlertTitle>
            {error}
          </Alert>
        )}
        <Alert severity="info" variant="filled" sx={{ mb: 2 }}>
          <AlertTitle>Confirm Sign Out</AlertTitle>
          Are you sure you want to sign out? You'll need to sign in again to access your library.
        </Alert>
        <Typography variant="body2" color="text.secondary">
          You can always sign back in from the login page.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus disabled={loading}>
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}