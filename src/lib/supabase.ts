import { createClient } from '@supabase/supabase-js'

// Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client with explicit API key configuration
// This is a legacy client for server-side operations that don't need auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Re-export the new SSR clients
export { createClient as createBrowserClient } from './supabase/client'
export { createServerClient } from './supabase/server'

// Database types
export interface BookRecord {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
  pages?: number
  started_at?: string
  finished_at?: string
  cover_image?: string
  notes?: string
  tags?: string[]
  progress?: number
  daily_log?: { date: string; pages_read: number }[]
  created_at: string
  updated_at: string
}

export async function getBooks() {
  const { data, error } = await supabase.from('books').select('*')
  if (error) throw error
  return data
}

export async function getBook(id: string) {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).single()
  if (error) throw error
  return data
}
