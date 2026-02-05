import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, FileText, DollarSign } from "lucide-react"

interface MetricCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  type: "obras" | "acervos" | "cats" | "valor"
  data?: any[]
  loading?: boolean
}

export function MetricCardDialog({
  open,
  onOpenChange,
  title,
  type,
  data = [],
  loading = false,
}: MetricCardDialogProps) {
  const navigate = useNavigate()

  const handleViewAll = () => {
    if (type === "obras") {
      navigate("/app/obras")
    } else if (type === "acervos" || type === "cats") {
      navigate("/app/acervos")
    }
    onOpenChange(false)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            {type === "obras" ? (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            ) : (
              <FileText className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <p className="text-lg font-medium mb-2">Nenhum item encontrado</p>
          <p className="text-sm text-muted-foreground mb-6">
            {type === "obras" && "Não há obras cadastradas ainda."}
            {type === "acervos" && "Não há acervos técnicos cadastrados ainda."}
            {type === "cats" && "Nenhum acervo possui CAT registrado."}
            {type === "valor" && "Não há valores para exibir."}
          </p>
          <Button onClick={handleViewAll} variant="outline">
            {type === "obras" ? "Cadastrar Primeira Obra" : "Cadastrar Primeiro Acervo"}
          </Button>
        </div>
      )
    }

    if (type === "obras") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.length} {data.length === 1 ? "obra encontrada" : "obras encontradas"}
            </p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-sm py-4 px-6">Descrição</TableHead>
                    <TableHead className="font-semibold text-sm py-4 px-6">Localização</TableHead>
                    <TableHead className="font-semibold text-sm py-4 px-6">Data Início</TableHead>
                    <TableHead className="font-semibold text-sm text-right py-4 px-6">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((obra: any) => (
                    <TableRow
                      key={obra.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50"
                      onClick={() => {
                        navigate(`/app/obras/${obra.id}`)
                        onOpenChange(false)
                      }}
                    >
                      <TableCell className="font-medium py-4 px-6">{obra.descricao_obra}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="outline" className="text-xs">
                          {obra.cidade}, {obra.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-sm">
                        {format(new Date(obra.data_inicio), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        {obra.valor_total ? (
                          <span className="font-semibold text-primary">
                            R$ {obra.valor_total.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-end border-t pt-4">
            <Button variant="outline" onClick={handleViewAll}>
              Ver Todas <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    }

    if (type === "acervos" || type === "cats") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.length} {data.length === 1 ? "acervo encontrado" : "acervos encontrados"}
            </p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-sm py-4 px-6">Descrição</TableHead>
                    <TableHead className="font-semibold text-sm py-4 px-6">Tipo</TableHead>
                    <TableHead className="font-semibold text-sm py-4 px-6">ART</TableHead>
                    <TableHead className="font-semibold text-sm text-right py-4 px-6">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((acervo: any) => (
                    <TableRow
                      key={acervo.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50"
                      onClick={() => {
                        navigate(`/app/acervos/${acervo.id}`)
                        onOpenChange(false)
                      }}
                    >
                      <TableCell className="font-medium py-4 px-6">{acervo.descricao_obra}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="secondary" className="text-xs">{acervo.acervo_tipo}</Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {acervo.numero_art ? (
                          <span className="text-sm font-mono">{acervo.numero_art}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        {acervo.valor_total ? (
                          <span className="font-semibold text-primary">
                            R$ {acervo.valor_total.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-end border-t pt-4">
            <Button variant="outline" onClick={handleViewAll}>
              Ver Todos <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    }

    if (type === "valor") {
      const valorTotal = data[0]?.valorTotal || 0
      const acervosList = data.slice(1)

      return (
        <div className="space-y-6">
          <div className="text-center py-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center mb-3">
              <DollarSign className="h-8 w-8 text-primary mr-2" />
            </div>
            <p className="text-4xl font-bold text-primary mb-2">
              R$ {valorTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              Valor total executado em todos os acervos técnicos
            </p>
          </div>
          {acervosList.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {acervosList.length} {acervosList.length === 1 ? "acervo" : "acervos"} com valor registrado
                </p>
              </div>
              <div className="rounded-lg border border-border overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-sm py-4 px-6">Acervo</TableHead>
                        <TableHead className="font-semibold text-sm text-right py-4 px-6">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {acervosList.slice(0, 15).map((item: any) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50"
                          onClick={() => {
                            navigate(`/app/acervos/${item.id}`)
                            onOpenChange(false)
                          }}
                        >
                          <TableCell className="font-medium py-4 px-6">{item.descricao_obra}</TableCell>
                          <TableCell className="text-right font-semibold text-primary py-4 px-6">
                            R$ {item.valor_total?.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            }) || "0,00"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {acervosList.length > 15 && (
                <p className="text-xs text-center text-muted-foreground">
                  Mostrando 15 de {acervosList.length} acervos
                </p>
              )}
              <div className="flex justify-end border-t pt-4">
                <Button variant="outline" onClick={() => {
                  navigate("/app/acervos")
                  onOpenChange(false)
                }}>
                  Ver Todos os Acervos <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col mx-auto"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {type === "obras" && "Lista completa de todas as obras cadastradas"}
            {type === "acervos" && "Lista completa de todos os acervos técnicos"}
            {type === "cats" && "Lista de acervos com CAT registrado"}
            {type === "valor" && "Detalhamento do valor total executado"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
