"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthState {
  user: User | null
  session: Session | null
  isAdmin: boolean
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

type AuthContextType = AuthState & AuthActions

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if user is admin by querying the database using email
  const checkAdminStatus = useCallback(async (userEmail: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Checking admin status for email:', userEmail)
      const { data, error } = await supabase
        .from('admins')
        .select('email')
        .eq('email', userEmail)
        .single()

      console.log('AuthContext: Admin check result:', { data, error })

      if (error || !data) {
        console.log('AuthContext: User is not admin')
        return false
      }
      console.log('AuthContext: User is admin')
      return true
    } catch (error) {
      console.error('AuthContext: Error checking admin status:', error)
      return false
    }
  }, [])

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      console.log('AuthContext: Initializing auth...')
      setIsLoading(true)
      
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('AuthContext: Session result:', { session: !!session, error })
      
      if (error) {
        console.error('AuthContext: Error getting session:', error)
        setUser(null)
        setSession(null)
        setIsAdmin(false)
        setIsLoading(false)
        setIsInitialized(true)
        return
      }

      if (session?.user) {
        console.log('AuthContext: User found:', session.user.email)
        setUser(session.user)
        setSession(session)
        
        // Check admin status using email
        console.log('AuthContext: Checking admin status...')
        const adminStatus = await checkAdminStatus(session.user.email!)
        console.log('AuthContext: Admin status result:', adminStatus)
        setIsAdmin(adminStatus)
      } else {
        console.log('AuthContext: No session found')
        setUser(null)
        setSession(null)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('AuthContext: Error initializing auth:', error)
      setUser(null)
      setSession(null)
      setIsAdmin(false)
    } finally {
      console.log('AuthContext: Setting loading false and initialized true')
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [checkAdminStatus])

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Google sign in error:', error)
        return { success: false, error: error.message }
      }

      // The redirect will handle the rest
      return { success: true }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setIsAdmin(false)
    } catch (error) {
      console.error('Sign out error:', error)
      // Force clear state even if sign out fails
      setUser(null)
      setSession(null)
      setIsAdmin(false)
    }
  }, [])

  // Refresh auth state
  const refreshAuth = useCallback(async () => {
    await initializeAuth()
  }, [initializeAuth])

  // Initialize on mount
  useEffect(() => {
    console.log('AuthContext: useEffect triggered')
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('AuthContext: Timeout reached, forcing initialization complete')
      setIsLoading(false)
      setIsInitialized(true)
    }, 5000) // 5 second timeout

    // Initialize auth with error handling
    const initAuth = async () => {
      try {
        await initializeAuth()
      } catch (error) {
        console.error('AuthContext: Error in initializeAuth:', error)
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state change:', event)
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('AuthContext: User signed out or no session')
          setUser(null)
          setSession(null)
          setIsAdmin(false)
          setIsLoading(false)
          clearTimeout(timeout)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthContext: User signed in:', session.user.email)
          setUser(session.user)
          setSession(session)
          
          // Check admin status using email
          const adminStatus = await checkAdminStatus(session.user.email!)
          setIsAdmin(adminStatus)
          
          // If not admin, sign out immediately
          if (!adminStatus) {
            console.log('AuthContext: User is not admin, signing out')
            await supabase.auth.signOut()
          }
          
          clearTimeout(timeout)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [initializeAuth, checkAdminStatus])

  const value: AuthContextType = {
    user,
    session,
    isAdmin,
    isLoading,
    isInitialized,
    signInWithGoogle,
    signOut,
    refreshAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
