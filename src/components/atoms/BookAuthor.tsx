'use client'

import { Container, Grid, Typography } from '@mui/material'

export function BookAuthor({ author }: { author: string }) {
  return (
    <Grid container spacing={1}>
      <Grid>
        <Typography color="text.secondary" sx={{ mb: 1 }} variant="subtitle2">
        by
      </Typography>
      </Grid>
      <Grid>
      <Typography color="text.secondary" sx={{ mb: 1 }} variant="subtitle1">
        {author}
      </Typography>
      </Grid>
    </Grid>
  )
}
