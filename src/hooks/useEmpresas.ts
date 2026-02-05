import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { empresaService } from "@/services/empresaService";
import type { Empresa } from "@/types/empresa";

export function useEmpresas() {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.workspace_id) {
      setLoading(false);
      return;
    }

    const loadEmpresas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await empresaService.list(user.workspace_id!);
        setEmpresas(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar empresas",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmpresas();
  }, [user?.workspace_id]);

  return {
    empresas,
    loading,
    error,
    refetch: async () => {
      if (user?.workspace_id) {
        try {
          setLoading(true);
          setError(null);
          const data = await empresaService.list(user.workspace_id);
          setEmpresas(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Erro ao recarregar empresas",
          );
        } finally {
          setLoading(false);
        }
      }
    },
    deleteEmpresa: async (id: string) => {
      if (user?.workspace_id) {
        await empresaService.delete(id, user.workspace_id);
        setEmpresas((prev) => prev.filter((item) => item.id !== id));
      }
    },
  };
}
