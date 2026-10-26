'use client'

import { PageContainer } from '@/components/molecules/PageContainer'
import { BooksList } from '@/components/organisms/BooksList'
import { AddBookFab } from '@/components/atoms/AddBookFab'
import { AddBookModalSimple } from '@/components/molecules/AddBookModalSimple'
import { useState } from 'react'

export function LibraryTemplate() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageContainer title="Library">
      <BooksList />
      <AddBookFab onClick={() => setModalOpen(true)} />
      <AddBookModalSimple
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </PageContainer>
  )
}
