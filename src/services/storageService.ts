// Simular delay de API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const storageService = {
  async uploadCAT(
    file: File,
    workspaceId: string,
    acervoId: string
  ): Promise<{ url: string; path: string }> {
    await delay(1000) // Simular upload

    // Criar URL de objeto local para preview
    const objectUrl = URL.createObjectURL(file)
    const filePath = `${workspaceId}/${acervoId}-${Date.now()}-${file.name}`

    // Em produção, isso seria a URL do Supabase Storage
    return {
      url: objectUrl,
      path: filePath,
    }
  },

  async getSignedUrl(filePath: string): Promise<string> {
    await delay(300)
    // Simular signed URL
    return `https://example.com/storage/${filePath}`
  },

  async deleteFile(_filePath: string): Promise<void> {
    await delay(200)
    // Simular deleção
  },
}
