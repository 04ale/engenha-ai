import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { obraSchema, type ObraInput } from "@/lib/validations/obra"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Obra } from "@/types/obra"
import { useAuth } from "@/contexts/AuthContext"
import { obraService } from "@/services/obraService"
import { toast } from "sonner"

interface ObraFormProps {
  obra?: Obra
  onSubmit: (data: ObraInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ObraForm({ obra, onSubmit, onCancel, isLoading: externalLoading = false }: ObraFormProps) {
  const { user } = useAuth()
  const form = useForm<ObraInput>({
    resolver: zodResolver(obraSchema) as any,
    defaultValues: obra
      ? {
        descricao_obra: obra.descricao_obra,
        finalidade: obra.finalidade || "",
        observacoes: obra.observacoes || "",
        cidade: obra.cidade,
        estado: obra.estado,
        endereco_obra: obra.endereco_obra || "",
        data_inicio: obra.data_inicio,
        data_conclusao: obra.data_conclusao || "",
        contratante_nome: obra.contratante_nome || "",
        contratante_tipo: obra.contratante_tipo || undefined,
        contratante_cnpj: obra.contratante_cnpj || "",
        numero_contrato: obra.numero_contrato || "",
        valor_total: obra.valor_total || undefined,
      }
      : {
        descricao_obra: "",
        finalidade: "",
        observacoes: "",
        cidade: "",
        estado: "",
        endereco_obra: "",
        data_inicio: "",
        data_conclusao: "",
        contratante_nome: "",
        contratante_tipo: undefined,
        contratante_cnpj: "",
        numero_contrato: "",
        valor_total: undefined,
      },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!user || !user.workspace_id) {
      toast.error("Usuário não autenticado ou workspace não encontrado")
      return
    }

    try {
      if (obra) {
        await obraService.update(obra.id, data as unknown as ObraInput, user.workspace_id)
        toast.success("Obra atualizada com sucesso!")
      } else {
        await obraService.create(
          data as unknown as ObraInput,
          user.id,
          user.workspace_id,
          user.id, // Assumindo user como engenheiro para MVP
          user.workspace_id // Assumindo workspace como empresa para MVP
        )
        toast.success("Obra criada com sucesso!")
      }
      await onSubmit(data as unknown as ObraInput)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar obra")
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais da obra</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao_obra">Descrição da Obra *</Label>
            <Input
              id="descricao_obra"
              {...form.register("descricao_obra")}
              placeholder="Ex: Construção de Edifício Residencial"
            />
            {form.formState.errors.descricao_obra && (
              <p className="text-sm text-destructive">
                {form.formState.errors.descricao_obra.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalidade">Finalidade</Label>
            <Textarea
              id="finalidade"
              {...form.register("finalidade")}
              placeholder="Descreva a finalidade da obra"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...form.register("observacoes")}
              placeholder="Observações adicionais"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localização</CardTitle>
          <CardDescription>Endereço e localização da obra</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                {...form.register("cidade")}
                placeholder="São Paulo"
              />
              {form.formState.errors.cidade && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.cidade.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                {...form.register("estado")}
                placeholder="SP"
                maxLength={2}
              />
              {form.formState.errors.estado && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.estado.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco_obra">Endereço</Label>
            <Input
              id="endereco_obra"
              {...form.register("endereco_obra")}
              placeholder="Rua, número, bairro"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datas</CardTitle>
          <CardDescription>Período de execução da obra</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início *</Label>
              <Input
                id="data_inicio"
                type="date"
                {...form.register("data_inicio")}
              />
              {form.formState.errors.data_inicio && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.data_inicio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_conclusao">Data de Conclusão</Label>
              <Input
                id="data_conclusao"
                type="date"
                {...form.register("data_conclusao")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contratante</CardTitle>
          <CardDescription>Informações do contratante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contratante_nome">Nome do Contratante</Label>
            <Input
              id="contratante_nome"
              {...form.register("contratante_nome")}
              placeholder="Nome ou razão social"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contratante_tipo">Tipo</Label>
              <Select
                id="contratante_tipo"
                {...form.register("contratante_tipo")}
              >
                <option value="">Selecione</option>
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="pessoa_juridica">Pessoa Jurídica</option>
                <option value="orgao_publico">Órgão Público</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contratante_cnpj">CNPJ/CPF</Label>
              <Input
                id="contratante_cnpj"
                {...form.register("contratante_cnpj")}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valores e Contrato</CardTitle>
          <CardDescription>Informações financeiras</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_contrato">Número do Contrato</Label>
              <Input
                id="numero_contrato"
                {...form.register("numero_contrato")}
                placeholder="Número do contrato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total (R$)</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                min="0"
                {...form.register("valor_total", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {form.formState.errors.valor_total && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.valor_total.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={externalLoading || form.formState.isSubmitting}>
          {(externalLoading || form.formState.isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {obra ? "Salvar Alterações" : "Criar Obra"}
        </Button>
      </div>
    </form>
  )
}
