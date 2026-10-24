'use client'

import { AppShell } from '@/components/organisms/AppShell'
import { AddBookFab } from '@/components/atoms/AddBookFab'
import { AddBookModal } from '@/components/molecules/AddBookModal'
import { BookService } from '@/lib/book-service'
import * as React from 'react'

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  const handleSave = async (book: any) => {
    await BookService.create(book)
  }

  return (
    <>
      <AppShell>
        {children}
      </AppShell>
      <AddBookFab onClick={() => setOpen(true)} />
      <AddBookModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </>
  )
}

