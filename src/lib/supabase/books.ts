import { createClient } from './client'
import { createServerClient } from './server'

export type Book = {
  id: string
  title: string
  subtitle?: string
  isbn10?: string
  isbn13?: string
  publication_year?: number
  pages?: number
  description?: string
}

export async function getAllBooks() {
  const supabase = createClient()
  const { data, error } = await supabase.from('books').select('*')
  if (error) throw error
  return data as Book[]
}

export async function createBook(book: Partial<Book>, userId: string) {
  const supabase = createClient()

  // dedupe by isbn
  if (book.isbn13) {
    const { data: existing } = await supabase.from('books').select('id').eq('isbn13', book.isbn13).single()
    if (existing) {
      await ensureUserBook(existing.id, userId)
      return existing
    }
  }

  const { data: newBook, error } = await supabase.from('books').insert(book).select().single()
  if (error) throw error
  await ensureUserBook(newBook.id, userId)
  return newBook
}

export async function addBookToShelf(bookId: string, userId: string) {
  const supabase = createClient()
  await ensureUserBook(bookId, userId)
}

async function ensureUserBook(bookId: string, userId: string) {
  const supabase = createClient()
  const { data } = await supabase.from('user_books').select('id').eq('book_id', bookId).eq('user_id', userId).single()
  if (!data) {
    await supabase.from('user_books').insert({ book_id: bookId, user_id: userId, read_count: 0, added_at: new Date().toISOString() })
  }
}
