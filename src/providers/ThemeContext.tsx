'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// Theme context supporting light/dark/system modes
interface ThemeContextType {
  mode: 'light' | 'dark' | 'system'
  toggleMode: () => void
  setMode: (mode: 'light' | 'dark' | 'system') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const getInitialMode = (): 'light' | 'dark' | 'system' => {
  // Check for saved preference first
  try {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | 'system'
    if (savedMode) return savedMode
  } catch (e) {
    // localStorage not available
  }
  // Check for prefers-color-scheme media query
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  return 'light'
}

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(
    getInitialMode()
  )

  useEffect(() => {
    // Persist mode to localStorage
    try {
      localStorage.setItem('theme-mode', mode)
    } catch (e) {
      // localStorage not available (e.g., incognito)
    }
    // Set data-theme attribute on document element
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode)
    }
  }, [mode])

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
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