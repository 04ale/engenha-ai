import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import LandingHeader from "@/components/landing/LandingHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import { Check, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { checkout } from "@/services/stripe"
import { useState } from "react"
import { Header } from "@/components/layout/Header"


export default function PlansPage() {
    const { isAuthenticated } = useAuth()
    const nav = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (priceId: string) => {
        if (!isAuthenticated) {
            toast.error("Crie uma conta para assinar")
            nav("/auth/register")
            return
        }

        if (!priceId) {
            // Free plan or contact
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

    const plans = [
        {
            name: "Engenheiro",
            price: "R$ 00,00",
            priceId: "",
            features: [
                { name: "Usuários", value: "1" },
                { name: "Projetos", value: "10" },
                { name: "Documentos", value: "100" },
                { name: "Suporte", value: "Básico" },
                { name: "Acervo Técnico", value: false },
                { name: "Gestão Financeira", value: false },
            ]
        },
        {
            name: "Engenheiro Basic",
            price: "R$ 29,90",
            popular: true,
            // TODO: Add actual Stripe price ID here when available
            priceId: "price_1QkiwOGIyM2gJDTSZl0p7nFp",
            features: [
                { name: "Usuários", value: "1" },
                { name: "Projetos", value: "Ilimitados" },
                { name: "Documentos", value: "Ilimitados" },
                { name: "Suporte", value: "Email" },
                { name: "Acervo Técnico", value: true },
                { name: "Gestão Financeira", value: false },
            ]
        },
        {
            name: "Engenheiro Acervado Plus",
            price: "R$ 59,90",
            // TODO: Add actual Stripe price ID here when available
            priceId: "price_1QkiwOGIyM2gJDTSZl0p7nFp",
            features: [
                { name: "Usuários", value: "5" },
                { name: "Projetos", value: "Ilimitados" },
                { name: "Documentos", value: "Ilimitados" },
                { name: "Suporte", value: "Prioritário 24/7" },
                { name: "Acervo Técnico", value: true },
                { name: "Gestão Financeira", value: true },
            ]
        }
    ]

    const allFeatures = plans[0].features.map(f => f.name)

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4 mt-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Compare Nossos Planos</h1>
                    <p className="text-lg text-muted-foreground">Escolha o plano ideal para suas necessidades</p>
                </div>

                <div className="overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px] align-top py-6">
                                    <div className="mt-4 font-bold text-lg">Recursos</div>
                                </TableHead>
                                {plans.map(plan => (
                                    <TableHead key={plan.name} className={`text-center align-top ${plan.popular ? "border-2 border-b-0 border-primary rounded-t-3xl relative py-6" : "py-6 border-b border-border"}`}>
                                        {plan.popular && (
                                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-full shadow-lg">
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
                            {allFeatures.map((featureName, index) => (
                                <TableRow key={featureName} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                                    <TableCell className="font-medium">{featureName}</TableCell>
                                    {plans.map(plan => {
                                        const feature = plan.features.find(f => f.name === featureName)
                                        let featureValue: React.ReactNode = feature?.value

                                        if (featureValue === true) featureValue = <Check className="h-5 w-5 text-green-500 mx-auto" />
                                        if (featureValue === false) featureValue = <X className="h-5 w-5 text-red-500 mx-auto" />

                                        return (
                                            <TableCell key={`${plan.name}-${featureName}`} className={`text-center ${plan.popular ? "border-x-2 border-primary" : ""}`}>
                                                {featureValue}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell></TableCell>
                                {plans.map(plan => (
                                    <TableCell key={`${plan.name}-action`} className={`p-4 ${plan.popular ? "border-x-2 border-b-2 border-primary rounded-b-lg" : ""}`}>
                                        <Button
                                            className="w-full"
                                            variant={plan.popular ? "default" : "outline"}
                                            onClick={() => handleSubscribe(plan.priceId)}
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
