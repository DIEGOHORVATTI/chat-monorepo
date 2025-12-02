import type { ReactNode } from 'react'

import { useEffect } from 'react'
import useRouter from '@/hooks/use-router'
import { useAuth } from '@/contexts/auth/use-auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replaceRoute('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
