"use client"

import {
    Building2,
    FileCheck,
    FileSpreadsheet,
    ShieldCheck,
    FileText,
    LayoutDashboard,
} from "lucide-react"
import FeatureCard from "./FeatureCard"

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-muted/30 relative" id="recursos">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Tudo que você precisa em um só lugar</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Ferramentas poderosas desenvolvidas especificamente para as necessidades do setor de engenharia.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<FileCheck className="h-8 w-8" />}
                        title="Gestão de Acervos"
                        description="Organize seus acervos técnicos com detalhes, fotos e documentos vinculados em um único local."
                    />
                    <FeatureCard
                        icon={<Building2 className="h-8 w-8" />}
                        title="Controle de Obras"
                        description="Mantenha o histórico completo de suas obras, com datas, valores e status de execução atualizados."
                    />
                    <FeatureCard
                        icon={<FileSpreadsheet className="h-8 w-8" />}
                        title="Exportação Inteligente"
                        description="Gere planilhas Excel e relatórios PDF formatados automaticamente para facilitar sua gestão."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-8 w-8" />}
                        title="Segurança e Backup"
                        description="Seus dados protegidos e acessíveis de qualquer lugar. Backup automático e segurança de nível empresarial."
                    />
                    <FeatureCard
                        icon={<FileText className="h-8 w-8" />}
                        title="Emissão de CAT"
                        description="Facilite o processo de emissão de Certidão de Acervo Técnico com dados organizados e pré-validados."
                    />
                    <FeatureCard
                        icon={<LayoutDashboard className="h-8 w-8" />}
                        title="Dashboard Intuitivo"
                        description="Visualize métricas importantes e o progresso de seus projetos em tempo real."
                    />
                </div>
            </div>
        </section>
    )
}
