import { Alert, Box, Typography } from '@mui/material'

export default function PublisherPage() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Publishers
      </Typography>
      <Alert severity="info">
        Publisher management is temporarily unavailable. The current implementation writes directly to Supabase, and the deployed schema and access policies have not been verified.
      </Alert>
    </Box>
  )
}
