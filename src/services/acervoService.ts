import type {
  Acervo,
  CreateAcervoInput,
  UpdateAcervoInput,
} from "@/types/acervo";
import { supabase } from "@/lib/supabase/client";

export interface AcervosFilters {
  tipo?: string;
  cidade?: string;
  estado?: string;
  obra_id?: string;
  search?: string;
}

export const acervoService = {
  async list(workspaceId: string, filters?: AcervosFilters): Promise<Acervo[]> {
    let query = supabase
      .from("acervos")
      .select("*, itens:acervo_itens(*)")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (filters?.tipo) {
      query = query.eq("acervo_tipo", filters.tipo);
    }

    if (filters?.cidade) {
      query = query.ilike("cidade", `%${filters.cidade}%`);
    }

    if (filters?.estado) {
      query = query.eq("estado", filters.estado);
    }

    if (filters?.obra_id) {
      query = query.eq("obra_id", filters.obra_id);
    }

    if (filters?.search) {
      query = query.or(
        `descricao_obra.ilike.%${filters.search}%,numero_art.ilike.%${filters.search}%,numero_contrato.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao listar acervos:", error);
      throw new Error("Erro ao carregar acervos");
    }

    return data || [];
  },

  async getById(id: string, workspaceId: string): Promise<Acervo | null> {
    const { data, error } = await supabase
      .from("acervos")
      .select("*, itens:acervo_itens(*)")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) {
      console.error("Erro ao buscar acervo:", error);
      return null;
    }

    return data;
  },

  async create(
    input: CreateAcervoInput,
    userId: string,
    workspaceId: string,
    engenheiroId: string,
    empresaId: string,
  ): Promise<Acervo> {
    const { itens, ...acervoData } = input;

    // 1. Criar Acervo
    const { data: newAcervo, error: acervoError } = await supabase
      .from("acervos")
      .insert({
        empresa_id: empresaId,
        engenheiro_id: engenheiroId,
        workspace_id: workspaceId,
        created_by: userId,
        ...acervoData,
        obra_id: acervoData.obra_id || null, // Ensure explicit null if undefined
      })
      .select()
      .single();

    if (acervoError) {
      console.error("Erro ao criar acervo:", acervoError);
      throw new Error("Erro ao criar acervo");
    }

    // 2. Inserir Itens se houver
    if (itens && itens.length > 0) {
      // Buscar o ID real do engenheiro na tabela 'engenheiros' usando o user_id (created_by)
      const { data: engenheiroData, error: engenheiroError } = await supabase
        .from("engenheiros")
        .select("id")
        .eq("created_by", userId) // O usuário que está criando é o dono do perfil de engenheiro
        .single();

      if (engenheiroError || !engenheiroData) {
        console.error("Erro ao buscar engenheiro:", engenheiroError);
        // Não falhar a criação do acervo, mas não inserir itens ou avisar?
        // Para consistência, se falhar aqui, os itens não terão fk válida.
        // Vamos logar e tentar inserir (vai falhar se fk for estrita) ou lançar erro.
        // Melhor lançar erro para feedback visual.
        throw new Error("Engenheiro não encontrado para este usuário.");
      }

      const itensToInsert = itens.map((item) => ({
        acervo_id: newAcervo.id,
        engenheiro_id: engenheiroData.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from("acervo_itens")
        .insert(itensToInsert);

      if (itemsError) {
        console.error("Erro ao criar itens do acervo:", itemsError);
      }
    }

    // Retornar acervo completo
    return (await this.getById(newAcervo.id, workspaceId)) as Acervo;
  },

  async update(
    id: string,
    input: UpdateAcervoInput,
    workspaceId: string,
  ): Promise<Acervo> {
    const { itens, ...acervoData } = input;

    // 1. Atualizar dados do Acervo
    const { error: acervoError } = await supabase
      .from("acervos")
      .update({
        ...acervoData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (acervoError) {
      console.error("Erro ao atualizar acervo:", acervoError);
      throw new Error("Erro ao atualizar acervo");
    }

    // 2. Atualizar itens se fornecidos (Substituição completa)
    if (itens !== undefined) {
      // Remover itens antigos
      const { error: deleteError } = await supabase
        .from("acervo_itens")
        .delete()
        .eq("acervo_id", id);

      if (deleteError) throw deleteError;

      // Inserir novos itens
      if (itens.length > 0) {
        // Buscar engenheiro_id do acervo atual para garantir integridade
        const currentAcervo = await this.getById(id, workspaceId);
        if (!currentAcervo) {
          throw new Error("Acervo não encontrado para atualizar itens");
        }

        // Buscar o ID real do engenheiro com base no criador do acervo
        const { data: engenheiroData, error: engenheiroError } = await supabase
          .from("engenheiros")
          .select("id")
          .eq("created_by", currentAcervo.created_by)
          .single();

        if (engenheiroError || !engenheiroData) {
          throw new Error("Engenheiro responsável pelo acervo não encontrado.");
        }

        const itensToInsert = itens.map((item) => ({
          acervo_id: id,
          engenheiro_id: engenheiroData.id,
          ...item,
        }));

        const { error: insertError } = await supabase
          .from("acervo_itens")
          .insert(itensToInsert);

        if (insertError) throw insertError;
      }
    }

    return (await this.getById(id, workspaceId)) as Acervo;
  },

  async delete(id: string, workspaceId: string): Promise<void> {
    const { error } = await supabase
      .from("acervos")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("Erro ao deletar acervo:", error);
      throw new Error("Erro ao deletar acervo");
    }
  },

  async addItems(
    acervoId: string,
    items: Array<{
      descricao: string;
      unidade: string;
      quantidade: number;
      valor_executado: number;
      data_execucao: string;
    }>,
    workspaceId: string,
  ): Promise<Acervo> {
    // Buscar acervo para obter o engenheiro_id
    const currentAcervo = await this.getById(acervoId, workspaceId);
    if (!currentAcervo) {
      throw new Error("Acervo não encontrado");
    }

    // Buscar o ID real do engenheiro
    const { data: engenheiroData, error: engenheiroError } = await supabase
      .from("engenheiros")
      .select("id")
      .eq("created_by", currentAcervo.created_by)
      .single();

    if (engenheiroError || !engenheiroData) {
      console.error("Erro ao buscar engenheiro:", engenheiroError);
      throw new Error(
        "O engenheiro responsável pelo acervo não foi encontrado no cadastro. Verifique se o perfil de engenheiro está criado.",
      );
    }

    const itensToInsert = items.map((item) => ({
      acervo_id: acervoId,
      engenheiro_id: engenheiroData.id,
      ...item,
    }));

    const { error } = await supabase.from("acervo_itens").insert(itensToInsert);

    if (error) {
      console.error("Erro ao adicionar itens:", error);
      if (error.code === "23503") {
        throw new Error(
          "Violação de integridade: Engenheiro inválido ou não encontrado na tabela de referência.",
        );
      }
      throw new Error("Erro ao adicionar itens");
    }

    // Atualizar timestamp do acervo (opcional, mas boa prática)
    await supabase
      .from("acervos")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", acervoId);

    return (await this.getById(acervoId, workspaceId)) as Acervo;
  },
};
