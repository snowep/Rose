import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from('books').select('*')
    if (error) throw error
    return NextResponse.json({ success: true, count: data.length, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to fetch books' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { data, error } = await supabase.from('books').insert(body).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to create book' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { id, ...updates } = body
    const { data, error } = await supabase.from('books').update(updates).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
