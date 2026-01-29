import type { Acervo, CreateAcervoInput, UpdateAcervoInput } from "@/types/acervo"
import { mockAcervos, mockItens, mockDataHelpers } from "@/lib/mockData"

export interface AcervosFilters {
  tipo?: string
  cidade?: string
  estado?: string
  obra_id?: string
  search?: string
}

// Simular delay de API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const acervoService = {
  async list(workspaceId: string, filters?: AcervosFilters): Promise<Acervo[]> {
    await delay(500)

    let acervos = [...mockAcervos].map((acervo) => ({
      ...acervo,
      itens: mockItens[acervo.id] || [],
    })) // Criar cópia do array

    if (filters?.tipo) {
      acervos = acervos.filter((acervo) => acervo.acervo_tipo === filters.tipo)
    }

    if (filters?.cidade) {
      acervos = acervos.filter((acervo) =>
        acervo.cidade.toLowerCase().includes(filters.cidade!.toLowerCase())
      )
    }

    if (filters?.estado) {
      acervos = acervos.filter((acervo) =>
        acervo.estado.toLowerCase() === filters.estado!.toLowerCase()
      )
    }

    if (filters?.obra_id) {
      acervos = acervos.filter((acervo) => acervo.obra_id === filters.obra_id)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      acervos = acervos.filter(
        (acervo) =>
          acervo.descricao_obra.toLowerCase().includes(searchLower) ||
          acervo.numero_art?.toLowerCase().includes(searchLower) ||
          acervo.numero_contrato?.toLowerCase().includes(searchLower)
      )
    }

    return acervos.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  async getById(id: string, workspaceId: string): Promise<Acervo | null> {
    await delay(300)
    const acervo = mockAcervos.find((acervo) => acervo.id === id)
    if (!acervo) return null

    return {
      ...acervo,
      itens: mockItens[id] || [],
    }
  },

  async create(
    input: CreateAcervoInput,
    userId: string,
    workspaceId: string,
    engenheiroId: string,
    empresaId: string
  ): Promise<Acervo> {
    await delay(800)
    const { itens, ...acervoData } = input
    const newId = `acervo-${Date.now()}`
    
    const newAcervo: Acervo = {
      id: newId,
      empresa_id: empresaId,
      engenheiro_id: engenheiroId,
      workspace_id: workspaceId,
      created_by: userId,
      ...acervoData,
      obra_id: acervoData.obra_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      itens: [],
    }

    if (itens && itens.length > 0) {
      const itensCompletos = itens.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        acervo_id: newId,
        ...item,
        created_at: new Date().toISOString(),
      }))
      mockDataHelpers.setItens(newId, itensCompletos)
      newAcervo.itens = itensCompletos
    }

    mockDataHelpers.addAcervo(newAcervo)
    return newAcervo
  },

  async update(
    id: string,
    input: UpdateAcervoInput,
    workspaceId: string
  ): Promise<Acervo> {
    await delay(600)
    const acervo = mockAcervos.find((acervo) => acervo.id === id)
    if (!acervo) {
      throw new Error("Acervo não encontrado")
    }

    const { itens, ...acervoData } = input

    const updatedAcervo: Acervo = {
      ...acervo,
      ...acervoData,
      updated_at: new Date().toISOString(),
    }

    if (itens !== undefined) {
      const itensCompletos = itens.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        acervo_id: id,
        ...item,
        created_at: new Date().toISOString(),
      }))
      mockDataHelpers.setItens(id, itensCompletos)
      updatedAcervo.itens = itensCompletos
    }

    mockDataHelpers.updateAcervo(id, updatedAcervo)
    return updatedAcervo
  },

  async delete(id: string, workspaceId: string): Promise<void> {
    await delay(400)
    mockDataHelpers.removeAcervo(id)
  },

  async addItems(
    acervoId: string,
    items: Array<{
      descricao: string
      unidade: string
      quantidade: number
      valor_executado: number
      data_execucao: string
    }>,
    workspaceId: string
  ): Promise<Acervo> {
    await delay(600)
    const acervo = mockAcervos.find((acervo) => acervo.id === acervoId)
    if (!acervo) {
      throw new Error("Acervo não encontrado")
    }

    const existingItens = mockItens[acervoId] || []
    const newItens = items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      acervo_id: acervoId,
      ...item,
      created_at: new Date().toISOString(),
    }))

    const allItens = [...existingItens, ...newItens]
    mockDataHelpers.setItens(acervoId, allItens)

    const updatedAcervo: Acervo = {
      ...acervo,
      itens: allItens,
      updated_at: new Date().toISOString(),
    }

    mockDataHelpers.updateAcervo(acervoId, updatedAcervo)
    return updatedAcervo
  },
}
