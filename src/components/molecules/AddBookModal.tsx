'use client'

import { Box, Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography } from '@mui/material'
import { Book } from '@/lib/db'
import { useEffect, useState } from 'react'
import { BookFormTabs } from '@/components/atoms/BookFormTabs'
import { BookFormBasic } from '@/components/molecules/BookFormBasic'
import { BookFormCoreIdentity } from '@/components/molecules/BookFormCoreIdentity'
import { BookFormAuthors } from '@/components/molecules/BookFormAuthors'
import { BookFormSeries } from '@/components/molecules/BookFormSeries'
import { BookFormPublisher } from '@/components/molecules/BookFormPublisher'
import { BookFormReading } from '@/components/molecules/BookFormReading'
import { BookFormContent } from '@/components/molecules/BookFormContent'

interface BookModalProps {
  open: boolean
  onClose: () => void
  onSave: (book: Partial<Book>) => void
  editingBook?: Book | null
}

export function AddBookModal({ open, onClose, onSave, editingBook }: BookModalProps) {
  const [book, setBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    status: 'want-to-read',
  })
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (editingBook) {
      setBook(editingBook)
    } else {
      setBook({
        title: '',
        author: '',
        status: 'want-to-read',
      })
    }
    setTabValue(0)
  }, [editingBook, open])

  const handleSave = () => {
    if (!book.title?.trim() || !book.author?.trim()) {
      return
    }
    onSave(book)
    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setBook({ ...book, [field]: value })
  }

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <BookFormBasic book={book} onChange={handleChange} />
      case 1:
        return <BookFormCoreIdentity book={book} onChange={handleChange} />
      case 2:
        return <BookFormAuthors book={book} onChange={handleChange} />
      case 3:
        return <BookFormSeries book={book} onChange={handleChange} />
      case 4:
        return <BookFormPublisher book={book} onChange={handleChange} />
      case 5:
        return <BookFormReading book={book} onChange={handleChange} />
      case 6:
        return <BookFormContent book={book} onChange={handleChange} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <BookFormTabs value={tabValue} onChange={setTabValue} />
        <Box sx={{ maxHeight: '60vh', overflow: 'auto', pr: 1 }}>
          {renderTabContent()}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant='outlined'>
          Cancel
        </Button>
        <Button onClick={handleSave} variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

