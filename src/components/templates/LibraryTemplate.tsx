'use client'

import { PageContainer } from '@/components/molecules/PageContainer'
import { BooksList } from '@/components/organisms/BooksList'
import { AddBookFab } from '@/components/atoms/AddBookFab'
import { AddBookModal } from '@/components/molecules/AddBookModal'
import { useState } from 'react'

export function LibraryTemplate() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageContainer title="Library">
      <BooksList />
      <AddBookFab onClick={() => setModalOpen(true)} />
      <AddBookModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(book) => {
          console.log('Save book:', book)
          setModalOpen(false)
        }}
        editingBook={null}
      />
    </PageContainer>
  )
}
