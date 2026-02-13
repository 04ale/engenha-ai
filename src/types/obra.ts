export interface Obra {
  id: string;
  empresa_id: string;
  engenheiro_id: string;
  workspace_id: string;
  created_by: string;
  descricao_obra: string;
  finalidade?: string | null;
  observacoes?: string | null;
  cidade: string;
  estado: string;
  endereco_obra?: string | null;
  data_inicio: string;
  data_conclusao?: string | null;
  contratante_nome?: string | null;
  contratante_tipo?:
    | "pessoa_fisica"
    | "pessoa_juridica"
    | "orgao_publico"
    | null;
  contratante_cnpj?: string | null;
  numero_contrato?: string | null;
  valor_total?: number | null;
  created_at: string;
  updated_at: string;
  is_public?: boolean | null;
  categorias?: string[] | null;
}

export interface CreateObraInput {
  descricao_obra: string;
  finalidade?: string;
  observacoes?: string;
  cidade: string;
  estado: string;
  endereco_obra?: string;
  data_inicio: string;
  data_conclusao?: string;
  contratante_nome?: string;
  contratante_tipo?: "pessoa_fisica" | "pessoa_juridica" | "orgao_publico";
  contratante_cnpj?: string;
  numero_contrato?: string;
  valor_total?: number;
}

export interface UpdateObraInput extends CreateObraInput {}
