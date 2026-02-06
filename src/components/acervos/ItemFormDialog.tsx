import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { itemSchema, type ItemInput } from "@/lib/validations/item"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ItemFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: ItemInput
  onSubmit: (item: ItemInput) => void
}

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: ItemFormDialogProps) {
  const form = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: item || {
      descricao: "",
      unidade: "",
      quantidade: 0,
      valor_executado: 0,
      data_execucao: "",
      categoria: "",
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
    form.reset()
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar Item" : "Adicionar Item"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do item do acervo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              {...form.register("categoria")}
              placeholder="Ex: Serviços Preliminares"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              {...form.register("descricao")}
              placeholder="Ex: Concreto estrutural"
            />
            {form.formState.errors.descricao && (
              <p className="text-sm text-destructive">
                {form.formState.errors.descricao.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade *</Label>
              <Input
                id="unidade"
                {...form.register("unidade")}
                placeholder="Ex: m³"
              />
              {form.formState.errors.unidade && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.unidade.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.001"
                min="0"
                {...form.register("quantidade", { valueAsNumber: true })}
                placeholder="0.000"
              />
              {form.formState.errors.quantidade && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.quantidade.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_executado">Valor Unitário (R$) *</Label>
              <Input
                id="valor_executado"
                type="number"
                step="0.01"
                min="0"
                {...form.register("valor_executado", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {form.formState.errors.valor_executado && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.valor_executado.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_execucao">Data de Execução *</Label>
              <Input
                id="data_execucao"
                type="date"
                {...form.register("data_execucao")}
              />
              {form.formState.errors.data_execucao && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.data_execucao.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {item ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
