'use client'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert, AlertTitle } from '@mui/material'

interface LogoutConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutConfirmDialog({ open, onClose, onConfirm }: LogoutConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sign Out?</DialogTitle>
      <DialogContent>
        <Alert severity="info" variant="filled" sx={{ mb: 2 }}>
          <AlertTitle>Confirm Sign Out</AlertTitle>
          Are you sure you want to sign out? You'll need to sign in again to access your library.
        </Alert>
        <Typography variant="body2" color="text.secondary">
          You can always sign back in from the login page.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          Sign Out
        </Button>
      </DialogActions>
    </Dialog>
  )
}