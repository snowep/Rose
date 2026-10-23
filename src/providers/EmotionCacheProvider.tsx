'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import * as React from 'react'

function createEmotionCache() {
  return createCache({
    key: 'mui',
    prepend: true,
  })
}

export function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo(() => createEmotionCache(), [])
  return <CacheProvider value={cache}>{children}</CacheProvider>
}
