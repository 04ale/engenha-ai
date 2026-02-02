import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import type { Acervo } from "@/types/acervo"
import { Skeleton } from "@/components/ui/skeleton"

interface AcervosTableProps {
  acervos: Acervo[]
  loading: boolean
  onView: (acervo: Acervo) => void
  onEdit: (acervo: Acervo) => void
  onDelete: (acervo: Acervo) => void
  onViewCAT: (acervo: Acervo) => void
}

export function AcervosTable({
  acervos,
  loading,
  onView,
  onDelete,
}: AcervosTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (acervos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum acervo cadastrado.</p>
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
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Número ART</TableHead>
            <TableHead className="font-semibold">Valor Total</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acervos.map((acervo) => (
            <TableRow
              key={acervo.id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => onView(acervo)}
            >
              <TableCell className="font-medium">
                {acervo.descricao_obra}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {acervo.cidade}, {acervo.estado}
                </Badge>
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
              <TableCell>
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
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(acervo)}
                  title="Excluir acervo"
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
