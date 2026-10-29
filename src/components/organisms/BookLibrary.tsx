'use client'

import { useEffect, useState, useMemo } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { BookService } from '@/lib/book-service'
import { BookCard } from '@/components/molecules/BookCard'
import { LibraryFilters } from '@/components/molecules/LibraryFilters'
import type { Book } from '@/lib/db'

export function BookLibrary() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [genre, setGenre] = useState('')
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')

  useEffect(() => {
    BookService.getAll().then(setBooks)
  }, [])

  const filtered = useMemo(() => {
    let result = [...books]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q)
      )
    }
    if (status) result = result.filter(b => b.status === status)
    if (genre) result = result.filter(b => b.genre === genre)
    if (author) result = result.filter(b => b.author === author)

    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    })
    return result
  }, [books, search, status, genre, author, sortBy])

  const genres = useMemo(() => [...new Set(books.map(b => b.genre).filter((g): g is string => Boolean(g)))], [books])
  const authors = useMemo(() => [...new Set(books.map(b => b.author).filter((a): a is string => Boolean(a)))], [books])
  const statuses = ['want-to-read', 'reading', 'read', 'on-hold', 'dnf'] as unknown as string[]

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Library</Typography>
      <LibraryFilters
        search={search} status={status} genre={genre} author={author} sortBy={sortBy}
        onSearchChange={setSearch} onStatusChange={setStatus} onGenreChange={setGenre}
        onAuthorChange={setAuthor} onSortChange={setSortBy}
        genres={genres} statuses={statuses}
      />
      <Grid container spacing={2}>
        {filtered.map(book => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id || ''}>
            <BookCard
              id={book.id || ''}
              title={book.title}
              author={book.author || ''}
              status={book.status || 'want-to-read'}
              genre={book.genre}
              rating={book.rating}
              progress={book.progress}
              coverImage={book.coverImage}
              tags={book.tags}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
