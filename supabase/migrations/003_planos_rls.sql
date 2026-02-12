-- Habilitar RLS na tabela planos (caso ainda não esteja)
ALTER TABLE "public"."planos" ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública para todos (autenticados e anônimos)
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."planos";

CREATE POLICY "Enable read access for all users"
ON "public"."planos"
FOR SELECT
TO public
USING (true);
