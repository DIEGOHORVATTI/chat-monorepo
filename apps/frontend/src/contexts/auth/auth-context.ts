import { createContext } from 'react'

// Definição dos tipos
export interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  avatarUrl?: string | null
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
