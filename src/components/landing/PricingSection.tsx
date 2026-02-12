import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PricingCard } from "./PricingCard"
import { plansService, type Plan } from "@/services/plansService"

function PricingSection() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await plansService.getPlans()
                setPlans(data)
            } catch (error) {
                toast.error("Erro ao carregar planos")
            } finally {
                setLoading(false)
            }
        }
        fetchPlans()
    }, [])

    if (loading) return (
        <div className="max-w-5xl mx-auto py-20 px-4 text-center">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/4 mx-auto"></div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-muted rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold">Nossos Planos</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        title={plan.name}
                        price={plan.price.replace("R$", "").trim()}
                        features={plan.features}
                        priceId={plan.id}
                        isPopular={plan.isPopular}
                    />
                ))}
            </div>
        </div>
    )
}

export default PricingSection