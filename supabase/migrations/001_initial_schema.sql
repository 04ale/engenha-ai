-- Tabela workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela profiles (engenheiros)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  nome_completo TEXT NOT NULL,
  crea TEXT,
  telefone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela obras
CREATE TABLE IF NOT EXISTS obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  engenheiro_id UUID NOT NULL REFERENCES profiles(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  descricao_obra TEXT NOT NULL CHECK (LENGTH(descricao_obra) >= 3),
  finalidade TEXT,
  observacoes TEXT,
  cidade TEXT NOT NULL CHECK (LENGTH(cidade) >= 2 AND LENGTH(cidade) <= 255),
  estado TEXT NOT NULL CHECK (LENGTH(estado) >= 2 AND LENGTH(estado) <= 255),
  endereco_obra TEXT,
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  contratante_nome TEXT CHECK (LENGTH(contratante_nome) <= 255),
  contratante_tipo TEXT CHECK (contratante_tipo IN ('pessoa_fisica', 'pessoa_juridica', 'orgao_publico')),
  contratante_cnpj TEXT CHECK (LENGTH(contratante_cnpj) <= 255),
  numero_contrato TEXT CHECK (LENGTH(numero_contrato) <= 255),
  valor_total NUMERIC(15,2) CHECK (valor_total >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_obras_workspace ON obras(workspace_id);
CREATE INDEX IF NOT EXISTS idx_obras_engenheiro ON obras(engenheiro_id);
CREATE INDEX IF NOT EXISTS idx_obras_empresa ON obras(empresa_id);

-- Tabela acervos
CREATE TABLE IF NOT EXISTS acervos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  engenheiro_id UUID NOT NULL REFERENCES profiles(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  obra_id UUID REFERENCES obras(id),
  descricao_obra TEXT NOT NULL CHECK (LENGTH(descricao_obra) >= 3),
  finalidade TEXT,
  observacoes TEXT,
  cidade TEXT NOT NULL CHECK (LENGTH(cidade) >= 2 AND LENGTH(cidade) <= 255),
  estado TEXT NOT NULL CHECK (LENGTH(estado) >= 2 AND LENGTH(estado) <= 255),
  endereco_obra TEXT,
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  contratante_nome TEXT CHECK (LENGTH(contratante_nome) <= 255),
  contratante_tipo TEXT CHECK (contratante_tipo IN ('pessoa_fisica', 'pessoa_juridica', 'orgao_publico')),
  contratante_cnpj TEXT CHECK (LENGTH(contratante_cnpj) <= 255),
  numero_contrato TEXT CHECK (LENGTH(numero_contrato) <= 255),
  valor_total NUMERIC(15,2) CHECK (valor_total >= 0),
  numero_art TEXT CHECK (LENGTH(numero_art) <= 255),
  tipo_art TEXT CHECK (LENGTH(tipo_art) <= 255),
  data_art_registro DATE,
  data_art_baixa DATE,
  acervo_tipo TEXT NOT NULL,
  nome_fantasia TEXT,
  arquivo_cat_url TEXT,
  arquivo_cat_nome TEXT CHECK (LENGTH(arquivo_cat_nome) <= 255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acervos_workspace ON acervos(workspace_id);
CREATE INDEX IF NOT EXISTS idx_acervos_engenheiro ON acervos(engenheiro_id);
CREATE INDEX IF NOT EXISTS idx_acervos_obra ON acervos(obra_id);

-- Tabela acervo_itens
CREATE TABLE IF NOT EXISTS acervo_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acervo_id UUID NOT NULL REFERENCES acervos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL CHECK (LENGTH(descricao) >= 3),
  unidade TEXT NOT NULL CHECK (LENGTH(unidade) <= 50),
  quantidade NUMERIC(15,3) NOT NULL CHECK (quantidade >= 0),
  valor_executado NUMERIC(15,2) NOT NULL CHECK (valor_executado >= 0),
  data_execucao DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id)
);

CREATE TABLE IF NOT EXISTS engenheiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  crea TEXT,
  especialidade TEXT,
  email TEXT,
  telefone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cpf TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id)
);



CREATE INDEX IF NOT EXISTS idx_acervo_itens_acervo ON acervo_itens(acervo_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_obras_updated_at ON obras;
CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON obras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_acervos_updated_at ON acervos;
CREATE TRIGGER update_acervos_updated_at BEFORE UPDATE ON acervos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
