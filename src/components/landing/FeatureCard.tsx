
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/5 p-3 text-primary group-hover:bg-primary/10 transition-colors">
                {icon}
            </div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/5 rounded-2xl pointer-events-none" />
        </div>
    )
}

export default FeatureCard