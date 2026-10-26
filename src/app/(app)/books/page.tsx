import { PageContainer } from '@/components/molecules/PageContainer'
import { BooksDiscoveryList } from '@/components/organisms/BooksDiscoveryList'
import { Typography } from '@mui/material'
import { getAllBooksServer } from '@/lib/supabase/books-server'
import { createServerClient } from '@/lib/supabase/server'

export default async function BooksPage() {
  const [books, supabase] = await Promise.all([
    getAllBooksServer(),
    createServerClient(),
  ])
  const { data: userData } = await supabase.auth.getUser()

  return (
    <PageContainer title="All Books">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Discover books from the community
      </Typography>
      <BooksDiscoveryList books={books} userId={userData?.user?.id} />
    </PageContainer>
  )
}