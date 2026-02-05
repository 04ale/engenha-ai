import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { obraService } from "@/services/obraService"
import { acervoService } from "@/services/acervoService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { ArrowLeft, Edit, Building2, MapPin, Calendar, DollarSign, FileText, Plus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Obra } from "@/types/obra"
import type { Acervo } from "@/types/acervo"

export default function ObraDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [obra, setObra] = useState<Obra | null>(null)
  const [acervos, setAcervos] = useState<Acervo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAcervos, setLoadingAcervos] = useState(true)

  useEffect(() => {
    const loadObra = async () => {
      if (!id || !user?.workspace_id) return

      try {
        setLoading(true)
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
        setLoading(false)
      }
    }

    loadObra()
  }, [id, user?.workspace_id, navigate])

  useEffect(() => {
    const loadAcervos = async () => {
      if (!id || !user?.workspace_id) return

      try {
        setLoadingAcervos(true)
        const acervosData = await acervoService.list(user.workspace_id, {
          obra_id: id,
        })
        setAcervos(acervosData)
      } catch (error) {
        console.error("Erro ao carregar acervos:", error)
      } finally {
        setLoadingAcervos(false)
      }
    }

    if (obra) {
      loadAcervos()
    }
  }, [id, obra, user?.workspace_id])

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

  if (!obra) {
    return null
  }

  const totalAcervos = acervos.reduce(
    (sum, acervo) => sum + (acervo.valor_total || 0),
    0
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/app/obras")}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {obra.descricao_obra}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">
                {obra.cidade}, {obra.estado}
              </Badge>
              {obra.numero_contrato && (
                <Badge variant="outline" className="font-mono">
                  Contrato: {obra.numero_contrato}
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={() => navigate(`/app/obras/${obra.id}/editar`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="informacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="acervos">
            Acervos Técnicos ({acervos.length})
          </TabsTrigger>
          <TabsTrigger value="contratante">Contratante</TabsTrigger>
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
                {obra.data_conclusao && (
                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="font-medium">
                      {Math.ceil(
                        (new Date(obra.data_conclusao).getTime() -
                          new Date(obra.data_inicio).getTime()) /
                        (1000 * 60 * 60 * 24)
                      )}{" "}
                      dias
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

            {obra.observacoes && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{obra.observacoes}</p>
                </CardContent>
              </Card>
            )}

            {obra.valor_total && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Valor Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    R$ {obra.valor_total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </CardContent>
              </Card>
            )}

            {obra.numero_contrato && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Contrato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium font-mono">{obra.numero_contrato}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="acervos" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Acervos Técnicos Vinculados</CardTitle>
                  <CardDescription>
                    {acervos.length > 0
                      ? `${acervos.length} acervo(s) técnico(s) vinculado(s) a esta obra`
                      : "Nenhum acervo técnico vinculado"}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/app/acervos/novo?obra_id=${obra.id}`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Acervo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAcervos ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : acervos.length > 0 ? (
                <>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Descrição</TableHead>
                          <TableHead className="font-semibold">Tipo</TableHead>
                          <TableHead className="font-semibold">Número ART</TableHead>
                          <TableHead className="font-semibold text-right">Valor Total</TableHead>
                          <TableHead className="font-semibold text-right">Data Registro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {acervos.map((acervo) => (
                          <TableRow
                            key={acervo.id}
                            className="hover:bg-muted/30 cursor-pointer transition-colors"
                            onClick={() => navigate(`/app/acervos/${acervo.id}`)}
                          >
                            <TableCell className="font-medium">
                              {acervo.descricao_obra}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{acervo.acervo_tipo}</Badge>
                            </TableCell>
                            <TableCell>
                              {acervo.numero_art ? (
                                <span className="text-sm font-mono">{acervo.numero_art}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {acervo.valor_total ? (
                                <span className="font-semibold text-primary">
                                  R$ {acervo.valor_total.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {acervo.data_art_registro ? (
                                format(new Date(acervo.data_art_registro), "dd/MM/yyyy", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {totalAcervos > 0 && (
                    <div className="mt-4 flex justify-end">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total dos Acervos</p>
                        <p className="text-xl font-bold text-primary">
                          R$ {totalAcervos.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum acervo técnico vinculado a esta obra.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate(`/app/acervos/novo?obra_id=${obra.id}`)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Acervo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratante" className="space-y-4 mt-6">
          {obra.contratante_nome ? (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Contratante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome/Razão Social</p>
                  <p className="font-medium text-lg">{obra.contratante_nome}</p>
                </div>

                {obra.contratante_cnpj ? (
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ/CPF</p>
                    <p className="font-medium font-mono">{obra.contratante_cnpj}</p>
                  </div>
                ) : <div>
                  <p className="text-sm text-muted-foreground">CNPJ/CPF</p>
                  <p className="font-medium text-lg">CNPJ não informado</p>
                </div>}

                {obra.contratante_tipo ? (
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
                ) : <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium text-lg">Tipo não informado</p>
                </div>}
                <div>
                  <p className="text-sm text-muted-foreground">Contratante Público</p>
                  <p className="font-medium text-lg">{obra.is_public ? "Sim" : "Não"}</p>
                </div>

              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma informação de contratante cadastrada</p>
                </div>
              </CardContent>
            </Card>
          )}

        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
