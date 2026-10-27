import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Stack } from '@mui/material'
import { createEmptyBookFormState } from '@/types/book-form'
import { FormTextField } from '@/components/atoms/FormTextField'
import { FormISBNInput } from '@/components/atoms/FormISBNInput'
import { isValidISBN } from '@/components/atoms/FormISBNInput'
import { FormTagInput } from '@/components/atoms/FormTagInput'
import { FormSelectField } from '@/components/atoms/FormSelectField'
import { FormTextArea } from '@/components/atoms/FormTextArea'
import { FormYearInput } from '@/components/atoms/FormYearInput'
import { FormDragDropUpload } from '@/components/atoms/FormDragDropUpload'

export interface ReviewFormState {
  values: ReviewFormValues
  isSubmitting: boolean
  submitError: string | null
  submitSuccess: boolean
}

export interface ReviewFormValues {
  title: string
  subtitle?: string
  isbn10?: string
  isbn13?: string
  language: string
  publicationYear?: number | string
  status?: string
  genre?: string
  tags?: string[]
  coverImage?: string
  description?: string
}

export function BookReviewForm({ initialBook, onSubmit }: { initialBook?: ReviewFormValues; onSubmit: (book: ReviewFormValues) => void | Promise<void> }) {
  const [state, setState] = useState<ReviewFormState>({
    values: { ...createEmptyBookFormState(), ...initialBook },
    isSubmitting: false,
    submitError: null,
    submitSuccess: false,
  })

  useEffect(() => {
    setState((current) => ({
      ...current,
      values: { ...createEmptyBookFormState(), ...initialBook },
      submitError: null,
      submitSuccess: false,
    }))
  }, [initialBook])

  const updateValues = (values: Partial<ReviewFormValues>) => {
    setState((current) => ({
      ...current,
      values: { ...current.values, ...values },
      submitError: null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.values.title.trim() || state.isSubmitting) return
    if (state.values.isbn10 && !isValidISBN(state.values.isbn10, 'ISBN-10')) {
      setState((current) => ({ ...current, submitError: 'Please correct the ISBN-10 before submitting.' }))
      return
    }
    if (state.values.isbn13 && !isValidISBN(state.values.isbn13, 'ISBN-13')) {
      setState((current) => ({ ...current, submitError: 'Please correct the ISBN-13 before submitting.' }))
      return
    }
    setState((current) => ({ ...current, isSubmitting: true, submitError: null, submitSuccess: false }))

    try {
      await onSubmit(state.values)
      setState((current) => ({ ...current, isSubmitting: false, submitSuccess: true }))
      window.setTimeout(() => {
        setState((current) => ({ ...current, submitSuccess: false }))
      }, 3000)
    } catch (err) {
      setState((current) => ({
        ...current,
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : 'Unable to submit this book.',
      }))
    }
  }

  return (
    <Box sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 0 }, maxWidth: 600, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormTextField label="Title" value={state.values.title} onChange={(title) => updateValues({ title })} required />
          <FormTextField label="Subtitle" value={state.values.subtitle || ''} onChange={(subtitle) => updateValues({ subtitle })} />
          <FormTextArea label="Description" value={state.values.description || ''} onChange={(description) => updateValues({ description })} />
          <FormDragDropUpload label="Cover image" value={state.values.coverImage} onChange={(coverImage) => updateValues({ coverImage })} />
          <FormISBNInput type="ISBN-10" label="ISBN-10" value={state.values.isbn10} onChange={(isbn10) => updateValues({ isbn10 })} />
          <FormISBNInput type="ISBN-13" label="ISBN-13" value={state.values.isbn13} onChange={(isbn13) => updateValues({ isbn13 })} />
          <FormYearInput
            label="Publication year"
            value={state.values.publicationYear}
            onChange={(value) => updateValues({ publicationYear: value === '' ? undefined : Number(value) })}
          />
          <FormTagInput
            label="Genre(s)"
            value={state.values.genre ? state.values.genre.split(',').map((genre) => genre.trim()).filter(Boolean) : []}
            onChange={(genres) => updateValues({ genre: genres.join(', ') })}
            options={['Fiction', 'Non-fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'History', 'Biography', 'Children']}
          />
          <FormTagInput label="Tags" value={state.values.tags || []} onChange={(tags) => updateValues({ tags })} />
          <FormSelectField
            label="Reading status"
            value={state.values.status || 'want-to-read'}
            onChange={(status) => updateValues({ status })}
            options={[
              { value: 'want-to-read', label: 'Want to Read' },
              { value: 'reading', label: 'Reading' },
              { value: 'read', label: 'Read' },
              { value: 'on-hold', label: 'On Hold' },
              { value: 'dnf', label: 'Did Not Finish' },
            ]}
          />
        </Stack>

        <Box sx={{ py: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button type="submit" variant="contained" disabled={state.isSubmitting || !state.values.title.trim()}>
            {state.isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </Box>

        {state.submitError && (
          <Alert severity="error" sx={{ mt: 2 }}>{state.submitError}</Alert>
        )}

        {state.submitSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>Book submitted for review</Alert>
        )}
      </form>
    </Box>
  )
}