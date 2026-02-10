import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
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
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkUser = async (retryCount = 0) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      let currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        if (retryCount < 5) {
          setTimeout(() => {
            checkUser(retryCount + 1);
          }, 500);
          return;
        }

        console.error("❌ Esgotou tentativas de buscar perfil.");
        setUser(null);
        setLoading(false);
      }

    } catch (error) {
      console.error("Erro no checkUser:", error);
      setUser(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email: string, senha: string) => {
    const { error } = await authService.login({ email, senha });

    if (error) {
      throw new Error(error);
    }
    await checkUser(); // Refresh user after login
  }

  const register = async (data: any) => {
    const { error } = await authService.register(data);
    if (error) {
      throw new Error(error);
    }
    await checkUser(); // Try to refresh user after register (though normally needs login)
  }

  const logout = async () => {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser: () => checkUser()
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