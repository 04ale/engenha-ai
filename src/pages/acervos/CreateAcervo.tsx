import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AcervoFormStepByStep } from "@/components/acervos/AcervoFormStepByStep"
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

      // Upload do arquivo CAT se houver
      let arquivo_cat_url = acervoData.arquivo_cat_url
      let arquivo_cat_nome = acervoData.arquivo_cat_nome

      if (catFile) {
        const { url } = await storageService.uploadCAT(
          catFile,
          user.workspace_id,
          "temp" // Será atualizado após criar o acervo
        )
        arquivo_cat_url = url
        arquivo_cat_nome = catFile.name
      }

      // Criar acervo
      const acervo = await acervoService.create(
        {
          ...acervoData,
          arquivo_cat_url,
          arquivo_cat_nome,
        },
        user.id,
        user.workspace_id,
        user.id,
        user.workspace_id
      )

      // Se houver arquivo, atualizar com o ID correto do acervo
      if (catFile && arquivo_cat_url) {
        // Re-upload com nome correto
        const { url } = await storageService.uploadCAT(
          catFile,
          user.workspace_id,
          acervo.id
        )
        await acervoService.update(
          acervo.id,
          {
            descricao_obra: acervoData.descricao_obra,
            cidade: acervoData.cidade,
            estado: acervoData.estado,
            data_inicio: acervoData.data_inicio,
            acervo_tipo: acervoData.acervo_tipo,
            arquivo_cat_url: url,
            arquivo_cat_nome: catFile.name,
          },
          user.workspace_id
        )
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
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
    </DashboardLayout>
  )
}
