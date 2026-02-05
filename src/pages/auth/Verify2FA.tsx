
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ShieldCheck } from "lucide-react"
import { authService } from "@/services/authService"
import { useAuth } from "@/contexts/AuthContext"

export function Verify2FAPage() {
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { refreshUser } = useAuth()
    const [factorId, setFactorId] = useState<string | null>(null)

    useEffect(() => {
        // Check if we need 2FA. Ideally this page is hit only if needed.
        // We need to find the factor ID to challenge.
        const initFactor = async () => {
            const { data, error } = await authService.mfaListFactors()
            if (error || !data || !data.totp || data.totp.length === 0) {
                // If no factors or error, check if we really should be here.
                console.error("No factors found or error", error)
            } else {
                // Use the first verified TOTP factor
                const verifiedFactor = data.totp.find((f: any) => f.status === 'verified')
                if (verifiedFactor) {
                    setFactorId(verifiedFactor.id)
                }
            }
        }
        initFactor()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!factorId || code.length < 6) return

        setIsLoading(true)
        try {
            const { error } = await authService.mfaChallengeAndVerify(factorId, code)
            if (error) throw new Error(error)

            // Success! Upgrade to AAL2 complete.
            await refreshUser()
            navigate("/app/dashboard")
        } catch (error: any) {
            toast.error(error.message || "Código incorreto")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-muted/40">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 pb-4 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Autenticação de Dois Fatores</CardTitle>
                    <CardDescription>
                        Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="code" className="sr-only">Código 2FA</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="000 000"
                                className="text-center text-2xl tracking-widest h-14"
                                maxLength={6}
                                autoFocus
                                autoComplete="one-time-code"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={isLoading || code.length < 6 || !factorId}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verificar
                        </Button>

                        <div className="text-center">
                            <Button variant="link" size="sm" type="button" onClick={() => navigate("/auth/login")}>
                                Voltar para Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
