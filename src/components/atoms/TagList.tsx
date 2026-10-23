'use client'

import { Box, Chip, Typography } from '@mui/material'

export function TagList({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null

  return (
    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tags.slice(0, 4).map(tag => (
        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
      ))}
      {tags.length > 4 && (
        <Typography variant="caption" color="text.secondary">+{tags.length - 4}</Typography>
      )}
    </Box>
  )
}
