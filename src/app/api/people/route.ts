import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '20')

    let queryBuilder = (await createServerClient()).from('people').select('*').limit(limit)

    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`)
    }

    const { data: people, error } = await queryBuilder.order('name').limit(limit)

    if (error) {
      console.error('Error fetching people:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: people })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}