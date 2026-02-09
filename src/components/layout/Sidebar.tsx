import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building, Building2, FileText, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Obras", href: "/app/obras", icon: Building2 },
  { name: "Acervos", href: "/app/acervos", icon: FileText },
  { name: "Empresas", href: "/app/empresas", icon: Building }
]

export function Sidebar() {
  const location = useLocation()
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => {
              setMobileOpen(false)
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform",
              isActive && "scale-110"
            )} />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="bg-sidebar border-sidebar-border shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar border-sidebar-border">
          <SheetHeader>
            <SheetTitle className="text-sidebar-foreground">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-20 lg:border-r lg:bg-sidebar lg:border-sidebar-border">
        <div className="flex-1 px-4 py-6 overflow-y-auto flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-3 mb-3">
              Navegação
            </h2>
            <SidebarContent />
          </div>

          <div className="mt-auto pt-4 border-t border-sidebar-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>

      </aside>
    </>
  )
}
