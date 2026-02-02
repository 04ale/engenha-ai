import { supabase } from "@/lib/supabase/client"

export const storageService = {
  async uploadCAT(
    file: File,
    workspaceId: string,
    acervoId: string
  ): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split(".").pop()
    const fileName = `${acervoId}.${fileExt}`
    const filePath = `${workspaceId}/${acervoId}/${fileName}`

    const { error } = await supabase.storage
      .from("cats")
      .upload(filePath, file, {
        upsert: true,
      })

    if (error) {
      console.error("Erro no upload:", error)
      throw new Error("Erro ao fazer upload do arquivo")
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("cats").getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath,
    }
  },

  async getSignedUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from("cats")
      .createSignedUrl(filePath, 60 * 60) // 1 hora

    if (error) {
      console.error("Erro ao gerar URL assinada:", error)
      throw new Error("Erro ao gerar link do arquivo")
    }

    return data.signedUrl
  },

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from("cats").remove([filePath])

    if (error) {
      console.error("Erro ao deletar arquivo:", error)
      throw new Error("Erro ao deletar arquivo")
    }
  },
}
