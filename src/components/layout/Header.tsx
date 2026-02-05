import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/auth/login")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EA</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Engenha AI
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full gap-2 hover:bg-accent"
            >
              <Avatar className="h-8 w-8">
                {user?.avatar_url ? (
                  <AvatarImage src={user.avatar_url} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.nome_completo?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="hidden md:block text-sm font-medium">{user?.nome_completo}</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                showMenu && "rotate-180"
              )} />
            </Button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-popover border border-border z-50 overflow-hidden">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium">{user?.nome_completo}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/app/perfil")
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {
        showMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
        )
      }
    </header >
  )
}
