export const translateAuthError = (errorMessage: string): string => {
  const error = errorMessage.toLowerCase();

  const translations: { [key: string]: string } = {
    "invalid login credentials": "E-mail ou senha incorretos.",
    "invalid claim: missing sub claim":
      "Sessão inválida. Por favor, faça login novamente.",
    "user already registered": "Este e-mail já está cadastrado.",
    "password should be at least": "A senha deve ter pelo menos 8 caracteres.",
    "rate limit exceeded":
      "Muitas tentativas. Aguarde um momento e tente novamente.",
    "email not confirmed":
      "E-mail não confirmado. Verifique sua caixa de entrada.",
    "user not found": "Usuário não encontrado.",
    "invalid token": "Token inválido ou expirado.",
    "token expired": "O link expirou.",
    "a factor with the friendly name":
      "Já existe um autenticador com este nome.",
    "factor already exists": "Este método de autenticação já foi adicionado.",
  };

  for (const key in translations) {
    if (error.includes(key)) {
      return translations[key];
    }
  }

  // Fallback for unmapped errors, maybe keeps original or generic
  // Returning original for debugging if unknown, or a generic "Ocorreu um erro"
  return errorMessage || "Ocorreu um erro inesperado.";
};
