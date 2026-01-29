import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { authService } from "@/services/authService"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = authService
  const navigate = useNavigate()
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      senha: "",
      confirmar_senha: "",
      crea: "",
      telefone: "",
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast.success("Conta criada com sucesso!")
      navigate("/app/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">EA</span>
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
        </div>
        <CardDescription>
          Preencha os dados para criar sua conta de engenheiro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input
              id="nome_completo"
              {...form.register("nome_completo")}
              placeholder="João Silva"
            />
            {form.formState.errors.nome_completo && (
              <p className="text-sm text-destructive">
                {form.formState.errors.nome_completo.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="crea">CREA</Label>
            <Input
              id="crea"
              {...form.register("crea")}
              placeholder="123456-D"
            />
            {form.formState.errors.crea && (
              <p className="text-sm text-destructive">
                {form.formState.errors.crea.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone (opcional)</Label>
            <Input
              id="telefone"
              {...form.register("telefone")}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              {...form.register("senha")}
              placeholder="Mínimo 8 caracteres"
            />
            {form.formState.errors.senha && (
              <p className="text-sm text-destructive">
                {form.formState.errors.senha.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmar_senha">Confirmar Senha</Label>
            <Input
              id="confirmar_senha"
              type="password"
              {...form.register("confirmar_senha")}
              placeholder="Digite a senha novamente"
            />
            {form.formState.errors.confirmar_senha && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmar_senha.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full shadow-md" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Conta
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link to="/auth/login" className="text-primary hover:underline">
              Fazer login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
