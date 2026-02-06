export interface Item {
  id: string;
  acervo_id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_executado: number;
  data_execucao: string;
  categoria?: string;
  created_at: string;
}

export interface CreateItemInput {
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_executado: number;
  data_execucao: string;
  categoria?: string;
}

export interface UpdateItemInput extends CreateItemInput {}
