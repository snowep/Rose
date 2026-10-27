'use client'

import { PageContainer } from '@/components/molecules/PageContainer'
import { BooksList } from '@/components/organisms/BooksList'

export function LibraryTemplate() {
  return (
    <PageContainer title="Library">
      <BooksList />
    </PageContainer>
  )
}
