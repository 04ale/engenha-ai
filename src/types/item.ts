export interface Item {
  id: string;
  acervo_id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_executado: number;
  data_execucao: string;
  categoria?: string;
  fonte?: string;
  codigo?: string;
}

export interface CreateItemInput {
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_executado: number;
  data_execucao: string;
  categoria?: string;
  fonte?: string;
  codigo?: string;
}

export interface UpdateItemInput extends CreateItemInput {}
