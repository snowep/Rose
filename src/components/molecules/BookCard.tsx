'use client'

import { Box, Card, Link, useTheme } from '@mui/material'
import { BookCardCover } from './BookCardCover'
import { BookCardMeta } from './BookCardMeta'
import { BookCardStatus } from './BookCardStatus'
import { BookCardActions } from './BookCardActions'

export interface BookProps {
  id: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
  pages?: number
  progress?: number
  coverImage?: string
  tags?: string[]
}

export function BookCard({ id, title, author, status, genre, rating, pages, progress, coverImage, tags }: BookProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Link href={`/library/detail/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          height: '100%',
          maxHeight: 350,
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: isDark ? '#424242' : '#e0e0e0',
          borderRadius: 1,
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
            boxShadow: `0 4px 12px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
            transform: 'translateY(-2px)',
          }
        }}
      >
        <BookCardCover coverImage={coverImage} title={title} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <BookCardMeta title={title} author={author} status={status} genre={genre} rating={rating} />
          <BookCardStatus pages={pages} progress={progress} status={status} />
          <BookCardActions tags={tags} />
        </Box>
      </Card>
    </Link>
  )
}