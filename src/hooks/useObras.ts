import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { obraService, type ObrasFilters } from "@/services/obraService";
import type { Obra } from "@/types/obra";

export function useObras(filters?: ObrasFilters) {
  const { user } = useAuth();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.workspace_id) {
      setLoading(false);
      return;
    }

    const loadObras = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await obraService.list(user.workspace_id, filters);
        setObras(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar obras");
      } finally {
        setLoading(false);
      }
    };

    loadObras();
  }, [user?.workspace_id, filters]);

  return {
    obras,
    loading,
    error,
    refetch: () => {
      if (user?.workspace_id) {
        obraService
          .list(user.workspace_id, filters)
          .then(setObras)
          .catch(setError);
      }
    },
    deleteObra: async (id: string) => {
      if (!user?.workspace_id) return;
      await obraService.delete(id, user.workspace_id);
      setObras((prev) => prev.filter((o) => o.id !== id));
    },
  };
}
