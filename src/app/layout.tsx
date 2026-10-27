import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider as MuiThemeProvider } from '@/providers/ThemeProvider'
import { ThemeContextProvider } from '@/providers/ThemeContext'
import { AuthProvider } from '@/providers/AuthProvider'

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
        <AppRouterCacheProvider>
          <ThemeContextProvider>
            <MuiThemeProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </MuiThemeProvider>
          </ThemeContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}