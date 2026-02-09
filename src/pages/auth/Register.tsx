import { RegisterForm } from "@/components/auth/RegisterForm"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Rocket, ShieldCheck } from "lucide-react"
import { Meteors } from "@/components/auth/LoginBackground"

export default function RegisterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/app/dashboard")
    }
  }, [user, navigate])

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex relative items-center justify-center bg-neutral-950 overflow-hidden">
        <Meteors className="absolute inset-0" />
        <div className="relative z-10 flex flex-col items-start justify-center h-full sm:px-12 xl:px-20 space-y-10 w-full max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl xl:text-7xl/none">
              Engenha
              <span className="bg-linear-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient-x">
                AI
              </span>
            </h1>
            <p className="max-w-[600px] text-slate-300 md:text-xl leading-relaxed">
              Simplifique a gestão técnica de suas obras e acervos.
              Automatize processos e garanta conformidade com a potência da IA.
            </p>
          </div>

          <div className="grid gap-6 w-full">
            <div className="flex items-center gap-4 text-white group">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors backdrop-blur-sm">
                <Rocket className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Produtividade Máxima</h3>
                <p className="text-sm text-slate-400">Gerencie acervos e contratos em um só lugar</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white group">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors backdrop-blur-sm">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Segurança & Compliance</h3>
                <p className="text-sm text-slate-400">Seus dados protegidos e organizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <RegisterForm />
      </div>

    </div>
  )
}
