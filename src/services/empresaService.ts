import { supabase } from "@/lib/supabase/client";
import type {
  Empresa,
  CreateEmpresaInput,
  UpdateEmpresaInput,
} from "@/types/empresa";

export const empresaService = {
  async list(workspaceId: string): Promise<Empresa[]> {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar empresas:", error);
      throw new Error("Erro ao carregar empresas");
    }

    return data || [];
  },

  async getById(id: string, workspaceId: string): Promise<Empresa | null> {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) {
      console.error("Erro ao buscar empresa:", error);
      return null;
    }

    return data;
  },

  async create(
    data: CreateEmpresaInput,
    workspaceId: string,
    userId: string,
  ): Promise<Empresa> {
    const { data: empresa, error } = await supabase
      .from("empresas")
      .insert({
        ...data,
        workspace_id: workspaceId,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar empresa:", error);
      throw new Error("Erro ao criar empresa");
    }

    return empresa;
  },

  async update(
    id: string,
    data: UpdateEmpresaInput,
    workspaceId: string,
  ): Promise<Empresa> {
    const { data: empresa, error } = await supabase
      .from("empresas")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw new Error("Erro ao atualizar empresa");
    }

    return empresa;
  },

  async delete(id: string, workspaceId: string): Promise<void> {
    const { error } = await supabase
      .from("empresas")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("Erro ao excluir empresa:", error);
      throw new Error("Erro ao excluir empresa");
    }
  },
};
