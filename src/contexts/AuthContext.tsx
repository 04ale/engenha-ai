import React, { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/services/authService"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (data: {
    nome_completo: string
    email: string
    senha: string
    confirmar_senha: string
    crea: string
    telefone?: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // Verificar se há usuário salvo no localStorage
      const savedUser = localStorage.getItem("mockUser")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
        setLoading(false)
        return
      }
      
      // Se não houver, usar usuário mock padrão
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        localStorage.setItem("mockUser", JSON.stringify(currentUser))
        setUser(currentUser)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, senha: string) => {
    const { user: loggedUser, error } = await authService.login({ email, senha })
    if (error) {
      throw new Error(error)
    }
    setUser(loggedUser)
  }

  const register = async (data: {
    nome_completo: string
    email: string
    senha: string
    confirmar_senha: string
    crea: string
    telefone?: string
  }) => {
    const { user: newUser, error } = await authService.register(data)
    if (error) {
      throw new Error(error)
    }
    setUser(newUser)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
