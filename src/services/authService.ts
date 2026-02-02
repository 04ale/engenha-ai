import { supabase } from "@/lib/supabase/client";
import type {
  RegisterInput,
  LoginInput,
  ResetPasswordRequestInput,
  ResetPasswordConfirmInput,
} from "@/lib/validations/auth";

export interface User {
  id: string;
  email: string;
  nome_completo: string;
  workspace_id: string;
  crea?: string;
  telefone?: string;
}

const STORAGE_KEY = "app_user";

export const authService = {
  async register(
    data: RegisterInput,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // 1. Criar usuário no Auth (Passando os metadados para a Trigger usar)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            nome_completo: data.nome_completo,
            crea: data.crea,
            telefone: data.telefone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      let userProfile = null;

      if (authData.session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*, workspaces(*)")
          .eq("id", authData.user.id)
          .single();

        if (!profileError && profileData) {
          userProfile = {
            id: authData.user.id,
            email: data.email,
            nome_completo: profileData.nome_completo,
            workspace_id: profileData.workspace_id,
            crea: profileData.crea,
            telefone: profileData.telefone,
          };

          // Salvar no localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
        }
      }

      return { user: userProfile, error: null };
    } catch (error: any) {
      console.error("Erro no registro:", error);
      return {
        user: null,
        error: error.message || "Erro ao registrar usuário",
      };
    }
  },

  async login(
    data: LoginInput,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // 1. Login no Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.senha,
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao autenticar");

      // 2. Buscar dados do profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        nome_completo: profileData.nome_completo,
        workspace_id: profileData.workspace_id,
        crea: profileData.crea,
        telefone: profileData.telefone,
      };

      // Atualizar localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || "Erro ao fazer login" };
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
  },

  async requestPasswordReset(
    data: ResetPasswordRequestInput,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    return { error: error?.message || null };
  },

  async confirmPasswordReset(
    data: ResetPasswordConfirmInput,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      password: data.nova_senha,
    });
    return { error: error?.message || null };
  },

  async getCurrentUser(): Promise<User | null> {
    // 1. Tentar recuperar do localStorage (stratégia cache-first como solicitado)
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      return JSON.parse(savedUser);
    }

    // 2. Fallback: Se não houver no storage, tentar recuperar da sessão ativa do Supabase
    // Isso é útil se o usuário limpar o cache ou abrir uma nova aba já logado
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // Buscar profile se tiver sessão
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        nome_completo: profile.nome_completo,
        workspace_id: profile.workspace_id,
        crea: profile.crea,
        telefone: profile.telefone,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    return null;
  },
};
