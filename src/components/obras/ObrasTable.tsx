import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Obra } from "@/types/obra"
import { Skeleton } from "@/components/ui/skeleton"

interface ObrasTableProps {
  obras: Obra[]
  loading: boolean
  onView: (obra: Obra) => void
  onDelete: (obra: Obra) => void
}

export function ObrasTable({
  obras,
  loading,
  onView,
  onDelete,
}: ObrasTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (obras.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma obra cadastrada.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Descrição</TableHead>
            <TableHead className="font-semibold">Cidade/Estado</TableHead>
            <TableHead className="font-semibold">Data Início</TableHead>
            <TableHead className="font-semibold">Valor Total</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obras.map((obra) => (
            <TableRow
              key={obra.id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => onView(obra)}
            >
              <TableCell className="font-medium">
                {obra.descricao_obra}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {obra.cidade}, {obra.estado}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(obra.data_inicio), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                {obra.valor_total ? (
                  <span className="font-semibold text-primary">
                    R$ {obra.valor_total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(obra)}
                  title="Excluir obra"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
