-- Habilitar RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE acervos ENABLE ROW LEVEL SECURITY;
ALTER TABLE acervo_itens ENABLE ROW LEVEL SECURITY;

-- Workspaces: usuário só vê seu próprio workspace
DROP POLICY IF EXISTS "Users can view own workspace" ON workspaces;
CREATE POLICY "Users can view own workspace"
  ON workspaces FOR SELECT
  USING (id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Profiles: usuário só vê/edita seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Obras: usuário só vê obras do seu workspace
DROP POLICY IF EXISTS "Users can view own workspace obras" ON obras;
CREATE POLICY "Users can view own workspace obras"
  ON obras FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own workspace obras" ON obras;
CREATE POLICY "Users can insert own workspace obras"
  ON obras FOR INSERT
  WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
    AND created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update own workspace obras" ON obras;
CREATE POLICY "Users can update own workspace obras"
  ON obras FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own workspace obras" ON obras;
CREATE POLICY "Users can delete own workspace obras"
  ON obras FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Acervos: usuário só vê acervos do seu workspace
DROP POLICY IF EXISTS "Users can view own workspace acervos" ON acervos;
CREATE POLICY "Users can view own workspace acervos"
  ON acervos FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own workspace acervos" ON acervos;
CREATE POLICY "Users can insert own workspace acervos"
  ON acervos FOR INSERT
  WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
    AND created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update own workspace acervos" ON acervos;
CREATE POLICY "Users can update own workspace acervos"
  ON acervos FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own workspace acervos" ON acervos;
CREATE POLICY "Users can delete own workspace acervos"
  ON acervos FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Acervo Itens: usuário só vê itens de acervos do seu workspace
DROP POLICY IF EXISTS "Users can view own workspace acervo_itens" ON acervo_itens;
CREATE POLICY "Users can view own workspace acervo_itens"
  ON acervo_itens FOR SELECT
  USING (acervo_id IN (
    SELECT id FROM acervos 
    WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert own workspace acervo_itens" ON acervo_itens;
CREATE POLICY "Users can insert own workspace acervo_itens"
  ON acervo_itens FOR INSERT
  WITH CHECK (acervo_id IN (
    SELECT id FROM acervos 
    WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update own workspace acervo_itens" ON acervo_itens;
CREATE POLICY "Users can update own workspace acervo_itens"
  ON acervo_itens FOR UPDATE
  USING (acervo_id IN (
    SELECT id FROM acervos 
    WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete own workspace acervo_itens" ON acervo_itens;
CREATE POLICY "Users can delete own workspace acervo_itens"
  ON acervo_itens FOR DELETE
  USING (acervo_id IN (
    SELECT id FROM acervos 
    WHERE workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  ));
