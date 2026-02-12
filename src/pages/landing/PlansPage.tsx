import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import LandingFooter from "@/components/landing/LandingFooter"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { checkout } from "@/services/stripe"
import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { plansService, type Plan } from "@/services/plansService"
import { Check, X } from "lucide-react"


export default function PlansPage() {
    const { isAuthenticated } = useAuth()
    const nav = useNavigate()
    const [loading, setLoading] = useState(false)
    const [plans, setPlans] = useState<Plan[]>([])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await plansService.getPlans()
                setPlans(data)
            } catch (error) {
                toast.error("Erro ao carregar planos")
            }
        }
        fetchPlans()
    }, [])

    const handleSubscribe = async (priceId: string) => {
        if (!isAuthenticated) {
            toast.error("Crie uma conta para assinar")
            nav("/auth/register")
            return
        }

        if (priceId === "price_free") {
            // Free plan or contact
            toast.success("Plano gratuito selecionado")
            nav("/app/dashboard")
            return
        }

        try {
            setLoading(true)
            await checkout(priceId)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao iniciar assinatura")
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4 mt-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Compare Nossos Planos</h1>
                    <p className="text-lg text-muted-foreground">Escolha o plano ideal para suas necessidades</p>
                </div>

                <div className="overflow-x-auto ">
                    <Table className="min-w-[800px] mt-5">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px] align-top py-6 bg-background">
                                    <div className="mt-4 font-bold text-lg">Recursos</div>
                                </TableHead>
                                {plans.map(plan => (
                                    <TableHead key={plan.name} className={`text-center align-top min-w-[200px] ${plan.isPopular ? "border-2 border-b-0 border-primary rounded-t-3xl relative py-6 bg-primary/5" : "py-6 border-b border-border"}`}>
                                        {plan.isPopular && (
                                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-full shadow-lg whitespace-nowrap">
                                                Mais Popular
                                            </span>
                                        )}
                                        <div className="space-y-2 mt-4">
                                            <div className="text-xl font-bold text-foreground">{plan.name}</div>
                                            <div className="flex items-end justify-center gap-1">
                                                <div className="text-3xl font-bold">{plan.price}</div>
                                                <div className="text-sm font-normal text-muted-foreground mb-1">/mês</div>
                                            </div>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Feature Rows */}
                            {[
                                { label: "Usuários", keywords: ["usuário", "users"] },
                                { label: "Projetos", keywords: ["projeto", "projects"] },
                                { label: "Documentos", keywords: ["documento", "doc", "arquivos"] },
                                { label: "Suporte", keywords: ["suporte", "support"] },
                                { label: "Acervo Técnico", keywords: ["acervo"], isBoolean: true },
                                { label: "Gestão Financeira", keywords: ["financeira", "finance"], isBoolean: true },
                            ].map((row, index) => (
                                <TableRow key={row.label} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                                    <TableCell className="font-medium p-4">{row.label}</TableCell>
                                    {plans.map(plan => {
                                        // Find feature in plan that matches keywords
                                        const featureString = plan.features.find(f =>
                                            row.keywords.some(k => f.toLowerCase().includes(k))
                                        )

                                        let display: React.ReactNode = <span className="text-muted-foreground">-</span>

                                        if (featureString) {
                                            if (row.isBoolean) {
                                                display = <Check className="h-5 w-5 text-green-500 mx-auto" />
                                            } else {
                                                // Try to extract value (e.g. "1 usuário" -> "1", "Projetos Ilimitados" -> "Ilimitados")
                                                // For now, just render the string but maybe clean it up if needed? 
                                                // Or just render the whole string which is fine.
                                                // Actually, let's try to extract the quantity if it starts with a number
                                                const parts = featureString.split(" ")
                                                if (!isNaN(parseInt(parts[0]))) {
                                                    display = <span className="font-bold">{parts[0]}</span>
                                                } else if (featureString.toLowerCase().includes("ilimitado")) {
                                                    display = <span className="font-bold">Ilimitado</span>
                                                } else {
                                                    display = <span className="text-sm">{featureString}</span>
                                                }
                                            }
                                        } else {
                                            if (row.isBoolean) {
                                                display = <X className="h-5 w-5 text-destructive/50 mx-auto" />
                                            }
                                        }

                                        return (
                                            <TableCell
                                                key={`${plan.id}-${row.label}`}
                                                className={`text-center p-4 ${plan.isPopular ? "border-x-2 border-primary bg-primary/5" : ""}`}
                                            >
                                                {display}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}

                            {/* Action Row */}
                            <TableRow>
                                <TableCell className="border-t"></TableCell>
                                {plans.map(plan => (
                                    <TableCell key={`${plan.name}-action`} className={`p-6 border-t ${plan.isPopular ? "border-x-2 border-b-2 border-primary rounded-b-lg bg-primary/5" : ""}`}>
                                        <Button
                                            className="w-full"
                                            variant={plan.isPopular ? "default" : "outline"}
                                            onClick={() => handleSubscribe(plan.id)}
                                            disabled={loading}
                                        >
                                            Escolher {plan.name}
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </main>
            <LandingFooter />
        </div>
    )
}
