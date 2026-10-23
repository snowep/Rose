'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import * as React from 'react'

const cache = createCache({
  key: 'mui',
  prepend: true,
})

export function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  return <CacheProvider value={cache}>{children}</CacheProvider>
}
