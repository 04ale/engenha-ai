# Guia de Setup - Engenha AI

## Pré-requisitos

- Node.js 18+ e pnpm instalados
- Conta no Supabase (https://supabase.com)

## Passos de Configuração

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.local.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e adicione:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 3. Executar Migrações SQL no Supabase

1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Execute os arquivos SQL na ordem:
   - `supabase/migrations/001_initial_schema.sql` (cria tabelas)
   - `supabase/migrations/002_rls_policies.sql` (configura RLS)

### 4. Configurar Storage no Supabase

1. No Supabase Dashboard, vá em Storage
2. Crie um novo bucket chamado `cat-files`
3. Configure como **privado**
4. Adicione a seguinte policy para upload:

```sql
-- Policy para permitir upload apenas do próprio workspace
CREATE POLICY "Users can upload own workspace files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cat-files' AND
  (storage.foldername(name))[1] IN (
    SELECT workspace_id::text FROM profiles WHERE id = auth.uid()
  )
);

-- Policy para permitir download apenas do próprio workspace
CREATE POLICY "Users can download own workspace files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cat-files' AND
  (storage.foldername(name))[1] IN (
    SELECT workspace_id::text FROM profiles WHERE id = auth.uid()
  )
);
```

### 5. Executar o Projeto

```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/          # Componentes shadcn/ui
│   ├── auth/        # Componentes de autenticação
│   ├── layout/      # Layout principal
│   ├── dashboard/   # Componentes do dashboard
│   ├── obras/       # Componentes de obras
│   └── acervos/     # Componentes de acervos
├── pages/           # Páginas da aplicação
├── lib/
│   ├── supabase/    # Cliente Supabase
│   └── validations/ # Schemas Zod
├── hooks/           # Custom hooks
├── types/           # Tipos TypeScript
├── contexts/        # Contextos React
└── services/        # Serviços de API
```

## Notas Importantes

- O projeto usa **multi-tenant** com `workspace_id`
- Todas as queries devem filtrar por `workspace_id` do usuário logado
- RLS policies garantem isolamento no banco de dados
- Storage policies garantem isolamento de arquivos
