import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: books, error } = await supabase
      .from('books')
      .select(`
        *,
        book_people(
          person:person_id (name)
        ),
        publishers!inner(name),
        genres(name)
      `)
      .order('title')

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Transform to match expected format
    const transformed = books.map((book: any) => ({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      author: book.book_people?.map((bp: any) => bp.person?.name ?? '').filter(Boolean).join(', '),
      authors: book.book_people?.map((bp: any) => bp.person?.name ?? '').filter(Boolean) ?? [],
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
    }))

    return NextResponse.json({ success: true, data: transformed })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const {
      title,
      subtitle,
      author,
      authors,
      isbn10,
      isbn13,
      publisher,
      publisher_id,
      genre,
      publicationYear,
      pages,
      description,
      status = 'want-to-read',
      tags,
      coverImage
    } = body

    // Insert book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        title,
        subtitle,
        isbn10,
        isbn13,
        publication_year: publicationYear,
        pages,
        description,
        publisher_id,
        genre
      })
      .select()
      .single()

    if (bookError) {
      console.error('Error creating book:', bookError)
      return NextResponse.json(
        { success: false, error: bookError.message },
        { status: 500 }
      )
    }

    // Handle authors - find or create people
    const authorNames = authors || (author ? author.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [])

    for (const authorName of authorNames) {
      // Try to find existing author
      const { data: existingAuthor } = await supabase
        .from('people')
        .select('id, name')
        .ilike('name', authorName)
        .single()

      const personId = existingAuthor?.id

      if (personId) {
        await supabase.from('book_people').insert({
          book_id: book.id,
          person_id: personId,
          role: 'author',
          sort_order: 0
        })
      } else {
        // Create new person
        const nameParts = authorName.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        const { data: newPerson } = await supabase.from('people').insert({
          name: authorName,
          sort_name: authorName,
          first_name: firstName,
          last_name: lastName
        }).select('id').single()

        if (newPerson) {
          await supabase.from('book_people').insert({
            book_id: book.id,
            person_id: newPerson.id,
            role: 'author',
            sort_order: 0
          })
        }
      }
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