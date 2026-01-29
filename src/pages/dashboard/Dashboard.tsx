import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { MetricCardDialog } from "@/components/dashboard/MetricCardDialog"
import { RecentObras } from "@/components/dashboard/RecentObras"
import { RecentAcervos } from "@/components/dashboard/RecentAcervos"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { useDashboard } from "@/hooks/useDashboard"
import { Building2, FileText, FileCheck, DollarSign } from "lucide-react"
import { useMemo } from "react"
import { obraService } from "@/services/obraService"
import { acervoService } from "@/services/acervoService"

export default function DashboardPage() {
  const { user } = useAuth()
  const { metrics, recentObras, recentAcervos, loading } = useDashboard()
  const [dialogOpen, setDialogOpen] = useState<{
    type: "obras" | "acervos" | "cats" | "valor" | null
    open: boolean
  }>({ type: null, open: false })
  const [dialogData, setDialogData] = useState<any[]>([])
  const [dialogLoading, setDialogLoading] = useState(false)

  const obrasTrend = useMemo(() => {
    if (!metrics) return "neutral"
    if (metrics.obrasEsteMes > metrics.obrasUltimoMes) return "up"
    if (metrics.obrasEsteMes < metrics.obrasUltimoMes) return "down"
    return "neutral"
  }, [metrics])

  const acervosTrend = useMemo(() => {
    if (!metrics) return "neutral"
    if (metrics.acervosEsteMes > metrics.acervosUltimoMes) return "up"
    if (metrics.acervosEsteMes < metrics.acervosUltimoMes) return "down"
    return "neutral"
  }, [metrics])

  const valorTrend = useMemo(() => {
    if (!metrics) return "neutral"
    if (metrics.valorEsteMes > metrics.valorUltimoMes) return "up"
    if (metrics.valorEsteMes < metrics.valorUltimoMes) return "down"
    return "neutral"
  }, [metrics])

  const obrasTrendValue = useMemo(() => {
    if (!metrics || metrics.obrasUltimoMes === 0) return undefined
    const diff = metrics.obrasEsteMes - metrics.obrasUltimoMes
    const percent = Math.round((diff / metrics.obrasUltimoMes) * 100)
    return `${Math.abs(percent)}%`
  }, [metrics])

  const acervosTrendValue = useMemo(() => {
    if (!metrics || metrics.acervosUltimoMes === 0) return undefined
    const diff = metrics.acervosEsteMes - metrics.acervosUltimoMes
    const percent = Math.round((diff / metrics.acervosUltimoMes) * 100)
    return `${Math.abs(percent)}%`
  }, [metrics])

  const valorTrendValue = useMemo(() => {
    if (!metrics || metrics.valorUltimoMes === 0) return undefined
    const diff = metrics.valorEsteMes - metrics.valorUltimoMes
    const percent = Math.round((diff / metrics.valorUltimoMes) * 100)
    return `${Math.abs(percent)}%`
  }, [metrics])

  const handleCardClick = async (type: "obras" | "acervos" | "cats" | "valor") => {
    if (!user?.workspace_id) return

    setDialogOpen({ type, open: true })
    setDialogLoading(true)

    try {
      if (type === "obras") {
        const obras = await obraService.list(user.workspace_id)
        setDialogData(obras)
      } else if (type === "acervos") {
        const acervos = await acervoService.list(user.workspace_id)
        setDialogData(acervos)
      } else if (type === "cats") {
        const acervos = await acervoService.list(user.workspace_id)
        const acervosComCAT = acervos.filter((a) => a.arquivo_cat_url)
        setDialogData(acervosComCAT)
      } else if (type === "valor") {
        const acervos = await acervoService.list(user.workspace_id)
        const valorTotal = acervos.reduce((sum, a) => sum + (a.valor_total || 0), 0)
        setDialogData([
          { valorTotal },
          ...acervos.map((a) => ({
            id: a.id,
            descricao_obra: a.descricao_obra,
            valor_total: a.valor_total || 0,
            obra_descricao: a.descricao_obra,
          })),
        ])
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setDialogData([])
    } finally {
      setDialogLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Bem-vindo, <span className="font-semibold text-foreground">{user?.nome_completo}</span>
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total de Obras"
          description="Obras cadastradas"
          value={metrics?.totalObras ?? 0}
          icon={Building2}
          loading={loading}
          trend={obrasTrend}
          trendValue={obrasTrendValue}
          trendLabel="vs mês anterior"
          onClick={() => handleCardClick("obras")}
        />
        <MetricCard
          title="Total de Acervos"
          description="Acervos técnicos"
          value={metrics?.totalAcervos ?? 0}
          icon={FileText}
          loading={loading}
          trend={acervosTrend}
          trendValue={acervosTrendValue}
          trendLabel="vs mês anterior"
          onClick={() => handleCardClick("acervos")}
        />
        <MetricCard
          title="CATs Registrados"
          description="Certidões anexadas"
          value={metrics?.totalCATs ?? 0}
          icon={FileCheck}
          loading={loading}
          onClick={() => handleCardClick("cats")}
        />
        <MetricCard
          title="Valor Total"
          description="Valor executado"
          value={
            metrics?.valorTotalExecutado
              ? `R$ ${metrics.valorTotalExecutado.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`
              : null
          }
          icon={DollarSign}
          loading={loading}
          trend={valorTrend}
          trendValue={valorTrendValue}
          trendLabel="vs mês anterior"
          onClick={() => handleCardClick("valor")}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentObras obras={recentObras} loading={loading} />
          <RecentAcervos acervos={recentAcervos} loading={loading} />
        </div>
        <QuickActions />
      </div>

      {/* Dialogs */}
      {dialogOpen.type && (
        <MetricCardDialog
          open={dialogOpen.open}
          onOpenChange={(open) => setDialogOpen({ type: dialogOpen.type, open })}
          title={
            dialogOpen.type === "obras"
              ? "Todas as Obras"
              : dialogOpen.type === "acervos"
                ? "Todos os Acervos Técnicos"
                : dialogOpen.type === "cats"
                  ? "Acervos com CAT Registrado"
                  : "Detalhamento de Valores"
          }
          type={dialogOpen.type}
          data={dialogData}
          loading={dialogLoading}
        />
      )}
    </DashboardLayout>
  )
}
