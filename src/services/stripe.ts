import { supabase } from "../lib/supabase/client";

export async function checkout(priceId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const returnUrl = window.location.origin + "/app/pagamento-retorno";

  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: {
      priceId,
      successUrl: `${returnUrl}?success=true`,
      cancelUrl: `${returnUrl}?canceled=true`,
    },
  });

  if (error) {
    console.error("Erro ao iniciar checkout:", error);
    throw new Error("Erro ao conectar com o pagamento");
  }

  if (data?.url) {
    window.location.href = data.url;
  }
}
