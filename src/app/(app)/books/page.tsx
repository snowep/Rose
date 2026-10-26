'use client'

import { PageContainer } from '@/components/molecules/PageContainer'
import { BooksDiscoveryList } from '@/components/organisms/BooksDiscoveryList'
import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import { getAllBooks } from '@/lib/supabase/books'
import { useAuth } from '@/hooks/useAuth'

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    getAllBooks().then(setBooks).catch(console.error)
  }, [])

  return (
    <PageContainer title="All Books">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Discover books from the community
      </Typography>
      <BooksDiscoveryList books={books} userId={user?.id} />
    </PageContainer>
  )
}
