import { supabase } from "@/lib/supabase/client";
import { translateAuthError } from "@/utils/errorTranslator";
import type {
  RegisterInput,
  LoginInput,
  ProfileInput,
  ResetPasswordConfirmInput,
  ResetPasswordRequestInput,
} from "@/lib/validations/auth";

export interface User {
  id: string;
  email: string;
  nome_completo: string;
  workspace_id?: string;
  crea?: string;
  telefone?: string;
  avatar_url?: string;
  avatar_nome?: string;
  is_public?: boolean;
}

export const authService = {
  // --- LOGIN ---
  async login(
    data: LoginInput,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.senha,
      });

      if (authError) throw authError;

      // Busca dados frescos
      const user = await this.getCurrentUser();
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: translateAuthError(error.message) };
    }
  },

  // --- GOOGLE LOGIN ---
  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Redireciona para o painel após o Google dar o OK
        redirectTo: `${window.location.origin}/app/dashboard`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    // Nota: O Google vai redirecionar o navegador para fora do seu site.
    // O retorno dessa função só acontece se der erro antes de sair.
    if (error) return { error: translateAuthError(error.message) };

    return { data, error: null };
  },

  // --- REGISTER ---
  async register(
    data: RegisterInput,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            nome_completo: data.nome_completo,
            crea: data.crea,
            telefone: data.telefone,
            is_public: false,
          },
        },
      });

      if (authError) throw authError;

      // Retorna usuário provisório (sem salvar no storage manual)
      return {
        user: {
          id: authData.user?.id!,
          email: data.email,
          nome_completo: data.nome_completo,
          workspace_id: undefined,
          is_public: false,
        },
        error: null,
      };
    } catch (error: any) {
      return { user: null, error: translateAuthError(error.message) };
    }
  },

  // --- LOGOUT ---
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async requestPasswordReset(
    data: ResetPasswordRequestInput,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    return { error: error?.message ? translateAuthError(error.message) : null };
  },

  async confirmPasswordReset(
    data: ResetPasswordConfirmInput,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      password: data.nova_senha,
    });
    return { error: error?.message ? translateAuthError(error.message) : null };
  },

  // --- GET CURRENT USER (A Limpeza) ---
  async getCurrentUser(): Promise<User | null> {
    try {
      // 1. Pergunta pro Supabase: "A sessão é válida?"
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      // Se não tem sessão ou deu erro, o usuário NÃO está logado. Ponto.
      if (!session || error) return null;

      // 2. Se a sessão é válida, pega os dados do profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // 3. Fallback se o profile falhar (mas a sessão existe)
      if (profileError || !profile) {
        return {
          id: session.user.id,
          email: session.user.email!,
          nome_completo: session.user.user_metadata.nome_completo || "Usuário",
          workspace_id: undefined,
          is_public: session.user.user_metadata.is_public ?? false,
        };
      }

      return {
        id: profile.id,
        email: session.user.email!,
        nome_completo: profile.nome_completo,
        workspace_id: profile.workspace_id,
        crea: profile.crea,
        telefone: profile.telefone,
        avatar_url: profile.avatar_url,
        avatar_nome: profile.avatar_nome,
        is_public: profile.is_public,
      };
    } catch (error) {
      return null;
    }
  },

  // --- UPLOAD AVATAR ---
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{
    url: string | null;
    nome: string | null;
    error: string | null;
  }> {
    try {
      const fileExt = file.name.split(".").pop();
      // Sanitize filename: use timestamp instead of random float
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);

      return { url: data.publicUrl, nome: fileName, error: null };
    } catch (error: any) {
      return {
        url: null,
        nome: null,
        error: translateAuthError(error.message),
      };
    }
  },
  // --- DELETE AVATAR ---
  async deleteAvatar(
    userId: string,
    avatarName: string,
  ): Promise<{ error: string | null }> {
    try {
      // 1. Remove do Storage se existir nome
      if (avatarName) {
        const { error: storageError } = await supabase.storage
          .from("avatar")
          .remove([avatarName]);

        if (storageError) {
          console.error("Erro ao remover arquivo do storage:", storageError);
          // Não paramos aqui, pois queremos limpar o registro no banco de qualquer jeito
        }
      }

      // 2. Limpa no Profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          avatar_nome: null,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // 3. Sincroniza com Engenheiros
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      const userEmail = authUser?.email;

      if (userEmail) {
        const { data: engenheiroExistente } = await supabase
          .from("engenheiros")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (engenheiroExistente) {
          const { error: engError } = await supabase
            .from("engenheiros")
            .update({
              avatar_url: null,
              avatar_name: null,
            })
            .eq("id", engenheiroExistente.id);

          if (engError)
            console.error("Erro ao limpar avatar engenheiro:", engError);
        }
      }

      return { error: null };
    } catch (error: any) {
      return { error: translateAuthError(error.message) };
    }
  },

  // --- UPDATE EMAIL ---
  async updateEmail(newEmail: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: translateAuthError(error.message) };
    }
  },

  // --- UPDATE PROFILE ---

  async updateProfile(
    userId: string,
    data: ProfileInput,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // 1. Atualizar Profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({
          nome_completo: data.nome_completo,
          crea: data.crea,
          telefone: data.telefone,
          avatar_url: data.avatar_url,
          avatar_nome: data.avatar_nome,
        })
        .eq("id", userId)
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Tentar atualizar Engenheiros (Sincronização)
      // Primeiro pegamos o email do usuário para encontrar o engenheiro correto
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      const userEmail = authUser?.email;

      if (userEmail) {
        // Verifica se existe um engenheiro com esse email
        const { data: engenheiroExistente } = await supabase
          .from("engenheiros")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (engenheiroExistente) {
          const { error: engError } = await supabase
            .from("engenheiros")
            .update({
              nome: data.nome_completo, // Nome da coluna é 'nome'
              crea: data.crea,
              telefone: data.telefone,
              avatar_url: data.avatar_url,
              avatar_name: data.avatar_nome, // Nome da coluna é 'avatar_name'
            })
            .eq("id", engenheiroExistente.id); // Validar pelo ID encontrado

          if (engError)
            console.error("Erro ao sincronizar engenheiro:", engError);
        }
      }

      const updatedUser: User = {
        id: userId,
        email: authUser?.email || "",
        nome_completo: profileData.nome_completo,
        workspace_id: profileData.workspace_id,
        crea: profileData.crea,
        telefone: profileData.telefone,
        avatar_url: profileData.avatar_url,
        avatar_nome: profileData.avatar_nome,
        is_public: profileData.is_public,
      };

      return { user: updatedUser, error: null };
    } catch (error: any) {
      return { user: null, error: translateAuthError(error.message) };
    }
  },

  // --- UPDATE PUBLIC STATUS ---
  async updatePublicStatus(
    userId: string,
    isPublic: boolean,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .update({ is_public: isPublic })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      // Sincroniza com Engenheiros
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      const userEmail = authUser?.email;

      if (userEmail) {
        const { data: engenheiroExistente } = await supabase
          .from("engenheiros")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (engenheiroExistente) {
          const { error: engenheiroError } = await supabase
            .from("engenheiros")
            .update({ is_public: isPublic })
            .eq("id", engenheiroExistente.id);

          if (engenheiroError)
            console.error(
              "Erro ao sincronizar public engenheiro:",
              engenheiroError,
            );
        }
      }

      // Fetch current user data to return a complete User object
      const currentUser = await this.getCurrentUser();

      if (!currentUser)
        return { user: null, error: "Usuário não encontrado após atualização" };

      return {
        user: { ...currentUser, is_public: profileData.is_public },
        error: null,
      };
    } catch (error: any) {
      console.error("Erro ao alterar status publico:", error);
      return { user: null, error: translateAuthError(error.message) };
    }
  },
  // --- MFA / 2FA ---
  async mfaEnroll(): Promise<{
    id: string;
    type: string;
    totp: { qr_code: string; secret: string; uri: string };
    error: string | null;
  }> {
    try {
      // 1. Check for existing unverified factors and delete them
      const { data: factorsData, error: listError } =
        await supabase.auth.mfa.listFactors();

      if (!listError && factorsData) {
        // Typecast factor to any to allow 'unverified' check if types are strict
        const unverifiedFactors = factorsData.totp.filter(
          (f: any) => f.status === "unverified",
        );
        for (const factor of unverifiedFactors) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }

      // 2. Enroll new factor
      // Giving a friendly name to avoid unique constraint on empty name if multiple exist (though we just deleted them)
      // and for better UX.
      const factorName = `Authenticator ${new Date().toLocaleDateString()}`;

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: factorName,
      });

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        totp: data.totp,
        error: null,
      };
    } catch (error: any) {
      return {
        id: "",
        type: "",
        totp: {} as any,
        error: translateAuthError(error.message),
      };
    }
  },

  async mfaChallengeAndVerify(
    factorId: string,
    code: string,
  ): Promise<{ error: string | null }> {
    try {
      const { error: challengeError } =
        await supabase.auth.mfa.challengeAndVerify({
          factorId,
          code,
        });

      if (challengeError) throw challengeError;

      return { error: null };
    } catch (error: any) {
      return { error: translateAuthError(error.message) };
    }
  },

  async mfaUnenroll(factorId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: translateAuthError(error.message) };
    }
  },

  async mfaListFactors() {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: translateAuthError(error.message) };
    }
  },

  async getMFAStatus(): Promise<{
    isEnabled: boolean;
    factors: any[];
    nextLevel: string | null;
  }> {
    try {
      const { data: factorsData, error } =
        await supabase.auth.mfa.listFactors();
      if (error) throw error;

      const { data: assuranceData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      const totpFactor = factorsData.totp.find(
        (f: any) => f.status === "verified",
      );

      return {
        isEnabled: !!totpFactor,
        factors: factorsData.totp,
        nextLevel: assuranceData?.nextLevel || null,
      };
    } catch (error) {
      return { isEnabled: false, factors: [], nextLevel: null };
    }
  },

  // --- ENGINEER LOCATIONS ---
  async getEngineerLocations(
    userId: string,
  ): Promise<{ locais: any[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("engenheiros")
        .select("locais_atuacao")
        .eq("created_by", userId)
        .single();

      if (error) {
        // Se erro for "row not found", retorna vazio sem erro
        if (error.code === "PGRST116") return { locais: [], error: null };
        throw error;
      }

      return { locais: data.locais_atuacao || [], error: null };
    } catch (error: any) {
      return { locais: [], error: translateAuthError(error.message) };
    }
  },

  async updateEngineerLocations(
    userId: string,
    locais: any[],
  ): Promise<{ error: string | null }> {
    try {
      // 1. Encontrar o engenheiro
      const { data: engenheiro, error: findError } = await supabase
        .from("engenheiros")
        .select("id")
        .eq("created_by", userId)
        .single();

      if (findError)
        throw new Error(
          "Perfil de engenheiro não encontrado para este usuário.",
        );

      // 2. Atualizar
      const { error: updateError } = await supabase
        .from("engenheiros")
        .update({ locais_atuacao: locais })
        .eq("id", engenheiro.id);

      if (updateError) throw updateError;

      return { error: null };
    } catch (error: any) {
      return { error: translateAuthError(error.message) };
    }
  },
};
