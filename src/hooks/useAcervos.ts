import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { acervoService, type AcervosFilters } from "@/services/acervoService";
import type { Acervo } from "@/types/acervo";

export function useAcervos(filters?: AcervosFilters) {
  const { user } = useAuth();
  const [acervos, setAcervos] = useState<Acervo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.workspace_id) {
      setLoading(false);
      return;
    }

    const loadAcervos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await acervoService.list(user.workspace_id!, filters);
        setAcervos(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar acervos",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAcervos();
  }, [user?.workspace_id, filters]);

  return {
    acervos,
    loading,
    error,
    refetch: () => {
      if (user?.workspace_id) {
        acervoService
          .list(user.workspace_id!, filters)
          .then(setAcervos)
          .catch(setError);
      }
    },
  };
}
