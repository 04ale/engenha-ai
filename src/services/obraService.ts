import type { Obra, CreateObraInput, UpdateObraInput } from "@/types/obra";
import { supabase } from "@/lib/supabase/client";

export interface ObrasFilters {
  cidade?: string;
  estado?: string;
  search?: string;
}

export const obraService = {
  async list(workspaceId: string, filters?: ObrasFilters): Promise<Obra[]> {
    let query = supabase
      .from("obras")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (filters?.cidade) {
      query = query.ilike("cidade", `%${filters.cidade}%`);
    }

    if (filters?.estado) {
      query = query.eq("estado", filters.estado);
    }

    if (filters?.search) {
      query = query.or(
        `descricao_obra.ilike.%${filters.search}%,numero_contrato.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao listar obras:", error);
      throw new Error("Erro ao carregar obras");
    }

    return data || [];
  },

  async getById(id: string, workspaceId: string): Promise<Obra | null> {
    const { data, error } = await supabase
      .from("obras")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) {
      console.error("Erro ao buscar obra:", error);
      return null;
    }

    return data;
  },

  async create(
    input: CreateObraInput,
    userId: string,
    workspaceId: string,
    engenheiroId: string,
    empresaId: string,
  ): Promise<Obra> {
    const { data, error } = await supabase
      .from("obras")
      .insert({
        empresa_id: empresaId,
        engenheiro_id: engenheiroId,
        workspace_id: workspaceId,
        created_by: userId,
        ...input,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar obra:", error);
      throw new Error("Erro ao criar obra");
    }

    return data;
  },

  async update(
    id: string,
    input: UpdateObraInput,
    workspaceId: string,
  ): Promise<Obra> {
    const { data, error } = await supabase
      .from("obras")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar obra:", error);
      throw new Error("Erro ao atualizar obra");
    }

    return data;
  },

  async delete(id: string, workspaceId: string): Promise<void> {
    const { error } = await supabase
      .from("obras")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("Erro ao deletar obra:", error);
      throw new Error("Erro ao deletar obra");
    }
  },
};
