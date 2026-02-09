"use client"

import { useNavigate } from "react-router-dom"
import { ArrowRight, CheckCircle2, BarChart3, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import BenefitItem from "./BenefitItem"

export default function BenefitsSection() {
    const navigate = useNavigate()

    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="relative rounded-2xl border bg-linear-to-b from-muted to-background p-2">
                            <div className="aspect-square rounded-xl bg-card border overflow-hidden relative shadow-2xl">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
                                {/* Abstract UI Representation */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 space-y-4">
                                    <div className="flex items-center gap-4 bg-background p-4 rounded-lg shadow-sm border">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">CAT Aprovada</p>
                                            <p className="text-xs text-muted-foreground">Obra Residencial Alpha</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-background p-4 rounded-lg shadow-sm border opacity-80 scale-95">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                            <BarChart3 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Relatório Gerado</p>
                                            <p className="text-xs text-muted-foreground">Exportação em PDF</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-background p-4 rounded-lg shadow-sm border opacity-60 scale-90">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                            <Users className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Novo Cliente</p>
                                            <p className="text-xs text-muted-foreground">Construtora XYZ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -left-10 h-32 w-32 bg-primary/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-blue-500/20 rounded-full blur-3xl" />
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            Vantagens Exclusivas
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Por que os melhores engenheiros escolhem a Engenha AI?
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Deixe as planilhas complexas de lado. Foque no que importa: a execução da sua obra e o crescimento da sua carreira.
                        </p>

                        <div className="grid gap-4">
                            <BenefitItem text="Centralização total do histórico de obras" />
                            <BenefitItem text="Geração automática de documentação técnica" />
                            <BenefitItem text="Alertas de vencimento e pendências" />
                            <BenefitItem text="Acesso em nuvem seguro e criptografado" />
                        </div>

                        <Button size="lg" className="h-12 px-8" onClick={() => navigate("/auth/register")}>
                            Criar conta agora
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
