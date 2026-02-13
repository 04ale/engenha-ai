import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acervoSchema, type AcervoInput } from "@/lib/validations/acervo"
import { StepForm, type Step } from "@/components/forms/StepForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ItensTable } from "./ItensTable"
import { FileUpload } from "./FileUpload"
import { useObras } from "@/hooks/useObras"
import type { Acervo } from "@/types/acervo"
import type { CreateItemInput } from "@/types/item"
import { FileIcon, Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface AcervoFormStepByStepProps {
  acervo?: Acervo
  onSubmit: (data: AcervoInput & { catFile?: File }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function AcervoFormStepByStep({
  acervo,
  onSubmit,
  onCancel,
  isLoading = false,
}: AcervoFormStepByStepProps) {
  const [itens, setItens] = useState<CreateItemInput[]>(
    acervo?.itens?.map((item) => ({
      descricao: item.descricao,
      unidade: item.unidade,
      quantidade: item.quantidade,
      valor_executado: item.valor_executado,
      data_execucao: item.data_execucao,
    })) || []
  )
  const [catFile, setCatFile] = useState<File | null>(null)
  const { obras } = useObras()

  const form = useForm<AcervoInput>({
    resolver: zodResolver(acervoSchema) as Resolver<AcervoInput>,
    defaultValues: acervo
      ? {
        obra_id: acervo.obra_id || "",
        descricao_obra: acervo.descricao_obra,
        finalidade: acervo.finalidade || "",
        observacoes: acervo.observacoes || "",
        cidade: acervo.cidade,
        estado: acervo.estado,
        endereco_obra: acervo.endereco_obra || "",
        data_inicio: acervo.data_inicio,
        data_conclusao: acervo.data_conclusao || "",
        contratante_nome: acervo.contratante_nome || "",
        contratante_tipo: acervo.contratante_tipo || undefined,
        contratante_cnpj: acervo.contratante_cnpj || "",
        numero_contrato: acervo.numero_contrato || "",
        valor_total: acervo.valor_total || undefined,
        numero_art: acervo.numero_art || "",
        tipo_art: acervo.tipo_art || "",
        data_art_registro: acervo.data_art_registro || "",
        data_art_baixa: acervo.data_art_baixa || "",
        acervo_tipo: acervo.acervo_tipo,
        nome_fantasia: acervo.nome_fantasia || "",
        arquivo_cat_url: acervo.arquivo_cat_url || "",
        arquivo_cat_nome: acervo.arquivo_cat_nome || "",
      }
      : {
        obra_id: "",
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
        numero_art: "",
        tipo_art: "",
        data_art_registro: "",
        data_art_baixa: "",
        acervo_tipo: "",
        nome_fantasia: "",
        arquivo_cat_url: "",
        arquivo_cat_nome: "",
      },
    mode: "onChange",
  })

  const handleSubmit = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      try {
        await onSubmit({
          ...form.getValues(),
          itens,
          catFile: catFile || undefined,
        } as any)
      } catch (error) {
        console.error("Erro ao salvar acervo:", error)
        toast.error("Erro ao salvar acervo", {
          description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Tente novamente."
        })
      }
    } else {
      const errors = form.formState.errors

      console.error("Erro de validação:", errors)
      toast.error("Erro de validação", {
        description: (
          <div className="flex flex-col gap-1">
            <p>Por favor, corrija os seguintes erros:</p>
            <ul className="list-disc list-inside">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>{error?.message as string}</li>
              ))}
            </ul>
          </div>
        )
      })
    }
  }

  const steps: Step[] = [
    {
      title: "Obra Relacionada",
      description: "Selecione a obra relacionada (opcional)",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="obra_id">Obra</Label>
              <Select
                id="obra_id"
                {...form.register("obra_id")}
              >
                <option value="">Nenhuma obra selecionada</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.descricao_obra} - {obra.cidade}/{obra.estado}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      title: "Informações Básicas",
      description: "Dados principais do acervo técnico",
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
                placeholder="Ex: Acervo Técnico - Construção de Edifício"
                className={form.formState.errors.descricao_obra ? "border-destructive" : ""}
              />
              {form.formState.errors.descricao_obra && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.descricao_obra.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acervo_tipo">
                  Tipo de Acervo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="acervo_tipo"
                  {...form.register("acervo_tipo")}
                  placeholder="Ex: Acervo Técnico Estrutural"
                  className={form.formState.errors.acervo_tipo ? "border-destructive" : ""}
                />
                {form.formState.errors.acervo_tipo && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.acervo_tipo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  {...form.register("nome_fantasia")}
                  placeholder="Nome fantasia (opcional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalidade">Finalidade</Label>
              <Textarea
                id="finalidade"
                {...form.register("finalidade")}
                placeholder="Descreva a finalidade do acervo"
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
      validation: async () => {
        return await form.trigger(["descricao_obra", "acervo_tipo"])
      },
    },
    {
      title: "Localização",
      description: "Endereço e localização",
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
                placeholder="Rua, número, bairro"
              />
            </div>
          </CardContent>
        </Card>
      ),
      validation: async () => {
        return await form.trigger(["cidade", "estado"])
      },
    },
    {
      title: "Informações da ART",
      description: "Dados da Anotação de Responsabilidade Técnica",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero_art">
                  Número da ART <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numero_art"
                  {...form.register("numero_art")}
                  placeholder="Número da ART"
                  className={form.formState.errors.numero_art ? "border-destructive" : ""}
                />
                {form.formState.errors.numero_art && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.numero_art.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_art">
                  Tipo de ART <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tipo_art"
                  {...form.register("tipo_art")}
                  placeholder="Tipo de ART"
                  className={form.formState.errors.tipo_art ? "border-destructive" : ""}
                />
                {form.formState.errors.tipo_art && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.tipo_art.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_art_registro">
                  Data de Registro <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_art_registro"
                  type="date"
                  {...form.register("data_art_registro")}
                  className={form.formState.errors.data_art_registro ? "border-destructive" : ""}
                />
                {form.formState.errors.data_art_registro && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.data_art_registro.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_art_baixa">
                  Data de Baixa <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_art_baixa"
                  type="date"
                  {...form.register("data_art_baixa")}
                  className={form.formState.errors.data_art_baixa ? "border-destructive" : ""}
                />
                {form.formState.errors.data_art_baixa && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.data_art_baixa.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      validation: async () => {
        return await form.trigger(["numero_art", "tipo_art", "data_art_registro", "data_art_baixa"])
      },
    },
    {
      title: "Upload do Arquivo CAT",
      description: "Faça upload do arquivo CAT (PDF ou imagem)",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <FileUpload
              onFileSelect={(file) => {
                setCatFile(file)
                toast.success(`Arquivo ${file.name} selecionado com sucesso`)
              }}
              currentFileUrl={acervo?.arquivo_cat_url}
              currentFileName={acervo?.arquivo_cat_nome || undefined}
              onRemove={() => {
                setCatFile(null)
                form.setValue("arquivo_cat_url", "")
                form.setValue("arquivo_cat_nome", "")
              }}
            />
          </CardContent>
          {catFile && (
            <div className="mx-6 mb-6 p-4 bg-muted/30 border rounded-lg flex items-center justify-between group hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{catFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(catFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => {
                  setCatFile(null)
                  form.setValue("arquivo_cat_url", "")
                  form.setValue("arquivo_cat_nome", "")
                  toast.success("Arquivo removido com sucesso")
                }}
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Remover arquivo</span>
              </Button>
            </div>
          )}
        </Card>
      ),
    },
    {
      title: "Itens do Acervo",
      description: "Adicione os itens que compõem este acervo",
      content: (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <ItensTable
              itens={itens}
              onAdd={(item) => {
                setItens([...itens, item])
                toast.success("Item adicionado com sucesso")
              }}
              onEdit={(index, item) => {
                const newItens = [...itens]
                newItens[index] = item
                setItens(newItens)
                toast.success("Item atualizado com sucesso")
              }}
              onRemove={(index) => {
                const newItens = itens.filter((_, i) => i !== index)
                setItens(newItens)
                toast.success("Item removido com sucesso")
              }}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      title: "Datas e Informações Adicionais",
      description: "Período de execução e informações complementares",
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
                <Label htmlFor="data_conclusao">
                  Data de Conclusão <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_conclusao"
                  type="date"
                  {...form.register("data_conclusao")}
                  className={form.formState.errors.data_conclusao ? "border-destructive" : ""}
                />
                {form.formState.errors.data_conclusao && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.data_conclusao.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contratante_nome">
                Nome do Contratante <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contratante_nome"
                {...form.register("contratante_nome")}
                placeholder="Nome ou razão social"
                className={form.formState.errors.contratante_nome ? "border-destructive" : ""}
              />
              {form.formState.errors.contratante_nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.contratante_nome.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contratante_tipo">
                  Tipo <span className="text-destructive">*</span>
                </Label>
                <Select
                  id="contratante_tipo"
                  {...form.register("contratante_tipo")}
                  className={form.formState.errors.contratante_tipo ? "border-destructive" : ""}
                >
                  <option value="">Selecione</option>
                  <option value="pessoa_fisica">Pessoa Física</option>
                  <option value="pessoa_juridica">Pessoa Jurídica</option>
                  <option value="orgao_publico">Órgão Público</option>
                </Select>
                {form.formState.errors.contratante_tipo && (
                  <p className="text-sm text-destructive">
                    Insira um tipo de contratante
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contratante_cnpj">
                  CNPJ/CPF <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contratante_cnpj"
                  {...form.register("contratante_cnpj")}
                  placeholder="00.000.000/0000-00"
                  className={form.formState.errors.contratante_cnpj ? "border-destructive" : ""}
                />
                {form.formState.errors.contratante_cnpj && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contratante_cnpj.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero_contrato">
                  Número do Contrato <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numero_contrato"
                  {...form.register("numero_contrato")}
                  placeholder="Número do contrato"
                  className={form.formState.errors.numero_contrato ? "border-destructive" : ""}
                />
                {form.formState.errors.numero_contrato && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.numero_contrato.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_total">
                  Valor Total (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="valor_total"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register("valor_total")}
                  placeholder="0.00"
                  className={form.formState.errors.valor_total ? "border-destructive" : ""}
                />
                {form.formState.errors.valor_total && (
                  <p className="text-sm text-destructive">
                    Insira um valor maior ou igual a zero
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
      validation: async () => {
        return await form.trigger([
          "data_inicio",
          "data_conclusao",
          "contratante_nome",
          "contratante_tipo",
          "contratante_cnpj",
          "numero_contrato",
          "valor_total"
        ])
      },
    },
  ]

  return (
    <StepForm
      steps={steps}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={acervo ? "Salvar Alterações" : "Criar Acervo"}
    />
  )
}
