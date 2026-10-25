'use client'

import { AppShell } from '@/components/organisms/AppShell'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
    </AppShell>
  )
}

