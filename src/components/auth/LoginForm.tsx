import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { ResetPasswordDialog } from "./ResetPasswordDialog"
import { useAuth } from "@/contexts/AuthContext"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
      lembrar_me: false,
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      await login(data.email, data.senha)
      toast.success("Login realizado com sucesso!")
      navigate("/app/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">EA</span>
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
          </div>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="joao@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                {...form.register("senha")}
                placeholder="Digite sua senha"
              />
              {form.formState.errors.senha && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.senha.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lembrar_me"
                  {...form.register("lembrar_me")}
                />
                <Label htmlFor="lembrar_me" className="cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setShowResetDialog(true)}
                className="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" className="w-full shadow-md" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link to="/auth/register" className="text-primary hover:underline">
                Criar conta
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
      />
    </>
  )
}
