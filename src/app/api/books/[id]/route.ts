import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = await createServerClient()

    const { data: book, error } = await supabase
      .from('books')
      .select(`
        *,
        book_people(
          person:person_id (name)
        ),
        publishers(name),
        genres(name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PG1100') {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 })
      }
      console.error('Error fetching book:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const transformed = {
      id: book.id,
      title: book.title,
      subtitle: book.subtitle,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      author: book.book_people?.map((bp: any) => bp.person?.name ?? '').filter(Boolean).join(', '),
      authors: book.book_people?.map((bp: any) => ({
        id: bp.person?.id,
        name: bp.person?.name,
        role: bp.role
      })) ?? [],
      publisher: book.publishers?.name,
      genre: book.genres?.name,
      publicationYear: book.publication_year,
      pages: book.pages,
      status: book.status || 'want-to-read',
      rating: book.rating,
      progress: book.progress,
      coverImage: book.cover_image,
      notes: book.notes,
      tags: book.tags || [],
      createdAt: book.created_at,
      updatedAt: book.updated_at
    }

    return NextResponse.json({ success: true, data: transformed })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = await createServerClient()
    const body = await request.json()

    const {
      title,
      subtitle,
      isbn10,
      isbn13,
      publicationYear,
      pages,
      description,
      genre,
      tags,
      coverImage,
      status,
      rating,
      progress
    } = body

    const { data: book, error } = await supabase
      .from('books')
      .update({
        title,
        subtitle,
        isbn10,
        isbn13,
        publication_year: publicationYear,
        pages,
        description,
        genre,
        tags,
        cover_image: coverImage,
        status,
        rating,
        progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating book:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: book })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const supabase = await createServerClient()

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting book:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}