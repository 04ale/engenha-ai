import { z } from "zod";

export const empresaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cnpj: z.string(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
