import type { Book } from '@/lib/db'

export interface BookFormState {
  title: string
  authors: string[]
  subtitle?: string
  isbn10?: string
  isbn13?: string
  language: string
  publicationYear?: number | string
  status?: Book['status']
  genre?: string
  tags?: string[]
  coverImage?: string
}

export function createEmptyBookFormState(): BookFormState {
  return {
    title: '',
    authors: [],
    language: 'en',
    publicationYear: undefined,
    status: 'want-to-read',
    tags: [],
  }
}
