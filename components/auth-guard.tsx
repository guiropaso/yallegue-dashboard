"use client"

import { useAuth } from '@/lib/auth-context'
import { LoginPage } from './login-page'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAdmin, isLoading, isInitialized } = useAuth()

  console.log('AuthGuard: State:', { 
    user: user?.email, 
    isAdmin, 
    isLoading, 
    isInitialized 
  })

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    console.log('AuthGuard: Showing loading state')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
          <p className="mt-1 text-xs text-gray-500">
            Initialized: {isInitialized ? 'Yes' : 'No'} | Loading: {isLoading ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    )
  }

  // If no user or not admin, show login page
  if (!user || !isAdmin) {
    console.log('AuthGuard: Showing login page - User:', user?.email, 'Admin:', isAdmin)
    return <LoginPage />
  }

  // User is authenticated and is admin, show protected content
  console.log('AuthGuard: Showing dashboard - User:', user.email, 'Admin:', isAdmin)
  return <>{children}</>
}
