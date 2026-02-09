import { CheckCircle2 } from "lucide-react"

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-green-500/10 p-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-lg">{text}</span>
        </div>
    )
}

export default BenefitItem
