import { z } from "zod";
import { itemSchema } from "./item";

export const acervoSchema = z.object({
  obra_id: z.string().optional(),
  descricao_obra: z
    .string()
    .min(3, "Descrição deve ter no mínimo 3 caracteres"),
  finalidade: z.string().optional(),
  observacoes: z.string().optional(),
  cidade: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres").max(255),
  estado: z.string().min(2, "Estado deve ter no mínimo 2 caracteres").max(255),
  endereco_obra: z.string().optional(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_conclusao: z.string().min(1, "Data de conclusão é obrigatória"),

  contratante_nome: z
    .string()
    .min(3, "Nome do contratante deve ter no mínimo 3 caracteres"),
  contratante_tipo: z.enum([
    "pessoa_fisica",
    "pessoa_juridica",
    "orgao_publico",
  ]),
  contratante_cnpj: z.string().min(11, "CPF/CNPJ inválido"),

  numero_contrato: z.string().min(1, "Número do contrato é obrigatório"),
  valor_total: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  numero_art: z.string().min(1, "Número da ART é obrigatório"),
  tipo_art: z.string().min(1, "Tipo de ART é obrigatório"),
  data_art_registro: z.string().min(1, "Data de registro é obrigatória"),
  data_art_baixa: z.string().min(1, "Data de baixa é obrigatória"),
  acervo_tipo: z.string().min(1, "Tipo de acervo é obrigatório"),
  nome_fantasia: z.string().optional(),
  arquivo_cat_url: z.string().optional(),
  arquivo_cat_nome: z.string().max(255).optional(),
  itens: z.array(itemSchema).optional(),
});

export type AcervoInput = z.infer<typeof acervoSchema>;
