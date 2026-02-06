import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { importItemsFromFile, exportItemTemplate } from "@/services/excelService"
import type { CreateItemInput } from "@/types/item"
import { toast } from "sonner"

interface ImportItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (items: CreateItemInput[]) => Promise<void>
}

export function ImportItemsDialog({
  open,
  onOpenChange,
  onImport,
}: ImportItemsDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewItems, setPreviewItems] = useState<CreateItemInput[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFile: File) => {
    setError(null)
    setPreviewItems([])
    setFile(selectedFile)

    try {
      const items = await importItemsFromFile(selectedFile)
      setPreviewItems(items)
      toast.success(`${items.length} item(ns) encontrado(s) na planilha`)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar planilha"
      setError(errorMessage)
      toast.error(errorMessage)
      setFile(null)
    }
  }

  const handleImport = async () => {
    if (previewItems.length === 0) {
      toast.error("Nenhum item para importar")
      return
    }

    setLoading(true)
    try {
      await onImport(previewItems)
      toast.success(`${previewItems.length} item(ns) importado(s) com sucesso!`)
      handleClose()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao importar itens"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreviewItems([])
    setError(null)
    onOpenChange(false)
  }

  const handleDownloadTemplate = () => {
    exportItemTemplate()
    toast.success("Modelo de planilha baixado!")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] mx-auto overflow-y-auto" onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Importar Itens via Planilha</DialogTitle>
          <DialogDescription>
            Importe múltiplos itens de uma vez usando uma planilha Excel. Baixe o
            modelo, preencha com os dados e importe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Baixar Modelo da Planilha
            </Button>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) {
                  handleFileSelect(selectedFile)
                }
              }}
              className="hidden"
            />

            {!file ? (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Selecione uma planilha Excel (.xlsx, .xls) ou CSV
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Selecionar Arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      setPreviewItems([])
                      setError(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao processar planilha</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewItems.length > 0 && (
            <div className="space-y-2">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Preview dos Itens</AlertTitle>
                <AlertDescription>
                  {previewItems.length} item(ns) será(ão) importado(s):
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Descrição</th>
                      <th className="px-3 py-2 text-left font-semibold">Unidade</th>
                      <th className="px-3 py-2 text-right font-semibold">Quantidade</th>
                      <th className="px-3 py-2 text-right font-semibold">Valor Unit.</th>
                      <th className="px-3 py-2 text-left font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewItems.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-3 py-2">{item.descricao}</td>
                        <td className="px-3 py-2">{item.unidade}</td>
                        <td className="px-3 py-2 text-right">
                          {item.quantidade.toLocaleString("pt-BR", {
                            minimumFractionDigits: 3,
                          })}
                        </td>
                        <td className="px-3 py-2 text-right">
                          R$ {item.valor_executado.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 py-2">
                          {new Date(item.data_execucao).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={loading || previewItems.length === 0}
            >
              {loading ? "Importando..." : `Importar ${previewItems.length} Item(ns)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
