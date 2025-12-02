import useRouter from '@/hooks/use-router'
import { useToast } from '@/hooks/use-toast'
import { orpcClient } from '@/lib/orpc-client'
import { useState, useEffect, type ReactNode } from 'react'

import { type User, AuthContext } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await orpcClient.identity.me()
        if (result.user) setUser(result.user)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const currentPath = router.getCurrentPath()
    const isOnAuthPage = currentPath.startsWith('/auth/')

    // Não autenticado → manda para login (se não estiver em páginas de auth)
    if (!isAuthenticated && !isOnAuthPage) {
      router.replaceRoute('/auth/login')
      return
    }

    // Autenticado mas parado em páginas de auth → manda para /
    if (isAuthenticated && isOnAuthPage) {
      router.replaceRoute('/')
    }
  }, [isLoading, isAuthenticated, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await orpcClient.identity.login({ email, password })
      const userData = await orpcClient.identity.me()
      setUser(userData.user)

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Você será redirecionado para o dashboard.',
      })
      router.replaceRoute('/')
    } catch (error) {
      toast({
        title: 'Erro no login',
        description: 'Credenciais inválidas',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await orpcClient.identity.logout()
      setUser(null)
      toast({
        title: 'Logout realizado com sucesso',
        description: 'Você foi desconectado com segurança.',
      })
      router.replaceRoute('/auth/login')
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        description: 'Ocorreu um erro ao tentar desconectar.',
        variant: 'destructive',
      })
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await orpcClient.identity.register({ name, email, password })
      toast({
        title: 'Registro realizado com sucesso!',
        description: 'Você já pode fazer login no sistema.',
      })
      router.replaceRoute('/auth/login')
    } catch (error) {
      toast({
        title: 'Erro no registro',
        description: 'Falha ao criar conta',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
