import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { CreateItemInput } from "@/types/item"
import { ItemFormDialog } from "./ItemFormDialog"
import { useState } from "react"

interface ItensTableProps {
  itens: CreateItemInput[]
  onAdd: (item: CreateItemInput) => void
  onEdit: (index: number, item: CreateItemInput) => void
  onRemove: (index: number) => void
}

export function ItensTable({
  itens,
  onAdd,
  onEdit,
  onRemove,
}: ItensTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const total = itens.reduce(
    (sum, item) => sum + item.quantidade * item.valor_executado,
    0
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Itens do Acervo</h3>
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      {itens.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum item cadastrado.</p>
          <Button
            variant="outline"
            onClick={() => setShowAddDialog(true)}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Item
          </Button>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Data Execução</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.categoria || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {item.descricao}
                  </TableCell>
                  <TableCell>{item.unidade}</TableCell>
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
                  <TableCell className="text-right font-medium">
                    R$ {(item.quantidade * item.valor_executado).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {format(new Date(item.data_execucao), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingIndex(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end">
            <div className="text-lg font-semibold">
              Total: R$ {total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </>
      )}

      <ItemFormDialog
        open={showAddDialog || editingIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false)
            setEditingIndex(null)
          }
        }}
        item={editingIndex !== null ? itens[editingIndex] : undefined}
        onSubmit={(item) => {
          if (editingIndex !== null) {
            onEdit(editingIndex, item)
            setEditingIndex(null)
          } else {
            onAdd(item)
            setShowAddDialog(false)
          }
        }}
      />
    </div>
  )
}
