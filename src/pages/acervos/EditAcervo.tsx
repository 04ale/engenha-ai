import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AcervoFormStepByStep } from "@/components/acervos/AcervoFormStepByStep"
import { acervoService } from "@/services/acervoService"
import { storageService } from "@/services/storageService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import type { AcervoInput } from "@/lib/validations/acervo"
import type { Acervo } from "@/types/acervo"

export default function EditAcervoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [acervo, setAcervo] = useState<Acervo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAcervo, setIsLoadingAcervo] = useState(true)

  useEffect(() => {
    const loadAcervo = async () => {
      if (!id || !user?.workspace_id) return

      try {
        setIsLoadingAcervo(true)
        const acervoData = await acervoService.getById(id, user.workspace_id)
        if (!acervoData) {
          toast.error("Acervo não encontrado")
          navigate("/app/acervos")
          return
        }
        setAcervo(acervoData)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao carregar acervo")
        navigate("/app/acervos")
      } finally {
        setIsLoadingAcervo(false)
      }
    }

    loadAcervo()
  }, [id, user?.workspace_id, navigate])

  const handleSubmit = async (data: AcervoInput & { catFile?: File }) => {
    if (!id || !user?.workspace_id) return

    setIsLoading(true)
    try {
      const { catFile, ...acervoData } = data

      // Upload do arquivo CAT se houver novo arquivo
      if (catFile) {
        const { url } = await storageService.uploadCAT(
          catFile,
          user.workspace_id,
          id
        )
        acervoData.arquivo_cat_url = url
        acervoData.arquivo_cat_nome = catFile.name
      }

      await acervoService.update(id, acervoData, user.workspace_id)
      toast.success("Acervo atualizado com sucesso!")
      navigate("/app/acervos")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar acervo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/app/acervos")
  }

  if (isLoadingAcervo) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  if (!acervo) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Editar Acervo Técnico
        </h2>
        <p className="text-muted-foreground">
          Atualize os dados do acervo técnico
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <AcervoFormStepByStep
          acervo={acervo}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  )
}
