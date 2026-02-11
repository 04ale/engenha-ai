"use client"

import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LightWavesBackground } from "./HeroBackground"


const HERO_COLORS = ["#0ea5e9", "#8b5cf6", "#06b6d4"]

export default function HeroSection() {
    const navigate = useNavigate()

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <LightWavesBackground
                    className="absolute inset-0"
                    colors={HERO_COLORS}
                    speed={0.5}
                    intensity={0.4}
                />
                <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8">
                    ✨ A revolução na engenharia civil
                </div>

                <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
                    Gestão Inteligente de <br />
                    <span className="bg-linear-to-r from-primary via-violet-700 to-primary bg-clip-text text-transparent animate-gradient-x">
                        Acervos Técnicos
                    </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Simplifique a organização de suas obras, gere atestados e CATs com facilidade.
                    A plataforma completa para engenheiros que valorizam seu tempo.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => navigate("/auth/register")}>
                        Começar Gratuitamente
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-muted" onClick={() => navigate("/auth/login")}>
                        Fazer login
                    </Button>
                </div>
            </div>
        </section>
    )
}
