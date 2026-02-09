"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function CTASection() {
    const navigate = useNavigate()

    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 text-center text-primary-foreground shadow-2xl">
                    {/* Abstract Background on CTA */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Pronto para transformar sua gestão?
                        </h2>
                        <p className="text-xl text-primary-foreground/80">
                            Junte-se a centenas de engenheiros que já estão otimizando seus processos hoje mesmo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" variant="secondary" className="text-lg h-14 px-10 font-bold shadow-lg hover:shadow-xl transition-all" onClick={() => navigate("/auth/register")}>
                                Começar Gratuitamente
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg h-14 px-10 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/contact")}>
                                Falar com Vendas
                            </Button>
                        </div>
                        <p className="text-sm text-primary-foreground/60 mt-6">
                            Não é necessário cartão de crédito • Cancelamento a qualquer momento
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
