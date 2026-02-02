import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ObrasTable } from "@/components/obras/ObrasTable"
import { ObrasFiltersComponent } from "@/components/obras/ObrasFilters"
import { useObras } from "@/hooks/useObras"
import type { Obra } from "@/types/obra"
import type { ObrasFilters } from "@/services/obraService"

export default function ListObrasPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ObrasFilters>({})

  const { obras, loading, deleteObra } = useObras(filters)
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleView = (obra: Obra) => {
    navigate(`/app/obras/${obra.id}`)
  }

  const handleDelete = (obra: Obra) => {
    setSelectedObra(obra)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!selectedObra) return

    setIsDeleting(true)
    try {
      await deleteObra(selectedObra.id)
      toast.success("Obra excluída com sucesso")
      setShowDeleteDialog(false)
      setSelectedObra(null)
    } catch (error) {
      toast.error("Erro ao excluir obra")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Obras
          </h2>
          <p className="text-muted-foreground">
            Gerencie suas obras cadastradas
          </p>
        </div>
        <Button onClick={() => navigate("/app/obras/novo")} className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      <div className="space-y-6">
        <ObrasFiltersComponent filters={filters} onFiltersChange={setFilters} />
        <ObrasTable
          obras={obras}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
        />
      </div>

      {showDeleteDialog && selectedObra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Excluir Obra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tem certeza que deseja excluir a obra "{selectedObra.descricao_obra}"?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setSelectedObra(null)
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
