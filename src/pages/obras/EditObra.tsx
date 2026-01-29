import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ObraFormStepByStep } from "@/components/obras/ObraFormStepByStep"
import { obraService } from "@/services/obraService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import type { ObraInput } from "@/lib/validations/obra"
import type { Obra } from "@/types/obra"

export default function EditObraPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [obra, setObra] = useState<Obra | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingObra, setIsLoadingObra] = useState(true)

  useEffect(() => {
    const loadObra = async () => {
      if (!id || !user?.workspace_id) return

      try {
        setIsLoadingObra(true)
        const obraData = await obraService.getById(id, user.workspace_id)
        if (!obraData) {
          toast.error("Obra não encontrada")
          navigate("/app/obras")
          return
        }
        setObra(obraData)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao carregar obra")
        navigate("/app/obras")
      } finally {
        setIsLoadingObra(false)
      }
    }

    loadObra()
  }, [id, user?.workspace_id, navigate])

  const handleSubmit = async (data: ObraInput) => {
    if (!id || !user?.workspace_id) return

    setIsLoading(true)
    try {
      await obraService.update(id, data, user.workspace_id)
      toast.success("Obra atualizada com sucesso!")
      navigate("/app/obras")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar obra")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/app/obras")
  }

  if (isLoadingObra) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  if (!obra) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Editar Obra
        </h2>
        <p className="text-muted-foreground">
          Atualize os dados da obra
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ObraFormStepByStep
          obra={obra}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  )
}
