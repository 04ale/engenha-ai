import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { AcervosTable } from "@/components/acervos/AcervosTable"
import { useAcervos } from "@/hooks/useAcervos"
import { acervoService } from "@/services/acervoService"
import { storageService } from "@/services/storageService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import type { Acervo } from "@/types/acervo"
import type { AcervosFilters } from "@/services/acervoService"

export default function ListAcervosPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filters, setFilters] = useState<AcervosFilters>({})
  const [selectedAcervo, setSelectedAcervo] = useState<Acervo | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { acervos, loading, refetch } = useAcervos(filters)

  const handleView = (acervo: Acervo) => {
    navigate(`/app/acervos/${acervo.id}`)
  }

  const handleEdit = (acervo: Acervo) => {
    navigate(`/app/acervos/${acervo.id}/editar`)
  }

  const handleDelete = (acervo: Acervo) => {
    setSelectedAcervo(acervo)
    setShowDeleteDialog(true)
  }

  const handleViewCAT = async (acervo: Acervo) => {
    if (!acervo.arquivo_cat_url) {
      toast.info("Este acervo não possui arquivo CAT anexado")
      return
    }

    try {
      // Para dados mockados, mostrar mensagem informativa
      if (acervo.arquivo_cat_url.startsWith("blob:") || acervo.arquivo_cat_url.startsWith("https://example.com")) {
        toast.info(`Arquivo CAT: ${acervo.arquivo_cat_nome || "CAT.pdf"}\n\nEm produção, este arquivo seria aberto para visualização.`)
        return
      }

      // Tentar abrir URL pública
      if (acervo.arquivo_cat_url.startsWith("http")) {
        window.open(acervo.arquivo_cat_url, "_blank")
        return
      }

      // Se for path, gerar signed URL
      const signedUrl = await storageService.getSignedUrl(acervo.arquivo_cat_url)
      window.open(signedUrl, "_blank")
    } catch (error) {
      toast.error("Erro ao abrir arquivo CAT")
    }
  }

  const confirmDelete = async () => {
    if (!selectedAcervo || !user?.workspace_id) return

    setIsDeleting(true)
    try {
      await acervoService.delete(selectedAcervo.id, user.workspace_id)
      toast.success("Acervo excluído com sucesso!")
      setShowDeleteDialog(false)
      setSelectedAcervo(null)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir acervo")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Acervos Técnicos
          </h2>
          <p className="text-muted-foreground">
            Gerencie seus acervos técnicos e CATs
          </p>
        </div>
        <Button onClick={() => navigate("/app/acervos/novo")} className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Novo Acervo
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por descrição, número ART ou contrato"
                  value={filters.search || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <AcervosTable
          acervos={acervos}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewCAT={handleViewCAT}
        />
      </div>

      {showDeleteDialog && selectedAcervo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Excluir Acervo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tem certeza que deseja excluir o acervo "{selectedAcervo.descricao_obra}"?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setSelectedAcervo(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
