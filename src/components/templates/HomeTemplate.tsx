'use client'

import { PageContainer } from '@/components/molecules/PageContainer'
import { BooksList } from '@/components/organisms/BooksList'

export function HomeTemplate() {
  return (
    <PageContainer title="Home">
      <BooksList />
    </PageContainer>
  )
}
