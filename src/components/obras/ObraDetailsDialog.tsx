import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Obra } from "@/types/obra"

interface ObraDetailsDialogProps {
  obra: Obra | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ObraDetailsDialog({
  obra,
  open,
  onOpenChange,
}: ObraDetailsDialogProps) {
  if (!obra) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{obra.descricao_obra}</DialogTitle>
          <DialogDescription>Detalhes da obra</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Informações Básicas</h3>
            <div className="space-y-2 text-sm">
              {obra.finalidade && (
                <div>
                  <span className="font-medium">Finalidade: </span>
                  {obra.finalidade}
                </div>
              )}
              {obra.observacoes && (
                <div>
                  <span className="font-medium">Observações: </span>
                  {obra.observacoes}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Localização</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Cidade: </span>
                {obra.cidade}
              </div>
              <div>
                <span className="font-medium">Estado: </span>
                {obra.estado}
              </div>
              {obra.endereco_obra && (
                <div>
                  <span className="font-medium">Endereço: </span>
                  {obra.endereco_obra}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Datas</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Data de Início: </span>
                {format(new Date(obra.data_inicio), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </div>
              {obra.data_conclusao && (
                <div>
                  <span className="font-medium">Data de Conclusão: </span>
                  {format(new Date(obra.data_conclusao), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </div>
              )}
            </div>
          </div>

          {obra.contratante_nome && (
            <div>
              <h3 className="font-semibold mb-2">Contratante</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Nome: </span>
                  {obra.contratante_nome}
                </div>
                {obra.contratante_tipo && (
                  <div>
                    <span className="font-medium">Tipo: </span>
                    <Badge variant="outline">{obra.contratante_tipo}</Badge>
                  </div>
                )}
                {obra.contratante_cnpj && (
                  <div>
                    <span className="font-medium">CNPJ/CPF: </span>
                    {obra.contratante_cnpj}
                  </div>
                )}
              </div>
            </div>
          )}

          {(obra.numero_contrato || obra.valor_total) && (
            <div>
              <h3 className="font-semibold mb-2">Valores e Contrato</h3>
              <div className="space-y-2 text-sm">
                {obra.numero_contrato && (
                  <div>
                    <span className="font-medium">Número do Contrato: </span>
                    {obra.numero_contrato}
                  </div>
                )}
                {obra.valor_total && (
                  <div>
                    <span className="font-medium">Valor Total: </span>
                    R$ {obra.valor_total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
