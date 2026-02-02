import { supabase } from "@/lib/supabase/client"

export interface DashboardMetrics {
  totalObras: number
  totalAcervos: number
  totalCATs: number
  valorTotalExecutado: number
  obrasEsteMes: number
  acervosEsteMes: number
  valorEsteMes: number
  obrasUltimoMes: number
  acervosUltimoMes: number
  valorUltimoMes: number
}

export interface RecentObra {
  id: string
  descricao_obra: string
  cidade: string
  estado: string
  data_inicio: string
  valor_total: number | null
}

export interface RecentAcervo {
  id: string
  descricao_obra: string
  cidade: string
  estado: string
  acervo_tipo: string
  numero_art: string | null
  created_at: string
}

export interface ChartData {
  name: string
  obras: number
  acervos: number
  valor: number
}

export const dashboardService = {
  async getMetrics(workspaceId: string): Promise<DashboardMetrics> {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = hoje.getMonth()

    const primeiroDiaMes = new Date(ano, mes, 1).toISOString()
    const primeiroDiaMesAnterior = new Date(ano, mes - 1, 1).toISOString()
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).toISOString()

    // Queries paralelas para performance
    const [
      { count: totalObras },
      { count: totalAcervos },
      { count: totalCATs },
      { count: obrasEsteMes },
      { count: acervosEsteMes },
      { data: acervosValorEsteMes },
      { count: obrasUltimoMes },
      { count: acervosUltimoMes },
      { data: acervosValorUltimoMes }
    ] = await Promise.all([
      supabase.from("obras").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      supabase.from("acervos").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
      supabase.from("acervos").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).not("arquivo_cat_url", "is", null),
      supabase.from("acervo_itens").select("quantidade, valor_executado").eq("acervo_id", workspaceId), // Nota: items não têm workspace_id direto, preciso filtrar pelos acervos do workspace.
      // Correção: acervo_itens não tem workspace_id. Preciso fazer join ou buscar todos e filtrar (ineficiente) ou confiar que o RLS cuida disso.
      // Melhor abordagem rápida: select('quantidade, valor_executado, acervos!inner(workspace_id)').eq('acervos.workspace_id', workspaceId)

      supabase.from("obras").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", primeiroDiaMes),
      supabase.from("acervos").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", primeiroDiaMes),
      supabase.from("acervos").select("valor_total").eq("workspace_id", workspaceId).gte("created_at", primeiroDiaMes),

      supabase.from("obras").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", primeiroDiaMesAnterior).lte("created_at", ultimoDiaMesAnterior),
      supabase.from("acervos").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId).gte("created_at", primeiroDiaMesAnterior).lte("created_at", ultimoDiaMesAnterior),
      supabase.from("acervos").select("valor_total").eq("workspace_id", workspaceId).gte("created_at", primeiroDiaMesAnterior).lte("created_at", ultimoDiaMesAnterior),
    ])

    // Calcular valor total executado
    // Como acervo_itens pode ser muito grande, idealmente seria uma RPC ou view.
    // Para agora: vamos somar o que conseguirmos via query com join nas acervos do workspace
    const { data: allItems } = await supabase
      .from("acervo_itens")
      .select("quantidade, valor_executado, acervos!inner(workspace_id)")
      .eq("acervos.workspace_id", workspaceId)

    const valorTotalExecutado = (allItems || []).reduce((sum, item) => sum + (item.quantidade * item.valor_executado), 0)

    const valorEsteMes = (acervosValorEsteMes || []).reduce((sum, item) => sum + (item.valor_total || 0), 0)
    const valorUltimoMes = (acervosValorUltimoMes || []).reduce((sum, item) => sum + (item.valor_total || 0), 0)

    return {
      totalObras: totalObras || 0,
      totalAcervos: totalAcervos || 0,
      totalCATs: totalCATs || 0,
      valorTotalExecutado,
      obrasEsteMes: obrasEsteMes || 0,
      acervosEsteMes: acervosEsteMes || 0,
      valorEsteMes,
      obrasUltimoMes: obrasUltimoMes || 0,
      acervosUltimoMes: acervosUltimoMes || 0,
      valorUltimoMes,
    }
  },

  async getRecentObras(workspaceId: string, limit = 5): Promise<RecentObra[]> {
    const { data } = await supabase
      .from("obras")
      .select("id, descricao_obra, cidade, estado, data_inicio, valor_total")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit)

    return data || []
  },

  async getRecentAcervos(workspaceId: string, limit = 5): Promise<RecentAcervo[]> {
    const { data } = await supabase
      .from("acervos")
      .select("id, descricao_obra, cidade, estado, acervo_tipo, numero_art, created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit)

    return data || []
  },

  async getChartData(workspaceId: string): Promise<ChartData[]> {
    const hoje = new Date()
    const sixMonthsAgo = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1).toISOString()

    const { data: obrasData } = await supabase
      .from("obras")
      .select("created_at")
      .eq("workspace_id", workspaceId)
      .gte("created_at", sixMonthsAgo)

    const { data: acervosData } = await supabase
      .from("acervos")
      .select("created_at, valor_total")
      .eq("workspace_id", workspaceId)
      .gte("created_at", sixMonthsAgo)

    // Agregar dados por mês
    const monthsData = new Map<string, ChartData>()

    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const name = d.toLocaleDateString("pt-BR", { month: "short" })
      monthsData.set(key, { name, obras: 0, acervos: 0, valor: 0 })
    }

    if (obrasData) {
      obrasData.forEach(o => {
        const d = new Date(o.created_at)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (monthsData.has(key)) {
          const entry = monthsData.get(key)!
          entry.obras++
        }
      })
    }

    if (acervosData) {
      acervosData.forEach(a => {
        const d = new Date(a.created_at)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (monthsData.has(key)) {
          const entry = monthsData.get(key)!
          entry.acervos++
          entry.valor += (a.valor_total || 0)
        }
      })
    }

    return Array.from(monthsData.values())
  },
}
