import type { Metadata } from 'next'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Layout } from '@/components/organisms/Layout'
import './globals.css'

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
        <ThemeProvider>
          <Layout>
            {children}
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
