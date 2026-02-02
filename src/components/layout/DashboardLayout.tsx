import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <div className="lg:pl-64 pt-20">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  )
}
