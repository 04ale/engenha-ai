"use client"

import { Building2 } from "lucide-react"

export default function LandingFooter() {
    return (
        <footer className="bg-background border-t py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Building2 className="h-6 w-6 text-primary" />
                        <span>Engenha AI</span>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Termos</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-primary transition-colors">Suporte</a>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Engenha AI. DevTech Softwares. Todos os direitos reservados.
                    </div>
                </div>
            </div>
        </footer>
    )
}
