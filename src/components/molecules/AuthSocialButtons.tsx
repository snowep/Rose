'use client';

import { Box, Button, Divider, Typography } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';

export function AuthSocialButtons() {
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<Google />}
        disabled
        sx={{ mb: 1 }}
      >
        Continue with Google
      </Button>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GitHub />}
        disabled
        sx={{ mb: 1 }}
      >
        Continue with GitHub
      </Button>
    </Box>
  );
}
