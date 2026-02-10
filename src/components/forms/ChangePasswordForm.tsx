
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/auth"
import { authService } from "@/services/authService"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

function ChangePasswordForm({ onSuccess, onCancel, onMfaRequired }: { onSuccess: () => void, onCancel: () => void, onMfaRequired: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            nova_senha: "",
            confirmar_senha: "",
        },
    })

    const onSubmit = async (data: ChangePasswordInput) => {
        setIsLoading(true)
        try {
            const { error } = await authService.updatePassword(data.nova_senha)

            if (error) {
                // Check for AAL2 error
                if (error.includes("AAL2") || error.includes("aal2")) {
                    toast.info("Verificação de dois fatores necessária.")
                    onMfaRequired()
                    return
                }
                toast.error(error)
                return
            }

            toast.success("Senha alterada com sucesso!")
            onSuccess()
        } catch (error) {
            toast.error("Erro ao alterar senha.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nova_senha">Nova Senha</Label>
                <div className="relative">
                    <Input
                        id="nova_senha"
                        type={showPassword ? "text" : "password"}
                        {...form.register("nova_senha")}
                        placeholder="Mínimo 8 caracteres"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                {form.formState.errors.nova_senha && (
                    <p className="text-sm text-destructive">{form.formState.errors.nova_senha.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmar_senha">Confirmar Nova Senha</Label>
                <div className="relative">
                    <Input
                        id="confirmar_senha"
                        type={showConfirmPassword ? "text" : "password"}
                        {...form.register("confirmar_senha")}
                        placeholder="Repita a senha"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                {form.formState.errors.confirmar_senha && (
                    <p className="text-sm text-destructive">{form.formState.errors.confirmar_senha.message}</p>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Alterar Senha
                </Button>
            </div>
        </form>
    )
}

export default ChangePasswordForm