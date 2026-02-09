"use client"

import { useNavigate } from "react-router-dom"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function LandingHeader() {
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={cn(
            "fixed w-full top-0 z-50 transition-all duration-300",
            isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm" : "bg-transparent border-transparent"
        )}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="bg-primary/10 p-2 rounded-lg backdrop-blur-sm">
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <span>Engenha<span className="text-primary">AI</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:flex" onClick={() => navigate("/auth/login")}>
                        Entrar
                    </Button>
                    <Button onClick={() => navigate("/auth/register")} className="shadow-lg shadow-primary/20">
                        Criar Conta
                    </Button>
                </div>
            </div>
        </header>
    )
}
