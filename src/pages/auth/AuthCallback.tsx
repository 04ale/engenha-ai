import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export function AuthCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        // O cliente do Supabase lida automaticamente com a troca do hash da URL pela sessão.
        // Apenas aguardamos um breve momento e redirecionamos para o dashboard.
        // O AuthContext irá detectar a sessão e atualizar o estado.
        const timer = setTimeout(() => {
            navigate("/app/dashboard")
        }, 1000)

        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Autenticando...</p>
            </div>
        </div>
    )
}
