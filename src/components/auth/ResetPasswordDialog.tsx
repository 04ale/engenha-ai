import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
  type ResetPasswordRequestInput,
  type ResetPasswordConfirmInput,
} from "@/lib/validations/auth"
import { authService } from "@/services/authService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [step, setStep] = useState<"request" | "confirm">("request")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const requestForm = useForm<ResetPasswordRequestInput>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  })

  const confirmForm = useForm<ResetPasswordConfirmInput>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      codigo: "",
      nova_senha: "",
      confirmar_senha: "",
    },
  })

  const handleRequestSubmit = async (data: ResetPasswordRequestInput) => {
    setIsLoading(true)
    try {
      const { error } = await authService.requestPasswordReset(data)
      if (error) {
        toast.error(error)
        return
      }
      setEmail(data.email)
      setStep("confirm")
      toast.success("Código enviado por email!")
    } catch (error) {
      toast.error("Erro ao solicitar reset de senha")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmSubmit = async (data: ResetPasswordConfirmInput) => {
    setIsLoading(true)
    try {
      // Nota: O Supabase usa link de email, não código numérico
      // Este é um fluxo simplificado para MVP
      // Em produção, o usuário deve clicar no link do email
      const { error } = await authService.confirmPasswordReset(data)
      if (error) {
        toast.error(error)
        return
      }
      toast.success("Senha redefinida com sucesso!")
      onOpenChange(false)
      setStep("request")
      requestForm.reset()
      confirmForm.reset()
    } catch (error) {
      toast.error("Erro ao redefinir senha. Verifique o link do email.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep("request")
    requestForm.reset()
    confirmForm.reset()
    setEmail("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === "request" ? "Recuperar Senha" : "Redefinir Senha"}
          </DialogTitle>
          <DialogDescription>
            {step === "request"
              ? "Digite seu email para receber o código de recuperação"
              : `Digite o código enviado para ${email}`}
          </DialogDescription>
        </DialogHeader>

        {step === "request" ? (
          <form
            onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...requestForm.register("email")}
                placeholder="joao@example.com"
              />
              {requestForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {requestForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Código
            </Button>
          </form>
        ) : (
          <>
            <Separator />
            <form
              onSubmit={confirmForm.handleSubmit(handleConfirmSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  {...confirmForm.register("codigo")}
                  placeholder="000000"
                  maxLength={6}
                />
                {confirmForm.formState.errors.codigo && (
                  <p className="text-sm text-destructive">
                    {confirmForm.formState.errors.codigo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nova_senha">Nova Senha</Label>
                <Input
                  id="nova_senha"
                  type="password"
                  {...confirmForm.register("nova_senha")}
                  placeholder="Mínimo 8 caracteres"
                />
                {confirmForm.formState.errors.nova_senha && (
                  <p className="text-sm text-destructive">
                    {confirmForm.formState.errors.nova_senha.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar_senha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmar_senha"
                  type="password"
                  {...confirmForm.register("confirmar_senha")}
                  placeholder="Digite a senha novamente"
                />
                {confirmForm.formState.errors.confirmar_senha && (
                  <p className="text-sm text-destructive">
                    {confirmForm.formState.errors.confirmar_senha.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("request")}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Redefinir Senha
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
