import {
  mockDashboardMetrics,
  mockRecentObras,
  mockRecentAcervos,
} from "@/lib/mockData"

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

// Simular delay de API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Gerar dados de gráfico dos últimos 6 meses
function generateChartData(): ChartData[] {
  const meses = []
  const hoje = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const nomeMes = data.toLocaleDateString("pt-BR", { month: "short" })
    
    // Simular dados baseados no mês
    const obras = Math.floor(Math.random() * 5) + (i >= 3 ? 2 : 0)
    const acervos = Math.floor(Math.random() * 8) + (i >= 3 ? 3 : 0)
    const valor = (Math.random() * 2000000 + 500000) * (i >= 3 ? 1.2 : 0.8)
    
    meses.push({
      name: nomeMes,
      obras,
      acervos,
      valor: Math.round(valor),
    })
  }
  
  return meses
}

export const dashboardService = {
  async getMetrics(workspaceId: string): Promise<DashboardMetrics> {
    await delay(400)
    return mockDashboardMetrics
  },

  async getRecentObras(workspaceId: string, limit = 5): Promise<RecentObra[]> {
    await delay(300)
    return mockRecentObras.slice(0, limit)
  },

  async getRecentAcervos(workspaceId: string, limit = 5): Promise<RecentAcervo[]> {
    await delay(300)
    return mockRecentAcervos.slice(0, limit)
  },

  async getChartData(workspaceId: string): Promise<ChartData[]> {
    await delay(300)
    return generateChartData()
  },
}
