import type { Metadata } from 'next'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { EmotionCacheProvider } from '@/providers/EmotionCacheProvider'
import { Layout } from '@/components/organisms/Layout'

export const metadata: Metadata = {
  title: 'Rose',
  description: 'Rose application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <EmotionCacheProvider>
          <ThemeProvider>
            <Layout>
              {children}
            </Layout>
          </ThemeProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  )
}