'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookService } from '@/lib/book-service'
import { Book } from '@/lib/db'
import { BookDetail } from '@/components/organisms/BookDetailFixed'
import { BookModal } from '@/components/organisms/BookModal'
import { LogProgressModal } from '@/components/molecules/LogProgressModal'
import { useEffect } from 'react'

export default function LibraryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book>()
  const [showModal, setShowModal] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadBook(params.id as string)
    }
  }, [params.id])

  const loadBook = async (id: string) => {
    const data = await BookService.getById(id)
    setBook(data)
  }

  const handleSave = async (bookData: Partial<Book>) => {
    if (book) {
      await BookService.update(book.id!, bookData)
      loadBook(book.id!)
    }
    setShowModal(false)
  }

  const handleLogProgress = async (pagesRead: number, date: string) => {
    if (book) {
      await BookService.addDailyLog(book.id!, date, pagesRead)
      loadBook(book.id!)
    }
    setShowLogModal(false)
  }

  const handleDelete = () => {
    router.push('/library')
  }

  if (!book) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }

  return (
    <>
      <BookDetail book={book} onEdit={() => setShowModal(true)} onDelete={handleDelete} onLogProgress={() => setShowLogModal(true)} />
      <BookModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingBook={book}
      />
      <LogProgressModal open={showLogModal} onClose={() => setShowLogModal(false)} onSave={handleLogProgress} />
    </>
  )
}