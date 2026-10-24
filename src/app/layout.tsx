import type { Metadata } from 'next'
import { ThemeProvider as MuiThemeProvider } from '@/providers/ThemeProvider'
import { ThemeContextProvider } from '@/providers/ThemeContext'
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
          <ThemeContextProvider>
            <MuiThemeProvider>
              <Layout>
                {children}
              </Layout>
            </MuiThemeProvider>
          </ThemeContextProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  )
}
