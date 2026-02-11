"use client"
import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { toast } from "sonner"
import { PricingCard } from "./PricingCard"

// Interface do que vem da API
interface Plan {
    id: string
    name: string
    price: string
    features: string[]
    isPopular: boolean
}

function PricingSection() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchPlans = async () => {
            const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
            const { data, error } = await supabase.functions.invoke('get-plans', {
                body: { search: 'Engenheiro' }
            })



            if (error) {
                toast.error("Erro ao carregar planos")
                console.error(error)
            } else {
                setPlans(data)

            }
            setLoading(false)
        }

        fetchPlans()
    }, [])



    if (loading) return <div className="text-center mt-20">Carregando planos...</div>

    return (
        <div className="max-w-5xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold">Nossos Planos</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <PricingCard
                    title={"Engenheiro"}
                    price={"00,00"}
                    features={["1 usuário", "10 projetos", "100 documentos"]}
                    priceId={""}
                    isPopular={false} />

                {plans.map((plan) => {
                    const extraFeatures = {
                        "Engenheiro Basic": [
                            "1 usuário",
                            "10 projetos",
                            "100 documentos",
                            "Suporte por email"
                        ],
                        "Engenheiro Acervado Plus": [
                            "5 usuários",
                            "Projetos ilimitados",
                            "Documentos ilimitados",
                            "Suporte prioritário 24/7",
                            "Gestão de Acervo Completa"
                        ]
                    }[plan.name] || []

                    return (
                        <PricingCard
                            key={plan.id}
                            title={plan.name}
                            price={plan.price.replace("R$", "").trim()}
                            features={[...plan.features, ...extraFeatures]}
                            priceId={plan.id}
                            isPopular={plan.name === "Engenheiro Basic"}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default PricingSection