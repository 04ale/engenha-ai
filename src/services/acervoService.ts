import type {
  Acervo,
  CreateAcervoInput,
  UpdateAcervoInput,
} from "@/types/acervo";
import { supabase } from "@/lib/supabase/client";
import { storageService } from "./storageService";

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

  async listByObra(obraId: string, workspaceId: string): Promise<Acervo[]> {
    const { data, error } = await supabase
      .from("acervos")
      .select("*, itens:acervo_itens(*)")
      .eq("obra_id", obraId)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("Erro ao listar acervos da obra:", error);
      throw new Error("Erro ao carregar acervos da obra");
    }

    return data || [];
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

    // 3. Sincronizar categorias da Obra se houver obra vinculada
    if (newAcervo.obra_id) {
      await this.syncObraCategorias(newAcervo.obra_id, workspaceId);
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

    // 3. Sincronizar categorias da Obra se houver obra vinculada
    const currentAcervo = await this.getById(id, workspaceId);
    if (currentAcervo?.obra_id) {
      await this.syncObraCategorias(currentAcervo.obra_id, workspaceId);
    }

    return currentAcervo as Acervo;
  },

  async delete(id: string, workspaceId: string): Promise<void> {
    // 1. Buscar o acervo para verificar se tem arquivo
    const acervo = await this.getById(id, workspaceId);

    if (acervo?.arquivo_cat_nome) {
      try {
        // Reconstruir o caminho do arquivo
        const fileExt = acervo.arquivo_cat_nome.split(".").pop();
        if (fileExt) {
          const fileName = `${id}.${fileExt}`;
          const filePath = `${workspaceId}/${id}/${fileName}`;

          await storageService.deleteFile(filePath);
        }
      } catch (error) {
        console.error("Erro ao tentar excluir arquivo do storage:", error);
        // Não lançar erro aqui para não impedir a exclusão do registro,
        // mas logar para auditoria. O usuário não precisa saber de falha de limpeza de arquivo
        // se o objetivo principal (excluir o acervo) for cumprido.
      }
    }

    // 2. Deletar do banco
    const { error } = await supabase
      .from("acervos")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("Erro ao deletar acervo:", error);

      // Tratamento de erro específico para FK
      if (error.code === "23503") {
        throw new Error(
          "Não é possível excluir este acervo pois ele possui registros dependentes (como itens de acervo). Remova os itens primeiro ou contate o suporte.",
        );
      }

      throw new Error(`Erro ao deletar acervo: ${error.message}`);
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

    if (currentAcervo.obra_id) {
      await this.syncObraCategorias(currentAcervo.obra_id, workspaceId);
    }

    return (await this.getById(acervoId, workspaceId)) as Acervo;
  },

  async syncObraCategorias(obraId: string, workspaceId: string): Promise<void> {
    if (!obraId) return;

    try {
      // 1. Buscar todos os acervos desta obra
      const { data: acervos, error: acervosError } = await supabase
        .from("acervos")
        .select("id")
        .eq("obra_id", obraId)
        .eq("workspace_id", workspaceId);

      if (acervosError) {
        console.error(
          "Erro ao sincronizar categorias (buscar acervos):",
          acervosError,
        );
        return;
      }

      if (!acervos || acervos.length === 0) return;

      const acervoIds = acervos.map((a) => a.id);

      // 2. Buscar itens destes acervos
      const { data: itens, error: itensError } = await supabase
        .from("acervo_itens")
        .select("categoria")
        .in("acervo_id", acervoIds);

      if (itensError) {
        console.error(
          "Erro ao sincronizar categorias (buscar itens):",
          itensError,
        );
        return;
      }

      // 3. Extrair categorias únicas e não nulas
      const categorias = Array.from(
        new Set(
          itens
            ?.map((i: any) => i.categoria)
            .filter((c: any) => c && typeof c === "string" && c.trim() !== ""),
        ),
      ).sort();

      // 4. Atualizar Obra
      const { error: updateError } = await supabase
        .from("obras")
        .update({ categorias })
        .eq("id", obraId);

      if (updateError) {
        console.error("Erro ao atualizar categorias da obra:", updateError);
      }
    } catch (error) {
      console.error("Erro desconhecido ao sincronizar categorias:", error);
    }
  },
};
