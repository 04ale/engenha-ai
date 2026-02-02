import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client" // <--- 1. Importação nova
import { authService, type User } from "@/services/authService"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
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

  // Função auxiliar para buscar usuário (usada no load e nos eventos)
  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 1. Verificação inicial (ao carregar a página)
    checkUser()

    // 2. Ouvinte de Eventos do Supabase (AQUI ESTÁ A MÁGICA)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth Event:", event)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Se o Supabase diz que logou ou renovou token, garantimos que temos os dados do perfil atualizados
        if (session) {
          await checkUser()
        }
      }

      if (event === 'SIGNED_OUT') {
        // Se deslogou (ou token expirou), limpamos tudo na hora
        setUser(null)
        setLoading(false)
        localStorage.removeItem("app_user") // Garante a limpeza do cache manual
      }
    })

    // Cleanup: remove o ouvinte quando o componente desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
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