---
sidebar_position: 2
title: Arquitetura
---

# Arquitetura do Projeto

## Visão Geral

O clinkAutoPeças adota a **Feature-Sliced Design (FSD)** como referência de organização de código, adaptada para o porte do projeto.

```
src/
├── app/           → Providers globais (Router, ThemeProvider)
├── features/      → Casos de uso isolados (signIn, etc.)
├── pages/         → Componentes de página por módulo
├── shared/        → UI genérica e utilitários sem domínio
└── widgets/       → Blocos de UI compostos (Sidebar, Topbar)
```

## Fluxo de dados

O projeto opera **sem gerenciador de estado global** (sem Redux, Zustand ou React Query). O estado vive nas páginas e é passado por props para os componentes filhos.

```
InventoryPage (estado)
  ├── searchQuery, filtersOpen, criticalOnly   ← estado local
  ├── filteredItems   ← useMemo derivado do estado
  ├── pagedItems      ← useMemo derivado do filtro
  │
  ├── InventorySearchBar (controlado por props)
  ├── InventoryKpiCard  (recebe onClick p/ criticalOnly)
  ├── InventoryTable    (recebe pagedItems)
  └── InventoryPagination (recebe currentPage/totalPages)
```

## Design System

O design system usa **CSS custom properties** definidas em `src/index.css` e expostas como tokens Tailwind CSS. Os tokens principais são:

| Token | Uso |
|---|---|
| `--color-primary` | Cor principal (teal) |
| `--color-surface` | Fundo de superfície |
| `--color-on-surface` | Texto sobre superfície |
| `--color-outline-variant` | Bordas suaves |

### Classes utilitárias customizadas

```css
.text-label-technical  /* fonte 11px, uppercase, tracking wide */
.text-headline-sm      /* headline de cards KPI */
.text-body-sm          /* texto geral de tabelas e descrições */
.shadow-ambient        /* sombra suave de elevação */
```

## Convenções de componente

### Estrutura de página

Cada módulo segue o padrão:

```
pages/[modulo]/
├── [Modulo]Page.tsx          ← Componente de página (estado + layout)
├── [Modulo]Page.test.tsx     ← Testes de integração da página
├── [Modulo]Table.tsx         ← Tabela de dados
├── [Modulo]Table.test.tsx
├── [Modulo]KpiCard.tsx       ← Cards de KPI
├── [Modulo]SearchBar.tsx     ← Barra de busca com debounce
├── [Modulo]Pagination.tsx    ← Paginação prev/next
├── [modulo].types.ts         ← Interfaces TypeScript do domínio
└── mock-data.ts              ← Dados mock para desenvolvimento
```

### Padrão de componente controlado

Componentes de formulário são **sempre controlados** — recebem `value` e `onChange` como props. O debounce é responsabilidade da página pai, não do componente.

```tsx
// ✅ Correto — InventorySearchBar recebe estado da página
<InventorySearchBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
/>

// A página controla o debounce
const debouncedSearch = useDebounce(searchQuery, 300)
```

## Testes

O projeto usa **Vitest** como runner e **React Testing Library** para renderização de componentes.

### Filosofia de teste

- Testes focam em **comportamento do usuário**, não em implementação.
- Preferência por queries semânticas: `getByRole`, `getByLabelText`.
- Mocks são evitados — os componentes são testados com dados reais do `mock-data.ts`.

### Rodar os testes

```bash
# Modo watch (desenvolvimento)
npm test

# Uma única execução
npm run test -- --run

# Com cobertura
npm run test -- --coverage
```

## Segurança

- Dados de usuário (email/senha) nunca são expostos em logs ou estado global.
- A autenticação usa `signIn` isolado em `src/features/auth/`.
- Tokens e credenciais são mantidos fora do controle de versão via variáveis de ambiente.
