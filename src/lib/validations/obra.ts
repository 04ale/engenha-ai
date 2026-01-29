import { z } from "zod"

export const obraSchema = z.object({
  descricao_obra: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  finalidade: z.string().optional(),
  observacoes: z.string().optional(),
  cidade: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres").max(255),
  estado: z.string().min(2, "Estado deve ter no mínimo 2 caracteres").max(255),
  endereco_obra: z.string().optional(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_conclusao: z.string().optional(),
  contratante_nome: z.string().max(255).optional(),
  contratante_tipo: z.enum(["pessoa_fisica", "pessoa_juridica", "orgao_publico"]).optional(),
  contratante_cnpj: z.string().max(255).optional(),
  numero_contrato: z.string().max(255).optional(),
  valor_total: z.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
})

export type ObraInput = z.infer<typeof obraSchema>
