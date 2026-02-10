import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ObraFormStepByStep } from "@/components/obras/ObraFormStepByStep"
import { TutorialNovaObra } from "@/components/common/TutorialNovaObra"
import { obraService } from "@/services/obraService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import type { ObraInput } from "@/lib/validations/obra"

export default function CreateObraPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: ObraInput) => {
    if (!user?.id || !user?.workspace_id || !user?.id) {
      toast.error("Erro: dados do usuário não encontrados")
      return
    }

    setIsLoading(true)
    try {
      // Para MVP, empresa_id será igual ao workspace_id
      await obraService.create(
        data,
        user.id,
        user.workspace_id,
        user.id,
        user.workspace_id
      )
      toast.success("Obra criada com sucesso!")
      navigate("/app/obras")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar obra")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/app/obras")
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 id="nova-obra-title" className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Nova Obra
        </h2>
        <p className="text-muted-foreground">
          Preencha os dados para cadastrar uma nova obra
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ObraFormStepByStep
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
      <TutorialNovaObra />
    </DashboardLayout>
  )
}
