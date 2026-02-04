import { z } from "zod";

export const registerSchema = z
  .object({
    nome_completo: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Senha deve conter letras e números"),
    confirmar_senha: z.string(),
    crea: z.string().min(1, "CREA é obrigatório"),
    telefone: z.string().optional(),
  })
  .refine((data) => data.senha === data.confirmar_senha, {
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
  lembrar_me: z.boolean().optional(),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordConfirmSchema = z
  .object({
    codigo: z.string().length(6, "Código deve ter 6 dígitos"),
    nova_senha: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Senha deve conter letras e números"),
    confirmar_senha: z.string(),
  })
  .refine((data) => data.nova_senha === data.confirmar_senha, {
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
  });

export const profileSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  crea: z.string().min(1, "CREA é obrigatório"),
  telefone: z.string().optional(),
  avatar_url: z.string().optional(),
  avatar_nome: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;
export type ResetPasswordConfirmInput = z.infer<
  typeof resetPasswordConfirmSchema
>;
export type ProfileInput = z.infer<typeof profileSchema>;
