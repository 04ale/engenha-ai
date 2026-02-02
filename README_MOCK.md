# Dados Mockados - Engenha AI

## Status Atual

A aplicação está configurada para usar **dados mockados** (fictícios) para desenvolvimento e visualização da UI/UX completa.

## Como Funciona

### Autenticação
- **Login**: Use qualquer email e senha para fazer login
- **Registro**: Cria um novo usuário mockado (salvo no localStorage)
- O usuário padrão é carregado automaticamente ao iniciar a aplicação

### Dados Disponíveis

#### Obras (5 obras mockadas)
1. Construção de Edifício Residencial - Torre A (São Paulo/SP)
2. Reforma de Shopping Center (Rio de Janeiro/RJ)
3. Ponte sobre o Rio Paraná (Foz do Iguaçu/PR)
4. Condomínio Residencial Horizonte (Belo Horizonte/MG)
5. Hospital Regional Norte (Brasília/DF)

#### Acervos Técnicos (4 acervos mockados)
1. Acervo Técnico - Edifício Residencial Torre A (com 3 itens)
2. Acervo Técnico - Reforma Shopping Center (com 2 itens)
3. Acervo Técnico - Ponte sobre o Rio Paraná (com 3 itens)
4. Acervo Técnico - Condomínio Horizonte (sem itens)

#### Dashboard
- Total de Obras: 5
- Total de Acervos: 4
- Total de CATs: 3 (acervos com arquivo anexado)
- Valor Total Executado: Calculado automaticamente dos itens

## Funcionalidades Disponíveis

✅ Todas as funcionalidades de UI/UX estão funcionando:
- Visualização de dashboard com métricas
- Listagem de obras com filtros e busca
- Cadastro, edição e exclusão de obras
- Listagem de acervos com filtros
- Cadastro, edição e exclusão de acervos
- Gerenciamento de itens do acervo (adicionar/editar/remover)
- Upload de arquivo CAT (simulado)
- Visualização de detalhes

## Observações

- Os dados são salvos apenas em memória (arrays JavaScript)
- Ao recarregar a página, os dados voltam ao estado inicial
- O upload de arquivos cria URLs locais (blob URLs) para preview
- Todas as operações têm delay simulado para parecer requisições reais

## Próximos Passos

Para conectar com o backend real (Supabase):
1. Remover ou comentar os imports de `mockData` nos serviços
2. Restaurar as chamadas ao Supabase
3. Configurar variáveis de ambiente
4. Executar migrações SQL

## Arquivos de Mock

- `src/lib/mockData.ts` - Todos os dados mockados
- `src/services/*Service.ts` - Serviços modificados para usar dados mockados
