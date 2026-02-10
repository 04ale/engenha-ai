import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AcervoFormStepByStep } from "@/components/acervos/AcervoFormStepByStep"
import { TutorialNovoAcervo } from "@/components/common/TutorialNovoAcervo"
import { acervoService } from "@/services/acervoService"
import { storageService } from "@/services/storageService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import type { AcervoInput } from "@/lib/validations/acervo"

export default function CreateAcervoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: AcervoInput & { catFile?: File }) => {
    if (!user?.id || !user?.workspace_id) {
      toast.error("Erro: dados do usuário não encontrados")
      return
    }

    setIsLoading(true)
    try {
      const { catFile, ...acervoData } = data

      // 1. Criar acervo primeiro (sem arquivo inicialmente)
      const acervo = await acervoService.create(
        {
          ...acervoData,
          arquivo_cat_url: undefined,
          arquivo_cat_nome: undefined,
        },
        user.id,
        user.workspace_id,
        user.id,
        user.workspace_id
      )

      // 2. Se houver arquivo, fazer upload e atualizar acervo
      if (catFile) {
        try {
          // Upload usando o ID do acervo recém-criado
          const { url } = await storageService.uploadCAT(
            catFile,
            user.workspace_id,
            acervo.id
          )

          // Atualizar acervo com a URL do arquivo
          await acervoService.update(
            acervo.id,
            {
              ...acervoData,
              arquivo_cat_url: url,
              arquivo_cat_nome: catFile.name,
            },
            user.workspace_id
          )
        } catch (uploadError) {
          console.error("Erro no upload:", uploadError)
          toast.error("Acervo criado, mas erro ao enviar arquivo. Tente editar e anexar novamente.")
          // Não falhamos totalmente, pois o acervo foi criado
        }
      }

      toast.success("Acervo criado com sucesso!")
      navigate("/app/acervos")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar acervo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/app/acervos")
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 id="novo-acervo-title" className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Novo Acervo Técnico
        </h2>
        <p className="text-muted-foreground">
          Preencha os dados para cadastrar um novo acervo técnico
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <AcervoFormStepByStep
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
      <TutorialNovoAcervo />
    </DashboardLayout>
  )
}
