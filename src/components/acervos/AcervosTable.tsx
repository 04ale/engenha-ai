import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
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
  onEdit,
  onDelete,
  onViewCAT,
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
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  }
                >
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(acervo)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar Detalhes
                    </DropdownMenuItem>
                    {acervo.arquivo_cat_url && (
                      <DropdownMenuItem onClick={() => onViewCAT(acervo)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Ver CAT
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(acervo)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(acervo)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
