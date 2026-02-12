import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

export default function PaymentReturnPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")

    useEffect(() => {
        if (!success && !canceled) {
            navigate("/app/dashboard")
        }
    }, [success, canceled, navigate])

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border bg-card shadow-sm">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-20 w-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Pagamento Confirmado!</h1>
                    <p className="text-muted-foreground">
                        Sua assinatura foi ativada com sucesso. Aproveite todos os recursos do seu novo plano.
                    </p>
                    <div className="pt-4">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => navigate("/app/dashboard")}
                        >
                            Ir para o Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (canceled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border bg-card shadow-sm">
                    <div className="flex justify-center">
                        <XCircle className="h-20 w-20 text-destructive" />
                    </div>
                    <h1 className="text-3xl font-bold">Pagamento Cancelado</h1>
                    <p className="text-muted-foreground">
                        O processo de assinatura foi cancelado. Se houve algum erro, por favor tente novamente ou entre em contato com o suporte.
                    </p>
                    <div className="pt-4 space-y-3">
                        <Button
                            className="w-full"
                            variant="default"
                            size="lg"
                            onClick={() => navigate("/planos")}
                        >
                            Tentar Novamente
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => navigate("/app/dashboard")}
                        >
                            Voltar para o Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
