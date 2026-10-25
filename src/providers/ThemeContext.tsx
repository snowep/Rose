'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// Dark-only theme context — no light mode
interface ThemeContextType {
  mode: 'dark'
  toggleMode: () => void
  setMode: (mode: 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Always return dark — no light mode logic
const getInitialTheme = (): 'dark' => 'dark'

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  // Always start with dark mode
  const [mode, setMode] = useState<'dark'>('dark')

  useEffect(() => {
    // Always persist dark mode to localStorage
    try {
      localStorage.setItem('theme-mode', 'dark')
    } catch (e) {
      // localStorage not available (e.g., incognito)
    }
    // Always set data-theme attribute to dark
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [mode])

  const toggleMode = () => {
    // Always set to dark
    setMode('dark')
  }

  // No effectiveMode needed — always dark
  return (
    <ThemeContext.Provider value={{ mode: 'dark', toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}