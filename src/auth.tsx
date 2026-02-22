import React, { useEffect } from 'react'
import { useAuthStore } from './stores/auth-store'
import { useRouter } from '@tanstack/react-router'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const auth = useAuthStore()

  const isAuthenticated = auth.isAuthenticated

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: '/login' })
    }
  }, [isAuthenticated, router])

  return <>{children}</>
}
