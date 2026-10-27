import { PageContainer } from '@/components/molecules/PageContainer'
import { Alert, Typography } from '@mui/material'

export default function BooksPage() {
  return (
    <PageContainer title="All Books">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Discover books from the community
      </Typography>
      <Alert severity="info">
        Community catalog and shelf actions are unavailable until the deployed database schema and access policies are verified.
      </Alert>
    </PageContainer>
  )
}