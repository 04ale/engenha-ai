# Prompts para Desenvolvimento com Composer

Este documento contém prompts estruturados para cada etapa de desenvolvimento do aplicativo Engenha AI, prontos para uso com o modelo Composer do Cursor.

---

## Etapa 1: Configuração Inicial e Setup do Projeto

### Prompt:

```
Configure o projeto React + TypeScript + Vite para desenvolvimento de uma aplicação web completa. O projeto já possui TailwindCSS configurado.

Requisitos:
1. Instalar e configurar shadcn/ui (usando o CLI do shadcn)
2. Configurar React Router DOM para navegação
3. Instalar e configurar React Hook Form para formulários
4. Instalar e configurar Zod para validação de schemas
5. Instalar bibliotecas de ícones (lucide-react)
6. Configurar estrutura de pastas:
   - src/components/ui (componentes shadcn)
   - src/components (componentes customizados)
   - src/pages (páginas da aplicação)
   - src/lib (utilitários e helpers)
   - src/hooks (custom hooks)
   - src/types (tipos TypeScript)
   - src/contexts (contextos React)
   - src/services (serviços de API)
   - src/utils (funções utilitárias)

7. Configurar variáveis de ambiente (.env)
8. Criar arquivo de configuração do shadcn (components.json)
9. Configurar tema padrão do shadcn/ui

Tecnologias a usar:
- React 19
- TypeScript
- Vite
- TailwindCSS 4
- shadcn/ui
- React Router DOM
- React Hook Form
- Zod
- lucide-react

Certifique-se de que todas as dependências sejam instaladas e configuradas corretamente.
```

---

## Etapa 2: Sistema de Autenticação - Registro

### Prompt:

```
Crie a tela de registro de usuário para engenheiros com as seguintes especificações:

Funcionalidades:
1. Formulário de registro com campos:
   - Nome completo (obrigatório, mínimo 3 caracteres)
   - Email (obrigatório, formato válido)
   - Senha (obrigatório, mínimo 8 caracteres, deve conter letras e números)
   - Confirmação de senha (deve coincidir com a senha)
   - CREA (número de registro no conselho - obrigatório)
   - Telefone (opcional, formato brasileiro)

2. Validação em tempo real usando React Hook Form + Zod
3. Estados de loading durante o envio
4. Toast de sucesso/erro após submissão
5. Skeleton loading durante carregamento inicial
6. Link para página de login
7. Design moderno e responsivo usando componentes shadcn/ui

Componentes shadcn/ui a usar:
- Form (react-hook-form)
- Input
- Button
- Label
- Card
- Toast/Toaster
- Skeleton

Estrutura:
- Criar página em src/pages/auth/Register.tsx
- Criar schema de validação em src/lib/validations/auth.ts
- Criar componente de formulário em src/components/auth/RegisterForm.tsx
- Integrar com React Router

Design: Use TailwindCSS para estilização, seguindo padrões modernos de UX/UI. O formulário deve estar centralizado em uma card, com espaçamento adequado e feedback visual claro.
```

---

## Etapa 3: Sistema de Autenticação - Login

### Prompt:

```
Crie a tela de login de usuário para engenheiros com as seguintes especificações:

Funcionalidades:
1. Formulário de login com campos:
   - Email (obrigatório, formato válido)
   - Senha (obrigatório)
   - Checkbox "Lembrar-me"
   - Link "Esqueci minha senha"

2. Validação em tempo real usando React Hook Form + Zod
3. Estados de loading durante o envio
4. Toast de sucesso/erro após submissão
5. Skeleton loading durante carregamento inicial
6. Link para página de registro
7. Redirecionamento para dashboard após login bem-sucedido
8. Design moderno e responsivo usando componentes shadcn/ui

Componentes shadcn/ui a usar:
- Form (react-hook-form)
- Input
- Button
- Label
- Card
- Checkbox
- Toast/Toaster
- Skeleton

Estrutura:
- Criar página em src/pages/auth/Login.tsx
- Criar schema de validação em src/lib/validations/auth.ts (adicionar ao existente)
- Criar componente de formulário em src/components/auth/LoginForm.tsx
- Integrar com React Router
- Criar contexto de autenticação em src/contexts/AuthContext.tsx (se ainda não existir)

Design: Use TailwindCSS para estilização, seguindo padrões modernos de UX/UI. O formulário deve estar centralizado em uma card, com espaçamento adequado e feedback visual claro. Manter consistência visual com a tela de registro.
```

---

## Etapa 4: Sistema de Autenticação - Reset de Senha

### Prompt:

```
Crie o sistema de recuperação de senha com as seguintes especificações:

Funcionalidades:
1. Dialog/Modal para reset de senha que pode ser aberto a partir da tela de login
2. Fluxo em duas etapas:
   - Etapa 1: Solicitar código de reset
     * Campo de email (obrigatório, formato válido)
     * Botão "Enviar código"
     * Mensagem informando que o código foi enviado por email
   
   - Etapa 2: Validar código e definir nova senha
     * Campo de código recebido por email (obrigatório, 6 dígitos)
     * Campo de nova senha (obrigatório, mínimo 8 caracteres)
     * Campo de confirmação de senha (deve coincidir)
     * Botão "Redefinir senha"

3. Validação em tempo real usando React Hook Form + Zod
4. Estados de loading durante cada etapa
5. Toast de sucesso/erro após cada ação
6. Contador de tempo para reenvio do código (opcional)
7. Design moderno e responsivo usando componentes shadcn/ui

Componentes shadcn/ui a usar:
- Dialog
- Form (react-hook-form)
- Input
- Button
- Label
- Toast/Toaster
- Separator (para separar as etapas)

Estrutura:
- Criar componente em src/components/auth/ResetPasswordDialog.tsx
- Criar schema de validação em src/lib/validations/auth.ts (adicionar ao existente)
- Integrar o dialog na página de login

Design: Use TailwindCSS para estilização. O dialog deve ter transições suaves entre as etapas, feedback visual claro e indicadores de progresso. Manter consistência visual com o restante da aplicação.
```

---

## Etapa 5: Dashboard do Engenheiro

### Prompt:

```
Crie o dashboard do engenheiro com métricas e status, seguindo as especificações abaixo:

Funcionalidades:
1. Layout principal:
   - Header com logo, navegação e menu do usuário
   - Sidebar com navegação (colapsável em mobile)
   - Área de conteúdo principal

2. Cards de métricas no topo:
   - Total de obras cadastradas
   - Total de acervos técnicos
   - Total de CATs registrados
   - Valor total de obras (soma de todos os valores_executado)

3. Seção de status/atividades recentes:
   - Lista das últimas 5 obras cadastradas
   - Lista dos últimos 5 acervos técnicos
   - Indicadores visuais de status

4. Gráficos/visualizações (usar biblioteca de gráficos como recharts):
   - Gráfico de obras por mês (últimos 6 meses)
   - Gráfico de distribuição de obras por estado
   - Gráfico de valor total por mês

5. Estados de loading com skeletons
6. Tratamento de estados vazios (quando não há dados)
7. Design responsivo e moderno

Componentes shadcn/ui a usar:
- Card
- Button
- Avatar
- Badge
- Separator
- Skeleton
- Sheet (para sidebar mobile)
- DropdownMenu (para menu do usuário)

Bibliotecas adicionais:
- recharts (para gráficos)
- date-fns (para formatação de datas)

Estrutura:
- Criar página em src/pages/dashboard/Dashboard.tsx
- Criar componente de layout em src/components/layout/DashboardLayout.tsx
- Criar componentes de métricas em src/components/dashboard/MetricCard.tsx
- Criar componentes de gráficos em src/components/dashboard/Charts/
- Criar hook para buscar dados em src/hooks/useDashboard.ts

Design: Use TailwindCSS para estilização. O dashboard deve ter um visual profissional, com cards bem espaçados, cores consistentes e hierarquia visual clara. Usar grid responsivo para organização dos elementos.
```

---

## Etapa 6: Cadastro de Obra

### Prompt:

```
Crie a funcionalidade de cadastro de obra seguindo o schema fornecido:

Schema da Obra:
- empresa_id (UUID, obrigatório)
- engenheiro_id (UUID, obrigatório)
- workspace_id (UUID, obrigatório)
- descricao_obra (string, mínimo 3 caracteres, obrigatório)
- finalidade (string, opcional)
- observacoes (string, opcional)
- cidade (string, 2-255 caracteres, obrigatório)
- estado (string, 2-255 caracteres, obrigatório)
- endereco_obra (string, opcional)
- data_inicio (date, obrigatório)
- data_conclusao (date, opcional)
- contratante_nome (string, máximo 255 caracteres, opcional)
- contratante_tipo (enum: "pessoa_fisica" | "pessoa_juridica" | "orgao_publico", opcional)
- contratante_cnpj (string, máximo 255 caracteres, opcional)
- numero_contrato (string, máximo 255 caracteres, opcional)
- valor_total (number, mínimo 0, opcional)

Funcionalidades:
1. Formulário multi-step ou em seções organizadas:
   - Seção 1: Informações básicas da obra
   - Seção 2: Localização
   - Seção 3: Datas
   - Seção 4: Informações do contratante
   - Seção 5: Valores e contrato

2. Validação completa usando React Hook Form + Zod
3. Estados de loading durante o envio
4. Toast de sucesso/erro após submissão
5. Skeleton loading durante carregamento inicial
6. Botão de cancelar que retorna ao dashboard
7. Design moderno e responsivo usando componentes shadcn/ui

Componentes shadcn/ui a usar:
- Form (react-hook-form)
- Input
- Textarea
- Select
- Button
- Label
- Card
- Toast/Toaster
- Skeleton
- Calendar (para seleção de datas)
- Popover (para o calendar)

Bibliotecas adicionais:
- react-day-picker (para calendário)
- date-fns (para formatação de datas)

Estrutura:
- Criar página em src/pages/obras/CreateObra.tsx
- Criar schema de validação em src/lib/validations/obra.ts
- Criar componente de formulário em src/components/obras/ObraForm.tsx
- Criar tipos TypeScript em src/types/obra.ts
- Criar serviço de API em src/services/obraService.ts

Design: Use TailwindCSS para estilização. O formulário deve ser intuitivo, com seções claramente separadas, labels descritivos e feedback visual imediato. Usar máscaras para campos como CNPJ e valores monetários.
```

---

## Etapa 7: Cadastro de Acervo Técnico

### Prompt:

```
Crie a funcionalidade de cadastro de acervo técnico (CAT) seguindo o schema fornecido:

Schema do Acervo:
Campos obrigatórios:
- empresa_id (UUID)
- engenheiro_id (UUID)
- workspace_id (UUID)
- obra_id (UUID) - referência à obra relacionada
- descricao_obra (string, mínimo 3 caracteres)
- cidade (string, 2-255 caracteres)
- estado (string, 2-255 caracteres)
- data_inicio (date)
- acervo_tipo (string)

Campos opcionais:
- finalidade (string)
- observacoes (string)
- endereco_obra (string)
- data_conclusao (date)
- contratante_nome (string, máximo 255)
- contratante_tipo (enum: "pessoa_fisica" | "pessoa_juridica" | "orgao_publico")
- contratante_cnpj (string, máximo 255)
- numero_contrato (string, máximo 255)
- valor_total (number, mínimo 0)
- numero_art (string, máximo 255)
- tipo_art (string, máximo 255)
- data_art_registro (date)
- data_art_baixa (date)
- nome_fantasia (string)
- arquivo_cat_url (URI)
- arquivo_cat_nome (string, máximo 255)
- itens (array de Item)

Schema do Item (dentro do acervo):
- acervo_id (UUID, obrigatório)
- descricao (string, mínimo 3 caracteres, obrigatório)
- unidade (string, máximo 50 caracteres, obrigatório)
- quantidade (number, mínimo 0, obrigatório)
- valor_executado (number, mínimo 0, obrigatório)
- data_execucao (date, obrigatório)

Funcionalidades:
1. Formulário complexo com múltiplas seções:
   - Seção 1: Seleção da obra relacionada (com busca/filtro)
   - Seção 2: Informações básicas do acervo
   - Seção 3: Informações da ART (Anotação de Responsabilidade Técnica)
   - Seção 4: Upload do arquivo CAT (PDF)
   - Seção 5: Itens do acervo (tabela dinâmica com adicionar/remover/editar)
   - Seção 6: Informações adicionais

2. Tabela dinâmica para itens:
   - Adicionar novo item
   - Editar item existente
   - Remover item
   - Validação de cada item
   - Cálculo automático de totais

3. Upload de arquivo:
   - Drag and drop ou seleção de arquivo
   - Preview do arquivo selecionado
   - Validação de tipo (apenas PDF)
   - Validação de tamanho (máximo 10MB)

4. Validação completa usando React Hook Form + Zod
5. Estados de loading durante o envio
6. Toast de sucesso/erro após submissão
7. Skeleton loading durante carregamento inicial
8. Botão de cancelar que retorna ao dashboard
9. Design moderno e responsivo usando componentes shadcn/ui

Componentes shadcn/ui a usar:
- Form (react-hook-form)
- Input
- Textarea
- Select
- Button
- Label
- Card
- Toast/Toaster
- Skeleton
- Calendar (para seleção de datas)
- Popover (para o calendar)
- Table (para lista de itens)
- Dialog (para adicionar/editar itens)
- Dropzone (ou componente customizado para upload)

Bibliotecas adicionais:
- react-day-picker (para calendário)
- date-fns (para formatação de datas)
- react-dropzone (para upload de arquivos)

Estrutura:
- Criar página em src/pages/acervos/CreateAcervo.tsx
- Criar schema de validação em src/lib/validations/acervo.ts
- Criar componente de formulário em src/components/acervos/AcervoForm.tsx
- Criar componente de tabela de itens em src/components/acervos/ItensTable.tsx
- Criar componente de upload em src/components/acervos/FileUpload.tsx
- Criar tipos TypeScript em src/types/acervo.ts e src/types/item.ts
- Criar serviço de API em src/services/acervoService.ts

Design: Use TailwindCSS para estilização. O formulário deve ser bem organizado, com seções claramente separadas. A tabela de itens deve ser intuitiva, com ações claras. O componente de upload deve ter feedback visual claro. Usar máscaras para campos como CNPJ e valores monetários.
```

---

## Etapa 8: Listagem e Gerenciamento de Obras

### Prompt:

```
Crie a página de listagem e gerenciamento de obras com as seguintes funcionalidades:

Funcionalidades:
1. Lista de obras cadastradas:
   - Tabela com colunas: Descrição, Cidade/Estado, Data Início, Data Conclusão, Valor Total, Status, Ações
   - Paginação
   - Filtros: por cidade, estado, período, status
   - Busca por descrição ou número de contrato
   - Ordenação por colunas

2. Ações disponíveis:
   - Visualizar detalhes (modal ou página)
   - Editar obra
   - Excluir obra (com confirmação)
   - Criar novo acervo técnico vinculado à obra

3. Card/Modal de detalhes da obra:
   - Exibir todas as informações da obra
   - Listar acervos técnicos vinculados (se houver)
   - Botão para criar novo acervo

4. Estados:
   - Loading com skeletons
   - Estado vazio (quando não há obras)
   - Tratamento de erros

5. Design responsivo e moderno

Componentes shadcn/ui a usar:
- Table
- Button
- Input (para busca)
- Select (para filtros)
- Dialog (para detalhes e confirmação de exclusão)
- Card
- Badge (para status)
- Skeleton
- Toast/Toaster
- DropdownMenu (para ações)

Estrutura:
- Criar página em src/pages/obras/ListObras.tsx
- Criar componente de tabela em src/components/obras/ObrasTable.tsx
- Criar componente de filtros em src/components/obras/ObrasFilters.tsx
- Criar componente de detalhes em src/components/obras/ObraDetails.tsx
- Criar hook para buscar obras em src/hooks/useObras.ts
- Atualizar serviço de API em src/services/obraService.ts

Design: Use TailwindCSS para estilização. A tabela deve ser limpa e legível, com ações claras. Os filtros devem ser intuitivos e fáceis de usar. Manter consistência visual com o restante da aplicação.
```

---

## Etapa 9: Listagem e Gerenciamento de Acervos Técnicos

### Prompt:

```
Crie a página de listagem e gerenciamento de acervos técnicos com as seguintes funcionalidades:

Funcionalidades:
1. Lista de acervos cadastrados:
   - Tabela com colunas: Descrição da Obra, Cidade/Estado, Tipo de Acervo, Número ART, Data Registro ART, Valor Total, Ações
   - Paginação
   - Filtros: por tipo de acervo, cidade, estado, período, obra relacionada
   - Busca por descrição, número ART ou número de contrato
   - Ordenação por colunas

2. Ações disponíveis:
   - Visualizar detalhes (modal ou página)
   - Editar acervo
   - Excluir acervo (com confirmação)
   - Visualizar/baixar arquivo CAT
   - Visualizar itens do acervo

3. Card/Modal de detalhes do acervo:
   - Exibir todas as informações do acervo
   - Exibir informações da obra relacionada
   - Listar todos os itens do acervo em tabela
   - Botão para visualizar/baixar arquivo CAT
   - Botão para editar

4. Modal de visualização de itens:
   - Tabela com todos os itens
   - Colunas: Descrição, Unidade, Quantidade, Valor Executado, Data Execução, Total
   - Cálculo do total geral

5. Estados:
   - Loading com skeletons
   - Estado vazio (quando não há acervos)
   - Tratamento de erros

6. Design responsivo e moderno

Componentes shadcn/ui a usar:
- Table
- Button
- Input (para busca)
- Select (para filtros)
- Dialog (para detalhes, confirmação de exclusão e visualização de itens)
- Card
- Badge (para tipos e status)
- Skeleton
- Toast/Toaster
- DropdownMenu (para ações)

Estrutura:
- Criar página em src/pages/acervos/ListAcervos.tsx
- Criar componente de tabela em src/components/acervos/AcervosTable.tsx
- Criar componente de filtros em src/components/acervos/AcervosFilters.tsx
- Criar componente de detalhes em src/components/acervos/AcervoDetails.tsx
- Criar componente de visualização de itens em src/components/acervos/ItensView.tsx
- Criar hook para buscar acervos em src/hooks/useAcervos.ts
- Atualizar serviço de API em src/services/acervoService.ts

Design: Use TailwindCSS para estilização. A tabela deve ser limpa e legível, com ações claras. Os filtros devem ser intuitivos. Manter consistência visual com o restante da aplicação. A visualização de itens deve ser clara e organizada.
```

---

## Etapa 10: Edição de Obra

### Prompt:

```
Crie a funcionalidade de edição de obra baseada no formulário de cadastro:

Funcionalidades:
1. Reutilizar o formulário de cadastro, mas:
   - Carregar dados existentes da obra
   - Preencher todos os campos com os valores atuais
   - Alterar título e botão de ação para "Editar Obra" e "Salvar Alterações"

2. Validação completa usando React Hook Form + Zod
3. Estados de loading durante carregamento e envio
4. Toast de sucesso/erro após submissão
5. Skeleton loading durante carregamento inicial
6. Botão de cancelar que retorna à listagem
7. Tratamento de erros (obra não encontrada, etc.)

Componentes shadcn/ui a usar:
- Mesmos componentes do formulário de cadastro

Estrutura:
- Criar página em src/pages/obras/EditObra.tsx
- Reutilizar componente src/components/obras/ObraForm.tsx (tornar reutilizável)
- Atualizar serviço de API em src/services/obraService.ts (adicionar método de atualização)

Design: Manter consistência visual com o formulário de cadastro. Adicionar indicador visual de que está editando (ex: badge "Modo Edição").
```

---

## Etapa 11: Edição de Acervo Técnico

### Prompt:

```
Crie a funcionalidade de edição de acervo técnico baseada no formulário de cadastro:

Funcionalidades:
1. Reutilizar o formulário de cadastro, mas:
   - Carregar dados existentes do acervo
   - Preencher todos os campos com os valores atuais
   - Carregar e exibir itens existentes na tabela
   - Carregar e exibir arquivo CAT atual (se existir)
   - Alterar título e botão de ação para "Editar Acervo" e "Salvar Alterações"

2. Funcionalidades específicas de edição:
   - Permitir adicionar novos itens
   - Permitir editar itens existentes
   - Permitir remover itens existentes
   - Permitir substituir arquivo CAT (com preview do arquivo atual)

3. Validação completa usando React Hook Form + Zod
4. Estados de loading durante carregamento e envio
5. Toast de sucesso/erro após submissão
6. Skeleton loading durante carregamento inicial
7. Botão de cancelar que retorna à listagem
8. Tratamento de erros (acervo não encontrado, etc.)

Componentes shadcn/ui a usar:
- Mesmos componentes do formulário de cadastro

Estrutura:
- Criar página em src/pages/acervos/EditAcervo.tsx
- Reutilizar componente src/components/acervos/AcervoForm.tsx (tornar reutilizável)
- Atualizar componente src/components/acervos/ItensTable.tsx para suportar edição
- Atualizar serviço de API em src/services/acervoService.ts (adicionar método de atualização)

Design: Manter consistência visual com o formulário de cadastro. Adicionar indicador visual de que está editando. A tabela de itens deve permitir edição inline ou via dialog.
```

---

## Notas de Uso

### Como usar estes prompts:

1. **Copie o prompt da etapa desejada** e cole no Composer do Cursor
2. **Execute uma etapa por vez** - não tente executar múltiplas etapas simultaneamente
3. **Aguarde a conclusão** de cada etapa antes de prosseguir para a próxima
4. **Revise o código gerado** antes de continuar
5. **Teste a funcionalidade** após cada etapa

### Ordem recomendada de execução:

1. Etapa 1 (Configuração Inicial)
2. Etapa 2 (Registro)
3. Etapa 3 (Login)
4. Etapa 4 (Reset de Senha)
5. Etapa 5 (Dashboard)
6. Etapa 6 (Cadastro de Obra)
7. Etapa 7 (Cadastro de Acervo)
8. Etapa 8 (Listagem de Obras)
9. Etapa 9 (Listagem de Acervos)
10. Etapa 10 (Edição de Obra)
11. Etapa 11 (Edição de Acervo)

### Dicas:

- Se encontrar erros, corrija antes de prosseguir
- Mantenha consistência nos padrões de código
- Teste responsividade em diferentes tamanhos de tela
- Valide todos os formulários antes de considerar completo
- Certifique-se de que os tipos TypeScript estão corretos
