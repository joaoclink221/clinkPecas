---
sidebar_position: 4
title: Como Contribuir
---

# Como Contribuir

## Pré-requisitos

- Node.js >= 18
- npm >= 9
- Git

## Setup do ambiente

```bash
# Clonar o repositório
git clone https://github.com/clinkPecas/clinkAutoPecas.git
cd clinkAutoPecas

# Instalar dependências da aplicação
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

## Fluxo de desenvolvimento

### 1. Criar uma branch

Siga o padrão: `tipo/descricao-curta`

```bash
# Funcionalidade nova
git checkout -b feat/modulo-clientes

# Correção de bug
git checkout -b fix/paginacao-reset

# Documentação
git checkout -b docs/modulo-estoque
```

### 2. Implementar seguindo os Quatro Pilares

Todo código do projeto deve respeitar:

| Pilar | Princípio principal |
|---|---|
| 🔒 **Segurança** | Nunca expor dados sensíveis; validar entradas |
| 📈 **Escalabilidade** | Componentes stateless e desacoplados |
| 🔧 **Manutenibilidade** | Nomes que revelam intenção; funções com responsabilidade única |
| ✨ **Clean Code** | Retorno antecipado; sem código morto; erros tratados explicitamente |

### 3. Escrever testes

Cada arquivo de código deve ter seu arquivo de testes correspondente:

```
src/pages/inventory/InventoryTable.tsx
src/pages/inventory/InventoryTable.test.tsx  ← obrigatório
```

Rode os testes antes de abrir um PR:

```bash
npm test -- --run
```

Todos os testes devem passar. **Nunca apague ou enfraqueça testes existentes** sem justificativa explícita.

### 4. Verificar lint

```bash
npm run lint
```

Corrija todos os erros antes de commitar. Warnings de lint são tolerados temporariamente mas devem ser resolvidos na mesma PR quando possível.

### 5. Abrir Pull Request

Use a descrição estruturada:

```markdown
## O que foi feito
- Implementei X

## Como testar
1. Rodar `npm run dev`
2. Navegar para /rota
3. Verificar comportamento Y

## Testes adicionados
- [ ] Testes unitários de X
- [ ] Testes de integração na página Y
```

---

## Convenções de código

### Componentes React

- Um componente por arquivo.
- Nome do arquivo igual ao nome do componente: `InventoryTable.tsx`.
- Props com tipagem explícita via `type` (não `interface` para props simples).
- Exportação nomeada (não default): `export function InventoryTable(...)`.

### CSS / Tailwind

- Use os tokens do design system sempre que possível (`text-on-surface`, `bg-surface-container-low`, etc.).
- Cores hardcoded apenas quando não há token equivalente, usando o formato `text-[#hexcode]`.
- Evite `style={{}}` inline exceto para valores dinâmicos (ex: largura de barra de progresso).

### TypeScript

- Prefira `type` a `interface` para tipos simples.
- Sem `any` — use `unknown` quando necessário e faça narrowing explícito.
- Enums só quando o conjunto de valores é fixo e documentado (ex: `Category`, `SaleStatus`).

### Testes

- Use `describe` para agrupar por funcionalidade.
- Prefira `getByRole` e `getByLabelText` a `getByTestId`.
- Nomeie o teste descrevendo o comportamento: `'clicar em prev chama onPageChange com page - 1'`.

---

## Estrutura de uma nova feature/módulo

```
src/pages/[modulo]/
├── [Modulo]Page.tsx          ← estado + layout
├── [Modulo]Page.test.tsx     ← testes de integração
├── [Modulo]Table.tsx         ← tabela de dados
├── [Modulo]Table.test.tsx
├── [Modulo]KpiCard.tsx       ← cards KPI
├── [Modulo]KpiCard.test.tsx
├── [Modulo]SearchBar.tsx
├── [Modulo]SearchBar.test.tsx
├── [Modulo]Pagination.tsx
├── [Modulo]Pagination.test.tsx
├── [modulo].types.ts         ← tipos do domínio
└── mock-data.ts              ← dados mock
```

Registre a rota em `src/shared/constants/routes.ts` e `src/App.tsx`.
