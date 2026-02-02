import type { EmpresaInput } from "@/lib/validations/empresa";

export interface Empresa extends EmpresaInput {
  id: string;
  created_at: string;
  updated_at?: string;
  workspace_id: string;
}

export type CreateEmpresaInput = EmpresaInput;
export type UpdateEmpresaInput = Partial<EmpresaInput>;
