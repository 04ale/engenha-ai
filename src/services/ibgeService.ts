export interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGEMunicipio {
  id: number;
  nome: string;
}

export const ibgeService = {
  async getEstados(): Promise<IBGEUF[]> {
    try {
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
      );
      if (!response.ok) throw new Error("Erro ao buscar estados");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar estados:", error);
      return [];
    }
  },

  async getMunicipios(ufSigla: string): Promise<IBGEMunicipio[]> {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios`,
      );
      if (!response.ok) throw new Error("Erro ao buscar municípios");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar municípios:", error);
      return [];
    }
  },
};
