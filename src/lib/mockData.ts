import type { Obra } from "@/types/obra"
import type { Acervo } from "@/types/acervo"
import type { Item } from "@/types/item"
import type { DashboardMetrics, RecentObra, RecentAcervo } from "@/services/dashboardService"

// Arrays mutáveis para permitir modificações durante desenvolvimento
let mockObrasArray: Obra[] = [
  {
    id: "1",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    descricao_obra: "Construção de Edifício Residencial - Torre A",
    finalidade: "Construção de edifício residencial com 20 andares",
    observacoes: "Obra em andamento, previsão de conclusão em 2025",
    cidade: "São Paulo",
    estado: "SP",
    endereco_obra: "Av. Paulista, 1000 - Bela Vista",
    data_inicio: "2023-01-15",
    data_conclusao: "2025-06-30",
    contratante_nome: "Construtora ABC Ltda",
    contratante_tipo: "pessoa_juridica",
    contratante_cnpj: "12.345.678/0001-90",
    numero_contrato: "CT-2023-001",
    valor_total: 15000000.00,
    created_at: "2023-01-10T10:00:00Z",
    updated_at: "2023-01-10T10:00:00Z",
  },
  {
    id: "2",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    descricao_obra: "Reforma de Shopping Center",
    finalidade: "Modernização e ampliação do shopping",
    observacoes: null,
    cidade: "Rio de Janeiro",
    estado: "RJ",
    endereco_obra: "Rua das Laranjeiras, 500",
    data_inicio: "2023-03-01",
    data_conclusao: "2024-12-31",
    contratante_nome: "Shopping XYZ S.A.",
    contratante_tipo: "pessoa_juridica",
    contratante_cnpj: "98.765.432/0001-10",
    numero_contrato: "CT-2023-045",
    valor_total: 25000000.00,
    created_at: "2023-02-20T14:30:00Z",
    updated_at: "2023-02-20T14:30:00Z",
  },
  {
    id: "3",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    descricao_obra: "Ponte sobre o Rio Paraná",
    finalidade: "Construção de ponte rodoviária",
    observacoes: "Projeto de grande porte, licenciamento ambiental aprovado",
    cidade: "Foz do Iguaçu",
    estado: "PR",
    endereco_obra: "BR-277, km 15",
    data_inicio: "2022-06-01",
    data_conclusao: null,
    contratante_nome: "DNIT - Departamento Nacional de Infraestrutura de Transportes",
    contratante_tipo: "orgao_publico",
    contratante_cnpj: null,
    numero_contrato: "CT-2022-089",
    valor_total: 45000000.00,
    created_at: "2022-05-15T09:00:00Z",
    updated_at: "2022-05-15T09:00:00Z",
  },
  {
    id: "4",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    descricao_obra: "Condomínio Residencial Horizonte",
    finalidade: "Construção de condomínio com 150 unidades",
    observacoes: null,
    cidade: "Belo Horizonte",
    estado: "MG",
    endereco_obra: "Av. Afonso Pena, 3000 - Centro",
    data_inicio: "2023-08-01",
    data_conclusao: "2025-03-31",
    contratante_nome: "Construtora Horizonte",
    contratante_tipo: "pessoa_juridica",
    contratante_cnpj: "11.222.333/0001-44",
    numero_contrato: "CT-2023-120",
    valor_total: 32000000.00,
    created_at: "2023-07-20T11:15:00Z",
    updated_at: "2023-07-20T11:15:00Z",
  },
  {
    id: "5",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    descricao_obra: "Hospital Regional Norte",
    finalidade: "Construção de hospital público",
    observacoes: "Projeto em fase de execução",
    cidade: "Brasília",
    estado: "DF",
    endereco_obra: "SQN 305, Bloco A",
    data_inicio: "2023-05-10",
    data_conclusao: "2025-12-31",
    contratante_nome: "Secretaria de Saúde do DF",
    contratante_tipo: "orgao_publico",
    contratante_cnpj: null,
    numero_contrato: "CT-2023-078",
    valor_total: 85000000.00,
    created_at: "2023-04-25T08:30:00Z",
    updated_at: "2023-04-25T08:30:00Z",
  },
]

// Exportar getter para manter compatibilidade
export const mockObras = mockObrasArray

// Mock de Itens
let mockItensObject: Record<string, Item[]> = {
  "acervo-1": [
    {
      id: "item-1",
      acervo_id: "acervo-1",
      descricao: "Concreto estrutural fck 30 MPa",
      unidade: "m³",
      quantidade: 1250.5,
      valor_executado: 450.00,
      data_execucao: "2023-02-15",
      created_at: "2023-02-15T10:00:00Z",
    },
    {
      id: "item-2",
      acervo_id: "acervo-1",
      descricao: "Aço CA-50 para estruturas",
      unidade: "kg",
      quantidade: 85000.0,
      valor_executado: 8.50,
      data_execucao: "2023-02-20",
      created_at: "2023-02-20T10:00:00Z",
    },
    {
      id: "item-3",
      acervo_id: "acervo-1",
      descricao: "Formas metálicas para lajes",
      unidade: "m²",
      quantidade: 3500.0,
      valor_executado: 35.00,
      data_execucao: "2023-03-01",
      created_at: "2023-03-01T10:00:00Z",
    },
  ],
  "acervo-2": [
    {
      id: "item-4",
      acervo_id: "acervo-2",
      descricao: "Revestimento cerâmico",
      unidade: "m²",
      quantidade: 2500.0,
      valor_executado: 85.00,
      data_execucao: "2023-04-10",
      created_at: "2023-04-10T10:00:00Z",
    },
    {
      id: "item-5",
      acervo_id: "acervo-2",
      descricao: "Pintura acrílica",
      unidade: "m²",
      quantidade: 1800.0,
      valor_executado: 25.00,
      data_execucao: "2023-04-15",
      created_at: "2023-04-15T10:00:00Z",
    },
  ],
  "acervo-3": [
    {
      id: "item-6",
      acervo_id: "acervo-3",
      descricao: "Terraplenagem",
      unidade: "m³",
      quantidade: 5000.0,
      valor_executado: 15.00,
      data_execucao: "2022-07-01",
      created_at: "2022-07-01T10:00:00Z",
    },
    {
      id: "item-7",
      acervo_id: "acervo-3",
      descricao: "Pavimentação asfáltica",
      unidade: "m²",
      quantidade: 12000.0,
      valor_executado: 120.00,
      data_execucao: "2022-08-15",
      created_at: "2022-08-15T10:00:00Z",
    },
    {
      id: "item-8",
      acervo_id: "acervo-3",
      descricao: "Sinalização horizontal",
      unidade: "m²",
      quantidade: 800.0,
      valor_executado: 45.00,
      data_execucao: "2022-09-01",
      created_at: "2022-09-01T10:00:00Z",
    },
  ],
}

// Exportar getter
export const mockItens = mockItensObject

// Mock de Acervos
let mockAcervosArray: Acervo[] = [
  {
    id: "acervo-1",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    obra_id: "1",
    descricao_obra: "Acervo Técnico - Edifício Residencial Torre A",
    finalidade: "Documentação técnica da estrutura",
    observacoes: "Acervo completo da estrutura",
    cidade: "São Paulo",
    estado: "SP",
    endereco_obra: "Av. Paulista, 1000 - Bela Vista",
    data_inicio: "2023-01-15",
    data_conclusao: "2024-12-31",
    contratante_nome: "Construtora ABC Ltda",
    contratante_tipo: "pessoa_juridica",
    contratante_cnpj: "12.345.678/0001-90",
    numero_contrato: "CT-2023-001",
    valor_total: 1250000.00,
    numero_art: "ART-2023-001234",
    tipo_art: "Projeto e Execução",
    data_art_registro: "2023-01-10",
    data_art_baixa: null,
    acervo_tipo: "Acervo Técnico Estrutural",
    nome_fantasia: "Torre A - Estrutura",
    arquivo_cat_url: "https://example.com/cat-1.pdf",
    arquivo_cat_nome: "CAT_Torre_A_Estrutura.pdf",
    created_at: "2023-01-10T10:00:00Z",
    updated_at: "2023-01-10T10:00:00Z",
    itens: mockItens["acervo-1"],
  },
  {
    id: "acervo-2",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    obra_id: "2",
    descricao_obra: "Acervo Técnico - Reforma Shopping Center",
    finalidade: "Documentação de acabamentos",
    observacoes: null,
    cidade: "Rio de Janeiro",
    estado: "RJ",
    endereco_obra: "Rua das Laranjeiras, 500",
    data_inicio: "2023-03-01",
    data_conclusao: "2024-11-30",
    contratante_nome: "Shopping XYZ S.A.",
    contratante_tipo: "pessoa_juridica",
    contratante_cnpj: "98.765.432/0001-10",
    numero_contrato: "CT-2023-045",
    valor_total: 850000.00,
    numero_art: "ART-2023-002456",
    tipo_art: "Execução",
    data_art_registro: "2023-02-25",
    data_art_baixa: null,
    acervo_tipo: "Acervo Técnico de Acabamentos",
    nome_fantasia: "Shopping - Acabamentos",
    arquivo_cat_url: "https://example.com/cat-2.pdf",
    arquivo_cat_nome: "CAT_Shopping_Acabamentos.pdf",
    created_at: "2023-02-25T14:00:00Z",
    updated_at: "2023-02-25T14:00:00Z",
    itens: mockItens["acervo-2"],
  },
  {
    id: "acervo-3",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    obra_id: "3",
    descricao_obra: "Acervo Técnico - Ponte sobre o Rio Paraná",
    finalidade: "Documentação de infraestrutura",
    observacoes: "Acervo da obra de infraestrutura rodoviária",
    cidade: "Foz do Iguaçu",
    estado: "PR",
    endereco_obra: "BR-277, km 15",
    data_inicio: "2022-06-01",
    data_conclusao: null,
    contratante_nome: "DNIT",
    contratante_tipo: "orgao_publico",
    contratante_cnpj: null,
    numero_contrato: "CT-2022-089",
    valor_total: 2500000.00,
    numero_art: "ART-2022-003789",
    tipo_art: "Projeto e Execução",
    data_art_registro: "2022-05-20",
    data_art_baixa: null,
    acervo_tipo: "Acervo Técnico de Infraestrutura",
    nome_fantasia: "Ponte Paraná",
    arquivo_cat_url: null,
    arquivo_cat_nome: null,
    created_at: "2022-05-20T09:00:00Z",
    updated_at: "2022-05-20T09:00:00Z",
    itens: mockItens["acervo-3"],
  },
  {
    id: "acervo-4",
    empresa_id: "emp-1",
    engenheiro_id: "eng-1",
    workspace_id: "ws-1",
    created_by: "user-1",
    obra_id: "4",
    descricao_obra: "Acervo Técnico - Condomínio Horizonte",
    finalidade: "Documentação estrutural e arquitetônica",
    observacoes: null,
    cidade: "Belo Horizonte",
    estado: "MG",
    endereco_obra: "Av. Afonso Pena, 3000 - Centro",
    data_inicio: "2023-08-01",
    data_conclusao: "2025-02-28",
    contratante_nome: "Construtora Horizonte",
    contratante_tipo: "pessoa_juridica",
    contratante_cnpj: "11.222.333/0001-44",
    numero_contrato: "CT-2023-120",
    valor_total: 1800000.00,
    numero_art: "ART-2023-004567",
    tipo_art: "Projeto e Execução",
    data_art_registro: "2023-07-25",
    data_art_baixa: null,
    acervo_tipo: "Acervo Técnico Completo",
    nome_fantasia: "Condomínio Horizonte",
    arquivo_cat_url: "https://example.com/cat-4.pdf",
    arquivo_cat_nome: "CAT_Condominio_Horizonte.pdf",
    created_at: "2023-07-25T11:00:00Z",
    updated_at: "2023-07-25T11:00:00Z",
    itens: [],
  },
]

// Exportar getter
export const mockAcervos = mockAcervosArray

// Funções para modificar os arrays (usadas pelos serviços)
export const mockDataHelpers = {
  addObra: (obra: Obra) => {
    mockObrasArray.unshift(obra)
  },
  updateObra: (id: string, obra: Partial<Obra>) => {
    const index = mockObrasArray.findIndex((o) => o.id === id)
    if (index !== -1) {
      mockObrasArray[index] = { ...mockObrasArray[index], ...obra }
    }
  },
  removeObra: (id: string) => {
    const index = mockObrasArray.findIndex((o) => o.id === id)
    if (index !== -1) {
      mockObrasArray.splice(index, 1)
    }
  },
  addAcervo: (acervo: Acervo) => {
    mockAcervosArray.unshift(acervo)
  },
  updateAcervo: (id: string, acervo: Partial<Acervo>) => {
    const index = mockAcervosArray.findIndex((a) => a.id === id)
    if (index !== -1) {
      mockAcervosArray[index] = { ...mockAcervosArray[index], ...acervo }
    }
  },
  removeAcervo: (id: string) => {
    const index = mockAcervosArray.findIndex((a) => a.id === id)
    if (index !== -1) {
      mockAcervosArray.splice(index, 1)
      delete mockItensObject[id]
    }
  },
  setItens: (acervoId: string, itens: Item[]) => {
    mockItensObject[acervoId] = itens
  },
}

// Calcular valor total executado a partir dos itens
const calcularValorTotalExecutado = () => {
  let total = 0
  Object.values(mockItens).forEach((itens) => {
    itens.forEach((item) => {
      total += item.quantidade * item.valor_executado
    })
  })
  return total
}

// Mock de Métricas do Dashboard
const hoje = new Date()
const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
const primeiroDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0)

const obrasEsteMes = mockObrasArray.filter(
  (obra) => new Date(obra.created_at) >= primeiroDiaMes
).length

const acervosEsteMes = mockAcervosArray.filter(
  (acervo) => new Date(acervo.created_at) >= primeiroDiaMes
).length

const obrasUltimoMes = mockObrasArray.filter(
  (obra) =>
    new Date(obra.created_at) >= primeiroDiaMesAnterior &&
    new Date(obra.created_at) <= ultimoDiaMesAnterior
).length

const acervosUltimoMes = mockAcervosArray.filter(
  (acervo) =>
    new Date(acervo.created_at) >= primeiroDiaMesAnterior &&
    new Date(acervo.created_at) <= ultimoDiaMesAnterior
).length

const valorEsteMes = mockAcervosArray
  .filter((acervo) => new Date(acervo.created_at) >= primeiroDiaMes)
  .reduce((sum, acervo) => sum + (acervo.valor_total || 0), 0)

const valorUltimoMes = mockAcervosArray
  .filter(
    (acervo) =>
      new Date(acervo.created_at) >= primeiroDiaMesAnterior &&
      new Date(acervo.created_at) <= ultimoDiaMesAnterior
  )
  .reduce((sum, acervo) => sum + (acervo.valor_total || 0), 0)

export const mockDashboardMetrics: DashboardMetrics = {
  totalObras: mockObrasArray.length,
  totalAcervos: mockAcervosArray.length,
  totalCATs: mockAcervosArray.filter((a) => a.arquivo_cat_url).length,
  valorTotalExecutado: calcularValorTotalExecutado(),
  obrasEsteMes,
  acervosEsteMes,
  valorEsteMes,
  obrasUltimoMes,
  acervosUltimoMes,
  valorUltimoMes,
}

// Mock de Obras Recentes
export const mockRecentObras: RecentObra[] = mockObrasArray.slice(0, 5).map((obra) => ({
  id: obra.id,
  descricao_obra: obra.descricao_obra,
  cidade: obra.cidade,
  estado: obra.estado,
  data_inicio: obra.data_inicio,
  valor_total: obra.valor_total,
}))

// Mock de Acervos Recentes
export const mockRecentAcervos: RecentAcervo[] = mockAcervosArray.slice(0, 5).map((acervo) => ({
  id: acervo.id,
  descricao_obra: acervo.descricao_obra,
  cidade: acervo.cidade,
  estado: acervo.estado,
  acervo_tipo: acervo.acervo_tipo,
  numero_art: acervo.numero_art,
  created_at: acervo.created_at,
}))
