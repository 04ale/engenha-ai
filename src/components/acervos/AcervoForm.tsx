import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acervoSchema, type AcervoInput } from "@/lib/validations/acervo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Acervo } from "@/types/acervo"
import type { CreateItemInput } from "@/types/item"
import { ItensTable } from "./ItensTable"
import { FileUpload } from "./FileUpload"
import { useObras } from "@/hooks/useObras"

interface AcervoFormProps {
  acervo?: Acervo
  onSubmit: (data: AcervoInput & { catFile?: File }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function AcervoForm({
  acervo,
  onSubmit,
  onCancel,
  isLoading = false,
}: AcervoFormProps) {
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
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit({
      ...data,
      itens,
      catFile: catFile || undefined,
    } as any)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Obra Relacionada</CardTitle>
          <CardDescription>Selecione a obra relacionada (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
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

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais do acervo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao_obra">Descrição da Obra *</Label>
            <Input
              id="descricao_obra"
              {...form.register("descricao_obra")}
              placeholder="Ex: Acervo Técnico - Construção de Edifício"
            />
            {form.formState.errors.descricao_obra && (
              <p className="text-sm text-destructive">
                {form.formState.errors.descricao_obra.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acervo_tipo">Tipo de Acervo *</Label>
              <Input
                id="acervo_tipo"
                {...form.register("acervo_tipo")}
                placeholder="Ex: Acervo Técnico"
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
          <CardDescription>Endereço e localização</CardDescription>
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
          <CardTitle>Informações da ART</CardTitle>
          <CardDescription>Dados da Anotação de Responsabilidade Técnica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_art">Número da ART</Label>
              <Input
                id="numero_art"
                {...form.register("numero_art")}
                placeholder="Número da ART"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_art">Tipo de ART</Label>
              <Input
                id="tipo_art"
                {...form.register("tipo_art")}
                placeholder="Tipo de ART"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_art_registro">Data de Registro</Label>
              <Input
                id="data_art_registro"
                type="date"
                {...form.register("data_art_registro")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_art_baixa">Data de Baixa</Label>
              <Input
                id="data_art_baixa"
                type="date"
                {...form.register("data_art_baixa")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload do Arquivo CAT</CardTitle>
          <CardDescription>Faça upload do arquivo CAT (PDF ou imagem)</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={(file) => setCatFile(file)}
            currentFileUrl={acervo?.arquivo_cat_url}
            currentFileName={acervo?.arquivo_cat_nome || undefined}
            onRemove={() => {
              setCatFile(null)
              form.setValue("arquivo_cat_url", "")
              form.setValue("arquivo_cat_nome", "")
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Acervo</CardTitle>
          <CardDescription>Adicione os itens que compõem este acervo</CardDescription>
        </CardHeader>
        <CardContent>
          <ItensTable
            itens={itens}
            onAdd={(item) => setItens([...itens, item])}
            onEdit={(index, item) => {
              const newItens = [...itens]
              newItens[index] = item
              setItens(newItens)
            }}
            onRemove={(index) => {
              const newItens = itens.filter((_, i) => i !== index)
              setItens(newItens)
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datas e Informações Adicionais</CardTitle>
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
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {acervo ? "Salvar Alterações" : "Criar Acervo"}
        </Button>
      </div>
    </form>
  )
}
