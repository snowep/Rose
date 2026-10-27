import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { BookFormBasic } from '@/components/molecules/BookFormBasic'
import { useEffect, useState } from 'react'
import { BookService } from '@/lib/book-service'
import { createEmptyBookFormState } from '@/types/book-form'
import type { BookFormState } from '@/types/book-form'
import type { Book } from '@/lib/db'
import { isValidISBN } from '@/components/atoms/FormISBNInput'

export type { BookFormState } from '@/types/book-form'

export function AddBookModalSimple({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [book, setBook] = useState<BookFormState>(createEmptyBookFormState)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setBook(createEmptyBookFormState())
      setSaveError(null)
    }
  }, [open])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!book.title.trim() || saving) return
    if (book.isbn10 && !isValidISBN(book.isbn10, 'ISBN-10')) {
      setSaveError('Please correct the ISBN-10 before saving.')
      return
    }
    if (book.isbn13 && !isValidISBN(book.isbn13, 'ISBN-13')) {
      setSaveError('Please correct the ISBN-13 before saving.')
      return
    }
    setSaving(true)
    setSaveError(null)

    try {
      const newBook: Omit<Book, 'id' | 'createdAt' | 'updatedAt'> = {
        title: book.title.trim(),
        author: book.authors.join(', '),
        status: book.status || 'want-to-read',
        genre: book.genre,
        tags: book.tags,
        subtitle: book.subtitle,
        isbn10: book.isbn10,
        isbn13: book.isbn13,
        publicationYear: book.publicationYear ? Number(book.publicationYear) : undefined,
        coverImage: book.coverImage,
        language: book.language,
      }
      await BookService.create(newBook)
      onClose()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save this book.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          m: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'calc(100% - 32px)' },
          maxHeight: { xs: '100dvh', sm: 'calc(100% - 64px)' },
          height: { xs: '100dvh', sm: 'auto' },
          borderRadius: { xs: 0, sm: 2 },
          display: 'flex',
        },
      }}
    >
      <DialogTitle>Add New Book</DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        <form id="add-book-form" onSubmit={handleSave}>
          <BookFormBasic book={book} onChange={setBook} />
          {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, pb: { xs: 'calc(12px + env(safe-area-inset-bottom))', sm: 1.5 } }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" form="add-book-form" variant="contained" disabled={saving || !book.title.trim()}>
          {saving ? 'Saving...' : 'Save book'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}