import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, X } from "lucide-react"
import { toast } from "sonner"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  currentFileUrl?: string | null
  currentFileName?: string | null
  onRemove?: () => void
}

export function FileUpload({
  onFileSelect,
  currentFileUrl,
  currentFileName,
  onRemove,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Arquivo muito grande. Máximo 10MB")
          return
        }
        if (!file.type.includes("pdf") && !file.type.includes("image")) {
          toast.error("Apenas arquivos PDF ou imagens são permitidos")
          return
        }
        onFileSelect(file)
        if (file.type.includes("image")) {
          const reader = new FileReader()
          reader.onload = () => setPreview(reader.result as string)
          reader.readAsDataURL(file)
        } else {
          setPreview(null)
        }
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  })

  return (
    <div className="space-y-4">
      {currentFileUrl && !preview && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5" />
                <span className="text-sm">{currentFileName || "Arquivo atual"}</span>
              </div>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain border rounded-md"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => {
              setPreview(null)
              onRemove?.()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
            isDragActive ? "bg-primary/20" : "bg-muted"
          }`}>
            <Upload className={`h-6 w-6 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <p className={`text-sm mb-2 font-medium ${
            isDragActive ? "text-primary" : "text-muted-foreground"
          }`}>
            {isDragActive
              ? "Solte o arquivo aqui"
              : "Arraste o arquivo CAT aqui ou clique para selecionar"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF ou imagem (máx. 10MB)
          </p>
        </div>
      </div>
    </div>
  )
}
