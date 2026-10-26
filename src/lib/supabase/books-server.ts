import { createServerClient } from './server'

export async function getAllBooksServer() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from('books').select('*')
  if (error) throw error
  return data as any[]
}