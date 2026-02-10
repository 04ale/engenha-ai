import { z } from "zod"

export const obraSchema = z.object({
  descricao_obra: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  finalidade: z.string().optional(),
  observacoes: z.string().optional(),
  cidade: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres").max(255),
  estado: z.string().min(2, "Estado deve ter no mínimo 2 caracteres").max(255),
  endereco_obra: z.string().optional(),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_conclusao: z.string().min(1, "Data de conclusão é obrigatória"),
  contratante_nome: z.string().min(3, "Nome do contratante deve ter no mínimo 3 caracteres"),
  contratante_tipo: z.enum(["pessoa_fisica", "pessoa_juridica", "orgao_publico"]),
  contratante_cnpj: z.string().min(11, "CPF/CNPJ inválido"),
  numero_contrato: z.string().min(1, "Número do contrato é obrigatório"),
  valor_total: z.union([z.string(), z.number()]).transform((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const items = Number(val);
    return isNaN(items) ? undefined : items;
  }).refine((val) => val !== undefined, { message: "Valor total é obrigatório" }),
})

export type ObraInput = z.infer<typeof obraSchema>
