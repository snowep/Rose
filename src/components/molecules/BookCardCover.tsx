'use client'

import { CardMedia } from '@mui/material'

const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg=='

interface BookCardCoverProps {
  coverImage?: string
  title: string
}

export function BookCardCover({ coverImage, title }: BookCardCoverProps) {
  const cover = coverImage || PLACEHOLDER_COVER

  return (
    <CardMedia
      component="img"
      image={cover}
      alt={`${title} cover`}
      sx={{ height: 200, objectFit: 'cover', borderRadius: '2px 2px 0 0' }}
    />
  )
}