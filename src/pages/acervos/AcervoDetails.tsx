import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { acervoService } from "@/services/acervoService"
import { storageService } from "@/services/storageService"
import { exportItemsToExcel } from "@/services/excelService"
import { ImportItemsDialog } from "@/components/acervos/ImportItemsDialog"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { ArrowLeft, Edit, FileText, Download, Building2, MapPin, Calendar, DollarSign, FileCheck, Upload, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Acervo } from "@/types/acervo"
import type { CreateItemInput } from "@/types/item"
import { obraService } from "@/services/obraService"
import type { Obra } from "@/types/obra"

export default function AcervoDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [acervo, setAcervo] = useState<Acervo | null>(null)
  const [obra, setObra] = useState<Obra | null>(null)
  const [loading, setLoading] = useState(true)
  const [showImportDialog, setShowImportDialog] = useState(false)

  useEffect(() => {
    const loadAcervo = async () => {
      if (!id || !user?.workspace_id) return

      try {
        setLoading(true)
        const acervoData = await acervoService.getById(id, user.workspace_id)
        if (!acervoData) {
          toast.error("Acervo não encontrado")
          navigate("/app/acervos")
          return
        }
        setAcervo(acervoData)

        if (acervoData.obra_id) {
          const obraData = await obraService.getById(acervoData.obra_id, user.workspace_id)
          setObra(obraData)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao carregar acervo")
        navigate("/app/acervos")
      } finally {
        setLoading(false)
      }
    }

    loadAcervo()
  }, [id, user?.workspace_id, navigate])

  const handleViewCAT = async () => {
    if (!acervo?.arquivo_cat_url) {
      toast.info("Este acervo não possui arquivo CAT anexado")
      return
    }

    try {
      if (acervo.arquivo_cat_url.startsWith("blob:") || acervo.arquivo_cat_url.startsWith("https://example.com")) {
        toast.info(`Arquivo CAT: ${acervo.arquivo_cat_nome || "CAT.pdf"}\n\nEm produção, este arquivo seria aberto para visualização.`)
        return
      }

      if (acervo.arquivo_cat_url.startsWith("http")) {
        window.open(acervo.arquivo_cat_url, "_blank")
        return
      }

      const signedUrl = await storageService.getSignedUrl(acervo.arquivo_cat_url)
      window.open(signedUrl, "_blank")
    } catch (error) {
      toast.error("Erro ao abrir arquivo CAT")
    }
  }

  const totalItens = acervo?.itens?.reduce(
    (sum, item) => sum + item.quantidade * item.valor_executado,
    0
  ) || 0

  const handleImportItems = async (items: CreateItemInput[]) => {
    if (!id || !user?.workspace_id) return

    try {
      const updatedAcervo = await acervoService.addItems(id, items, user.workspace_id)
      setAcervo(updatedAcervo)
      toast.success(`${items.length} item(ns) adicionado(s) com sucesso!`)
    } catch (error) {
      throw error
    }
  }

  const handleExportItems = () => {
    if (!acervo?.itens || acervo.itens.length === 0) {
      toast.info("Não há itens para exportar")
      return
    }

    const itemsToExport: CreateItemInput[] = acervo.itens.map((item) => ({
      descricao: item.descricao,
      categoria: item.categoria,
      unidade: item.unidade,
      quantidade: item.quantidade,
      valor_executado: item.valor_executado,
      data_execucao: item.data_execucao,
    }))

    exportItemsToExcel(itemsToExport)
    toast.success("Planilha exportada com sucesso!")
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
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
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app/acervos")}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {acervo.descricao_obra}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{acervo.acervo_tipo}</Badge>
              <Badge variant="outline">
                {acervo.cidade}, {acervo.estado}
              </Badge>
              {acervo.numero_art && (
                <Badge variant="outline" className="font-mono">
                  ART: {acervo.numero_art}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {acervo.arquivo_cat_url && (
              <Button variant="outline" onClick={handleViewCAT}>
                <FileText className="h-4 w-4 mr-2" />
                Ver CAT
              </Button>
            )}
            <Button onClick={() => navigate(`/app/acervos/${acervo.id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="informacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="art">ART</TabsTrigger>
          <TabsTrigger value="itens">Itens</TabsTrigger>
          <TabsTrigger value="obra">Obra Relacionada</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-medium">{acervo.cidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{acervo.estado}</p>
                </div>
                {acervo.endereco_obra && (
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">{acervo.endereco_obra}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Datas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Início</p>
                  <p className="font-medium">
                    {format(new Date(acervo.data_inicio), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                {acervo.data_conclusao && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Conclusão</p>
                    <p className="font-medium">
                      {format(new Date(acervo.data_conclusao), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {acervo.finalidade && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Finalidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{acervo.finalidade}</p>
                </CardContent>
              </Card>
            )}

            {acervo.observacoes && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{acervo.observacoes}</p>
                </CardContent>
              </Card>
            )}

            {acervo.contratante_nome && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Contratante</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{acervo.contratante_nome}</p>
                  </div>
                  {acervo.contratante_tipo && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <Badge variant="outline">{acervo.contratante_tipo}</Badge>
                    </div>
                  )}
                  {acervo.contratante_cnpj && (
                    <div>
                      <p className="text-sm text-muted-foreground">CNPJ/CPF</p>
                      <p className="font-medium font-mono">{acervo.contratante_cnpj}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(acervo.numero_contrato || acervo.valor_total) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Valores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {acervo.numero_contrato && (
                    <div>
                      <p className="text-sm text-muted-foreground">Número do Contrato</p>
                      <p className="font-medium">{acervo.numero_contrato}</p>
                    </div>
                  )}
                  {acervo.valor_total && (
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="font-bold text-lg text-primary">
                        R$ {acervo.valor_total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="art" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Informações da ART
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {acervo.numero_art ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Número da ART</p>
                      <p className="font-medium font-mono text-lg">{acervo.numero_art}</p>
                    </div>
                    {acervo.tipo_art && (
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo de ART</p>
                        <p className="font-medium">{acervo.tipo_art}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {acervo.data_art_registro && (
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Registro</p>
                        <p className="font-medium">
                          {format(new Date(acervo.data_art_registro), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    )}
                    {acervo.data_art_baixa && (
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Baixa</p>
                        <p className="font-medium">
                          {format(new Date(acervo.data_art_baixa), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {acervo.arquivo_cat_url && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Arquivo CAT</p>
                      <Button variant="outline" onClick={handleViewCAT} className="w-full md:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        {acervo.arquivo_cat_nome || "Baixar CAT"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma informação de ART cadastrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itens" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Itens do Acervo</CardTitle>
                  <CardDescription>
                    {acervo.itens && acervo.itens.length > 0
                      ? `${acervo.itens.length} item(ns) cadastrado(s)`
                      : "Nenhum item cadastrado"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {acervo.itens && acervo.itens.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportItems}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setShowImportDialog(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Planilha
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {acervo.itens && acervo.itens.length > 0 ? (
                <>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Descrição</TableHead>
                          <TableHead className="font-semibold">Categoria</TableHead>
                          <TableHead className="font-semibold">Unidade</TableHead>
                          <TableHead className="font-semibold text-right">Quantidade</TableHead>
                          <TableHead className="font-semibold text-right">Valor Unit.</TableHead>
                          <TableHead className="font-semibold text-right">Total</TableHead>
                          <TableHead className="font-semibold text-right">Data Execução</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {acervo.itens.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{item.descricao}</TableCell>
                            <TableCell>{item.categoria || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.unidade}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantidade.toLocaleString("pt-BR", {
                                minimumFractionDigits: 3,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {item.valor_executado.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-primary">
                              R$ {(item.quantidade * item.valor_executado).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {format(new Date(item.data_execucao), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total Geral</p>
                      <p className="text-2xl font-bold text-primary">
                        R$ {totalItens.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum item cadastrado para este acervo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <ImportItemsDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          onImport={handleImportItems}
        />

        <TabsContent value="obra" className="space-y-4 mt-6">
          {obra ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização da Obra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Cidade</p>
                    <p className="font-medium">{obra.cidade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="font-medium">{obra.estado}</p>
                  </div>
                  {obra.endereco_obra && (
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium">{obra.endereco_obra}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Datas da Obra
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/app/obras/${acervo.obra_id}`)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Ver Obra Relacionada
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Início</p>
                    <p className="font-medium">
                      {format(new Date(obra.data_inicio), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  {obra.data_conclusao && (
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Conclusão</p>
                      <p className="font-medium">
                        {format(new Date(obra.data_conclusao), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>

              </Card>

              {obra.finalidade && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Finalidade</CardTitle>
                  </CardHeader>
                  <CardContent>

                    <p className="text-sm">{obra.finalidade}</p>
                  </CardContent>
                </Card>
              )}

              {obra.contratante_nome && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Contratante da Obra</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{obra.contratante_nome}</p>
                    </div>
                    {obra.contratante_tipo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo</p>
                        <Badge variant="outline">
                          {obra.contratante_tipo === "pessoa_fisica"
                            ? "Pessoa Física"
                            : obra.contratante_tipo === "pessoa_juridica"
                              ? "Pessoa Jurídica"
                              : "Órgão Público"}
                        </Badge>
                      </div>
                    )}
                    {obra.contratante_cnpj && (
                      <div>
                        <p className="text-sm text-muted-foreground">CNPJ/CPF</p>
                        <p className="font-medium font-mono">{obra.contratante_cnpj}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}


              {(obra.numero_contrato || obra.valor_total) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Valores da Obra
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {obra.numero_contrato && (
                      <div>
                        <p className="text-sm text-muted-foreground">Número do Contrato</p>
                        <p className="font-medium">{obra.numero_contrato}</p>
                      </div>
                    )}
                    {obra.valor_total && (
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total</p>
                        <p className="font-bold text-lg text-primary">
                          R$ {obra.valor_total.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Este acervo não está vinculado a nenhuma obra</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
