import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AuthCallback } from "@/pages/auth/AuthCallback"
import LoginPage from "@/pages/auth/Login"
import RegisterPage from "@/pages/auth/Register"
import DashboardPage from "@/pages/dashboard/Dashboard"
import ListObrasPage from "@/pages/obras/ListObras"
import CreateObraPage from "@/pages/obras/CreateObra"
import EditObraPage from "@/pages/obras/EditObra"
import ListAcervosPage from "@/pages/acervos/ListAcervos"
import CreateAcervoPage from "@/pages/acervos/CreateAcervo"
import EditAcervoPage from "@/pages/acervos/EditAcervo"
import AcervoDetailsPage from "@/pages/acervos/AcervoDetails"
import ObraDetailsPage from "@/pages/obras/ObraDetails"
import ListEmpresasPage from "./pages/empresas/ListEmpresa"
import CreateEmpresaPage from "./pages/empresas/CreateEmpresa"
import UserProfilePage from "@/pages/profile/UserProfile"

function App() {

  return (
    <ThemeProvider defaultTheme="system" storageKey="engenha-ai-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="obras" element={<ListObrasPage />} />
                    <Route path="obras/novo" element={<CreateObraPage />} />
                    <Route path="obras/:id/editar" element={<EditObraPage />} />
                    <Route path="obras/:id" element={<ObraDetailsPage />} />
                    <Route path="acervos" element={<ListAcervosPage />} />
                    <Route path="acervos/novo" element={<CreateAcervoPage />} />
                    <Route path="acervos/:id" element={<AcervoDetailsPage />} />
                    <Route path="acervos/:id/editar" element={<EditAcervoPage />} />
                    <Route path="empresas" element={<ListEmpresasPage />} />
                    <Route path="empresas/novo" element={<CreateEmpresaPage />} />
                    <Route path="empresas/:id/editar" element={<CreateEmpresaPage />} />
                    <Route path="perfil" element={<UserProfilePage />} />
                    <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
