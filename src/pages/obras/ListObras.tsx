import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ObrasTable } from "@/components/obras/ObrasTable"
import { ObrasFiltersComponent } from "@/components/obras/ObrasFilters"
import { useObras } from "@/hooks/useObras"
import type { Obra } from "@/types/obra"
import type { ObrasFilters } from "@/services/obraService"

export default function ListObrasPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ObrasFilters>({})

  const { obras, loading } = useObras(filters)

  const handleView = (obra: Obra) => {
    navigate(`/app/obras/${obra.id}`)
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
        />
      </div>
    </DashboardLayout>
  )
}
