import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { obraSchema, type ObraInput } from "@/lib/validations/obra"
import { StepForm, type Step } from "@/components/forms/StepForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import type { Obra } from "@/types/obra"
import { useEmpresas } from "@/hooks/useEmpresas"
import { Button } from "../ui/button"
import { CreateEmpresaDialog } from "../empresas/CreateEmpresaDialog"
import type { Empresa } from "@/types/empresa"

interface ObraFormStepByStepProps {
  obra?: Obra
  onSubmit: (data: ObraInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ObraFormStepByStep({
  obra,
  onSubmit,
  onCancel,
  isLoading = false,
}: ObraFormStepByStepProps) {
  const { empresas, refetch } = useEmpresas()
  const [isCreateEmpresaOpen, setIsCreateEmpresaOpen] = useState(false)

  const form = useForm<ObraInput>({
    resolver: zodResolver(obraSchema),
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
    mode: "onChange",
  })

  const contratanteNome = form.watch("contratante_nome")

  useEffect(() => {
    if (contratanteNome) {
      const empresa = empresas.find(e => e.nome === contratanteNome)
      if (empresa) {
        form.setValue("contratante_cnpj", empresa.cnpj)
      }
    }
  }, [contratanteNome, empresas, form])

  const handleSubmit = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      await onSubmit(form.getValues())
    }
  }

  const handleEmpresaSuccess = async (empresa: Empresa) => {
    await refetch()
    form.setValue("contratante_nome", empresa.id)
  }

  const steps: Step[] = [
    {
      title: "Informações Básicas",
      description: "Dados principais da obra",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descricao_obra">
                Descrição da Obra <span className="text-destructive">*</span>
              </Label>
              <Input
                id="descricao_obra"
                {...form.register("descricao_obra")}
                placeholder="Ex: Construção de Edifício Residencial"
                className={form.formState.errors.descricao_obra ? "border-destructive" : ""}
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
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                {...form.register("observacoes")}
                placeholder="Observações adicionais"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ),
      validation: () => {
        form.trigger("descricao_obra")
        return !form.formState.errors.descricao_obra
      },
    },
    {
      title: "Localização",
      description: "Endereço e localização da obra",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">
                  Cidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cidade"
                  {...form.register("cidade")}
                  placeholder="São Paulo"
                  className={form.formState.errors.cidade ? "border-destructive" : ""}
                />
                {form.formState.errors.cidade && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.cidade.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="estado"
                  {...form.register("estado")}
                  placeholder="SP"
                  maxLength={2}
                  className={form.formState.errors.estado ? "border-destructive" : ""}
                />
                {form.formState.errors.estado && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.estado.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco_obra">Endereço Completo</Label>
              <Input
                id="endereco_obra"
                {...form.register("endereco_obra")}
                placeholder="Rua, número, bairro, complemento"
              />
            </div>
          </CardContent>
        </Card>
      ),
      validation: () => {
        form.trigger(["cidade", "estado"])
        return !form.formState.errors.cidade && !form.formState.errors.estado
      },
    },
    {
      title: "Datas",
      description: "Período de execução da obra",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">
                  Data de Início <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_inicio"
                  type="date"
                  {...form.register("data_inicio")}
                  className={form.formState.errors.data_inicio ? "border-destructive" : ""}
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
      ),
      validation: () => {
        form.trigger("data_inicio")
        return !form.formState.errors.data_inicio
      },
    },
    {
      title: "Contratante",
      description: "Informações do contratante",
      content: (
        <>
          <Card className="border-border/50 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Select {...form.register("contratante_nome")}>
                  <option value="" disabled>Selecione uma empresa</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.nome}>
                      {empresa.nome}
                    </option>
                  ))}
                </Select>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreateEmpresaOpen(true)}
                >
                  Adicionar Empresa
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </Card >
          <CreateEmpresaDialog
            open={isCreateEmpresaOpen}
            onOpenChange={setIsCreateEmpresaOpen}
            onSuccess={handleEmpresaSuccess}
          />
        </>
      ),
    },
    {
      title: "Valores e Contrato",
      description: "Informações financeiras e contratuais",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={form.formState.errors.valor_total ? "border-destructive" : ""}
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
      ),
    },
  ]

  return (
    <StepForm
      steps={steps}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={obra ? "Salvar Alterações" : "Criar Obra"}
    />
  )
}
