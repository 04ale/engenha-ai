import type { Obra, CreateObraInput, UpdateObraInput } from "@/types/obra"
import { mockObras, mockDataHelpers } from "@/lib/mockData"

export interface ObrasFilters {
  cidade?: string
  estado?: string
  search?: string
}

// Simular delay de API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const obraService = {
  async list(workspaceId: string, filters?: ObrasFilters): Promise<Obra[]> {
    await delay(500) // Simular delay de rede

    let obras = [...mockObras] // Criar cópia do array

    if (filters?.cidade) {
      obras = obras.filter((obra) =>
        obra.cidade.toLowerCase().includes(filters.cidade!.toLowerCase())
      )
    }

    if (filters?.estado) {
      obras = obras.filter((obra) =>
        obra.estado.toLowerCase() === filters.estado!.toLowerCase()
      )
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      obras = obras.filter(
        (obra) =>
          obra.descricao_obra.toLowerCase().includes(searchLower) ||
          obra.numero_contrato?.toLowerCase().includes(searchLower)
      )
    }

    return obras.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  async getById(id: string, workspaceId: string): Promise<Obra | null> {
    await delay(300)
    return mockObras.find((obra) => obra.id === id) || null
  },

  async create(
    input: CreateObraInput,
    userId: string,
    workspaceId: string,
    engenheiroId: string,
    empresaId: string
  ): Promise<Obra> {
    await delay(800)
    const newObra: Obra = {
      id: `obra-${Date.now()}`,
      empresa_id: empresaId,
      engenheiro_id: engenheiroId,
      workspace_id: workspaceId,
      created_by: userId,
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockDataHelpers.addObra(newObra)
    return newObra
  },

  async update(
    id: string,
    input: UpdateObraInput,
    workspaceId: string
  ): Promise<Obra> {
    await delay(600)
    const obra = mockObras.find((obra) => obra.id === id)
    if (!obra) {
      throw new Error("Obra não encontrada")
    }
    const updatedObra = {
      ...obra,
      ...input,
      updated_at: new Date().toISOString(),
    }
    mockDataHelpers.updateObra(id, updatedObra)
    return updatedObra
  },

  async delete(id: string, workspaceId: string): Promise<void> {
    await delay(400)
    mockDataHelpers.removeObra(id)
  },
}
