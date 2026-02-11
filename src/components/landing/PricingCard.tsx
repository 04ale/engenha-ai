"use client"

import { checkout } from "@/services/stripe"
import { useState } from "react"
import { toast } from "sonner"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface PricingCardProps {
    title: string
    price: string
    features: string[]
    priceId: string
    isPopular?: boolean
}

export function PricingCard({ title, price, features, priceId, isPopular }: PricingCardProps) {
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()
    const nav = useNavigate()

    const handleSubscribe = async () => {
        try {
            setLoading(true)
            await checkout(priceId)
        } catch (error) {
            toast.error("Erro ao iniciar pagamento. Tente novamente.")
        } finally {
            // setLoading(false)
        }
    }

    return (
        <Card
            className={cn(
                "relative flex flex-col transition-all duration-300 hover:shadow-xl",
                isPopular
                    ? "border-blue-600 shadow-blue-100 dark:shadow-blue-900/20 scale-105 z-10"
                    : "border-border hover:-translate-y-1"
            )}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                    Recomendado
                </div>
            )}

            <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className={cn("text-xl font-bold", isPopular ? "text-blue-500" : "text-foreground")}>
                    {title}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className={cn("text-4xl font-bold", isPopular ? "text-blue-500" : "text-foreground")}>
                        R$ {price}
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">/mês</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                <ul className="space-y-4">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className={cn("rounded-full p-1 shrink-0", isPopular ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" : "bg-slate-100 text-slate-600 dark:bg-slate-800")}>
                                <Check className="h-3 w-3" />
                            </div>
                            <span className="leading-tight">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pt-8 pb-8">
                <Button
                    onClick={() => {
                        if (!isAuthenticated) {
                            toast.error("Crie uma conta para assinar")
                            nav("/auth/register")
                            return
                        }
                        handleSubscribe()
                    }}
                    disabled={loading}
                    className={cn(
                        "w-full font-semibold h-11",
                        isPopular ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
                    )}
                    variant={isPopular ? "default" : "outline"}
                >
                    {loading ? "Processando..." : "Assinar Agora"}
                </Button>
            </CardFooter>
        </Card>
    )
}