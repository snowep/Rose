import { Snackbar, Alert } from '@mui/material';

export default function SnackbarAtom({ open, message, severity = 'info', onClose }) {
  return (
    <Snackbar
      open={open}
      message={message}
      severity={severity}
      action={[
        { label: 'Undo', onClick: onClose }
      ]}
      autoHideDuration={4000}
    />
  );
}