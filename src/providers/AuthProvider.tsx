'use client'

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  isOffline: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createClient()

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!active) return

      if (error) {
        console.error('Unable to load authentication session:', error)
      } else {
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    }

    void loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    const updateOnlineStatus = () => setIsOffline(!navigator.onLine)
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      active = false
      subscription.unsubscribe()
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp: AuthContextValue['signUp'] = async (email, password, metadata) => {
    const { error } = await createClient().auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await createClient().auth.signOut()
    if (error) throw error
  }

  const resetPassword: AuthContextValue['resetPassword'] = async (email) => {
    const { error } = await createClient().auth.resetPasswordForEmail(email)
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut, resetPassword, isOffline }}
    >
      {children}
    </AuthContext.Provider>
  )
}
