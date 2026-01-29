import type { Item } from "./item"

export interface Acervo {
  id: string
  empresa_id: string
  engenheiro_id: string
  workspace_id: string
  created_by: string
  obra_id?: string | null
  descricao_obra: string
  finalidade?: string | null
  observacoes?: string | null
  cidade: string
  estado: string
  endereco_obra?: string | null
  data_inicio: string
  data_conclusao?: string | null
  contratante_nome?: string | null
  contratante_tipo?: "pessoa_fisica" | "pessoa_juridica" | "orgao_publico" | null
  contratante_cnpj?: string | null
  numero_contrato?: string | null
  valor_total?: number | null
  numero_art?: string | null
  tipo_art?: string | null
  data_art_registro?: string | null
  data_art_baixa?: string | null
  acervo_tipo: string
  nome_fantasia?: string | null
  arquivo_cat_url?: string | null
  arquivo_cat_nome?: string | null
  created_at: string
  updated_at: string
  itens?: Item[]
}

export interface CreateAcervoInput {
  obra_id?: string
  descricao_obra: string
  finalidade?: string
  observacoes?: string
  cidade: string
  estado: string
  endereco_obra?: string
  data_inicio: string
  data_conclusao?: string
  contratante_nome?: string
  contratante_tipo?: "pessoa_fisica" | "pessoa_juridica" | "orgao_publico"
  contratante_cnpj?: string
  numero_contrato?: string
  valor_total?: number
  numero_art?: string
  tipo_art?: string
  data_art_registro?: string
  data_art_baixa?: string
  acervo_tipo: string
  nome_fantasia?: string
  arquivo_cat_url?: string
  arquivo_cat_nome?: string
  itens?: Array<{
    descricao: string
    unidade: string
    quantidade: number
    valor_executado: number
    data_execucao: string
  }>
}

export interface UpdateAcervoInput extends CreateAcervoInput {}
