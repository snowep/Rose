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
