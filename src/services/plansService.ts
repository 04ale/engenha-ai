import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular: boolean;
}

export const plansService = {
  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from("planos")
      .select("*")
      .order("price", { ascending: true });

    if (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
    return data.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(plan.price),
      features: plan.features,
      isPopular: plan.is_popular,
    }));
  },

  cancelSubscription() {
    toast("Cancelar assinatura?", {
      description: "Tem certeza que deseja cancelar a renovação automática?",
      action: {
        label: "Sim, cancelar",
        onClick: async () => {
          const { error } = await supabase.functions.invoke("cancel-plan");
          if (error) {
            toast.error("Erro ao cancelar: " + error.message);
          } else {
            toast.success(
              "Assinatura cancelada! Você ainda tem acesso até o fim do mês.",
            );
            window.location.reload();
          }
        },
      },
      cancel: {
        label: "Voltar",
        onClick: () => {},
      },
    });
  },
};
