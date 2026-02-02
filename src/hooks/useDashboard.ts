import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  dashboardService,
  type DashboardMetrics,
  type RecentObra,
  type RecentAcervo,
  type ChartData,
} from "@/services/dashboardService"

export function useDashboard() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentObras, setRecentObras] = useState<RecentObra[]>([])
  const [recentAcervos, setRecentAcervos] = useState<RecentAcervo[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.workspace_id) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const [metricsData, obrasData, acervosData, chartDataResult] = await Promise.all([
          dashboardService.getMetrics(user.workspace_id),
          dashboardService.getRecentObras(user.workspace_id),
          dashboardService.getRecentAcervos(user.workspace_id),
          dashboardService.getChartData(user.workspace_id),
        ])

        setMetrics(metricsData)
        setRecentObras(obrasData)
        setRecentAcervos(acervosData)
        setChartData(chartDataResult)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.workspace_id])

  return {
    metrics,
    recentObras,
    recentAcervos,
    chartData,
    loading,
  }
}
