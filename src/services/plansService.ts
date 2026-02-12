import { supabase } from "@/lib/supabase/client";

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
            .from('planos')
            .select('*')
            .order('price', { ascending: true });

        if (error) {
            console.error("Error fetching plans:", error);
            throw error;
        }
        return data.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price),
            features: plan.features,
            isPopular: plan.is_popular,
        }));
    }
}