import { z } from "zod"

export const itemSchema = z.object({
  descricao: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  unidade: z.string().min(1, "Unidade é obrigatória").max(50),
  quantidade: z.number().min(0, "Quantidade deve ser maior ou igual a zero"),
  valor_executado: z.number().min(0, "Valor executado deve ser maior ou igual a zero"),
  data_execucao: z.string().min(1, "Data de execução é obrigatória"),
})

export type ItemInput = z.infer<typeof itemSchema>
