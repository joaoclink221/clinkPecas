---
sidebar_position: 3
title: Módulo de Clientes e Fornecedores
---

# Módulo de Clientes e Fornecedores

Rota: `/clientes`

## Responsabilidades

O módulo centraliza a gestão de **clientes** e **fornecedores** (entidades) da empresa. Permite alternar entre as duas visões via segmented control, aplicar filtros inline e acompanhar KPIs financeiros agregados. A tabela de entidades (fase 2.x) exibirá dados paginados com ações por linha.

## Estrutura do módulo

```
src/pages/clients/
├── ClientsPage.tsx              ← Componente raiz (estado + layout)
├── ClientsPage.test.tsx         ← Testes de integração (fases 1.x)
├── EntityTable.tsx              ← Tabela de entidades com 5 colunas (fases 3.x)
├── EntityTable.test.tsx         ← Testes de colunas, avatares, Financial Standing, dropdown
├── useClientsFilters.ts         ← Hook de filtragem + debounce + paginação (fases 4.x)
├── useClientsFilters.test.ts    ← Testes do hook (busca, toggle, filtros cumulativos)
├── clients.types.ts             ← Interfaces e unions do domínio
├── mock-data.ts                 ← Array de 15 entidades mock
└── mock-data.test.ts            ← Testes de integridade do mock
```

---

## Componentes

### `ClientsPage`

Componente raiz da rota `/clientes`. Gerencia o estado local do módulo.

**Estado local:**

| Variável | Tipo | Descrição |
|---|---|---|
| `activeTab` | `ActiveTab` | Aba ativa: `'clientes'` (padrão) ou `'fornecedores'` |

---

## Sub-seções visuais (fase 1.x)

### 1.1 — Header

| Elemento | Descrição |
|---|---|
| `<h1>` | "Clientes e Fornecedores" |
| Subtítulo | "Directory Management • 1,248 Records Active" (contador em `#10B981`) |
| Campo de busca | `role="searchbox"`, placeholder "Search customers or suppliers…" |
| Botão "Export CSV" | Variante secondary, `aria-label="Exportar CSV"` |
| Botão "Add Entity" | Variante primary (`bg-primary`), `aria-label="Adicionar entidade"` |

### 1.2 — Segmented Control (Toggle)

Barra pill `role="tablist"` com duas abas:
- **Clientes** — ativa por padrão (`aria-selected="true"`)
- **Fornecedores** — inativa por padrão

Ao clicar, muda `activeTab`. Sem efeito na tabela nesta fase.

```tsx
<nav role="tablist" aria-label="Alternar entre Clientes e Fornecedores">
  <button role="tab" aria-selected={activeTab === 'clientes'} ...>Clientes</button>
  <button role="tab" aria-selected={activeTab === 'fornecedores'} ...>Fornecedores</button>
</nav>
```

### 1.3 — Filtros inline

Três `<button aria-haspopup="listbox">` em linha, cada um com label muted + valor em bold + chevron. **Apenas visual** nesta fase — sem lógica de filtragem.

| Filtro | Valor padrão |
|---|---|
| TYPE | All Entities |
| STATUS | Active Only |
| BALANCE | Any |

### 1.4 — Cards KPI

Faixa inferior com 4 cards em `<article>`, acento colorido via `border-l-4`:

| Card | Accent | Valor |
|---|---|---|
| Total Receivables | `#10B981` (primary) | R$ 1.42M |
| Active Suppliers | `#7C3AED` (secondary) | 142 |
| Overdue Accounts | `#FC7C78` (tertiary) | R$ 14,802 |
| New Registrations | `#3B82F6` (blue) | 24 |

### 1.5 — Botão flutuante "+"

Botão circular `rounded-full bg-primary` posicionado com `sticky bottom-6` dentro do fluxo da página (não usa `position: fixed` global para não quebrar o layout do scroll).

`aria-label="Adicionar nova entidade"`

---

## Types

```typescript
// clients.types.ts

type ActiveTab = 'clientes' | 'fornecedores'

type EntityType = 'All Entities' | 'Cliente' | 'Fornecedor'

type EntityStatus = 'Active Only' | 'Inactive' | 'All'

type BalanceFilter = 'Any' | 'Positive' | 'Overdue'

interface KpiCardData {
  label: string        // rótulo uppercase
  value: string        // valor principal formatado
  subLabel: string     // texto descritivo
  accentClass: string  // classe Tailwind da borda esquerda
  accentColor: 'primary' | 'secondary' | 'tertiary' | 'blue'
}
```

---

## Design System aplicado

| Token | Hex | Uso nesta página |
|---|---|---|
| Primary | `#10B981` | Contador, botão Add Entity, botão flutuante, accent Total Receivables |
| Secondary | `#7C3AED` | Accent Active Suppliers |
| Tertiary | `#FC7C78` | Accent Overdue Accounts |
| Blue | `#3B82F6` | Accent New Registrations |
| Neutral | `#0D1117` | Fundo base |

Tipografia: **Inter** — `text-display-lg` (h1), `text-body-sm` (subtítulo/labels), `text-label-sm` (botões/filtros), `text-label-technical` (labels KPI uppercase).

---

---

## Types — `clients.types.ts`

### Unions principais

| Type | Valores |
|---|---|
| `EntityKind` | `'cliente' \| 'fornecedor'` |
| `AvatarIcon` | `'enterprise' \| 'person' \| 'truck' \| 'tools'` |
| `FinancialStatus` | `'ok' \| 'due' \| 'credit_ok' \| 'prepaid'` |
| `EntityStatus` | `'active' \| 'inactive'` |

### `FinancialStatus` — semântica

| Valor | Exibição na tabela | `creditLimit` | `outstandingBalance` |
|---|---|---|---|
| `ok` | Badge cinza — Outstanding R$ 0,00 | `number` | `0` |
| `due` | Barra de progresso coral | `number` | `> 0` |
| `credit_ok` | Badge verde — Credit OK | `number` | qualquer |
| `prepaid` | Badge muted — Prepaid Only / No Active Limit | `null` | `0` |

### Interface `Entity`

```typescript
interface Entity {
  id: string
  entityKind: EntityKind          // 'cliente' | 'fornecedor'
  name: string
  subtitle: string                // ex: 'Large Fleet Enterprise'
  avatarIcon: AvatarIcon
  taxId: string                   // CNPJ ou CPF já formatado
  email: string
  phone: string
  creditLimit: number | null      // null = prepaid
  outstandingBalance: number      // >= 0
  financialStatus: FinancialStatus
  status: EntityStatus
}
```

---

## Mock Data — `mock-data.ts`

`entitiesMock` contém **15 entidades** cobrindo todos os valores de `financialStatus`, `entityKind`, `avatarIcon` e `entityStatus`.

### Os 4 registros obrigatórios da referência visual

| ID | Nome | taxId | financialStatus | entityKind |
|---|---|---|---|---|
| ENT-0001 | Turbo Dynamics Inc. | 12.345.678/0001-90 | `ok` | cliente |
| ENT-0002 | Juliana Mendes | 458.122.903-22 | `due` | cliente |
| ENT-0003 | Global Logistics Hub | 33.918.452/0001-08 | `credit_ok` | fornecedor |
| ENT-0004 | Auto Fix Workshop | 08.221.445/0001-22 | `prepaid` | cliente |

### Cobertura do mock

| Dimensão | Valores cobertos |
|---|---|
| `financialStatus` | `ok`, `due`, `credit_ok`, `prepaid` ✅ |
| `entityKind` | `cliente`, `fornecedor` ✅ |
| `avatarIcon` | `enterprise`, `person`, `truck`, `tools` ✅ |
| `status` | `active`, `inactive` ✅ |

---

---

## Componente `EntityTable`

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `entities` | `Entity[]` | Lista já filtrada/paginada pelo chamador |

### Colunas

| # | Nome | Conteúdo |
|---|---|---|
| 1 | **Entity Details** | Avatar colorido (40×40px, `rounded-lg`) + nome bold + subtitle muted |
| 2 | **Tax ID / CNPJ** | `<code>` em fonte mono, CNPJ ou CPF formatado |
| 3 | **Primary Contact** | Link `mailto:email` em teal + telefone muted |
| 4 | **Financial Standing** | 4 variantes condicionais por `financialStatus` |
| 5 | **Actions** | Botão editar + botão ver ficha + kebab com dropdown |

### Avatares — `AvatarIcon`

| Valor | Fundo | Ícone | Uso típico |
|---|---|---|---|
| `enterprise` | `#064E3B` | Prédio/empresa | Grandes corporações |
| `person` | `#4C1D95` | Pessoa | Físico / B2C |
| `truck` | `#1E3A8A` | Caminhão | Transportadoras |
| `tools` | `#78350F` | Chave inglesa | Oficinas/garagens |

### Financial Standing — 4 variantes

| `financialStatus` | Exibição |
|---|---|
| `ok` | Limite em teal + "Limit" muted + "Outstanding: R$ 0,00" |
| `due` | Saldo devedor em coral + "Balance Due" + barra de progresso coral |
| `credit_ok` | Limite em teal + "Limit" + badge "Credit OK" (`#064E3B` / `#6EE7B7`) |
| `prepaid` | "R$ 0,00 Prepaid Only" + "No Active Limit" (tudo muted) |

A barra de progresso (`role="progressbar"`) usa `aria-valuenow={pct}` onde `pct = outstanding / limit * 100`, clampado 0–100.

### Dropdown kebab (3.4)

- Estado `openMenuId: string | null` dentro de `EntityTable` — somente um menu aberto por vez
- Fecha ao clicar fora via `useEffect` + `mousedown` listener no `document`
- Opções: **Ver Detalhes**, **Editar**, **Desativar** (Desativar em coral `#FC7C78`)
- Acessibilidade: `aria-haspopup="menu"`, `aria-expanded`, `role="menu"`, `role="menuitem"`

---

---

## Hook `useClientsFilters`

**Arquivo:** `useClientsFilters.ts`

Centraliza toda a lógica de filtragem local e paginação do módulo. A filtragem é **cumulativa** — todos os filtros ativos se aplicam ao mesmo tempo.

### Assinatura

```typescript
function useClientsFilters(entities: Entity[]): UseClientsFiltersReturn
```

### Estado gerenciado

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `searchQuery` | `string` | `''` | Texto do campo de busca (com debounce 300ms) |
| `activeTab` | `ActiveTab` | `'clientes'` | Aba ativa do toggle |
| `typeFilter` | `EntityTypeFilter` | `'All Entities'` | Dropdown TYPE |
| `statusFilter` | `EntityStatusFilter` | `'Active Only'` | Dropdown STATUS |
| `balanceFilter` | `BalanceFilter` | `'Any'` | Dropdown BALANCE |
| `currentPage` | `number` | `1` | Página atual |

### Valores derivados retornados

| Campo | Descrição |
|---|---|
| `filteredEntities` | Array completo após todos os filtros (antes de paginar) |
| `pagedEntities` | Fatia da página atual (`PAGE_SIZE = 10`) |
| `filteredCount` | Total de registros filtrados — exibido no contador do header |
| `totalPages` | Número de páginas (`max(1, ceil(filteredCount / PAGE_SIZE))`) |

### Pipeline de filtragem (ordem)

1. **Busca textual** — `name`, `taxId`, `email` (case-insensitive, debounce 300ms)
2. **Toggle de aba** — `activeTab === 'clientes'` filtra `entityKind === 'cliente'`
3. **Dropdown TYPE** — cumulativo com o toggle
4. **Dropdown STATUS** — `Active Only | Inactive | All`
5. **Dropdown BALANCE** — mapeia para `financialStatus`: `Credit OK` → `credit_ok`, `Balance Due` → `due`, `Prepaid` → `prepaid`

### Reset de página

Todo setter que altera um filtro chama `setCurrentPage(1)`. A busca textual reseta pelo efeito de debounce.

### Dropdown `FilterDropdown<T>` em `ClientsPage`

O componente `FilterDropdown` usa um `<select>` transparente (`opacity-0`) sobreposto ao visual customizado. Isso garante acessibilidade nativa (leitores de tela, navegação por teclado) sem JavaScript customizado.

---

## Evolução planejada

| Fase | Descrição | Status |
|---|---|---|
| 1.x | Skeleton visual: header, toggle, filtros, KPI cards, FAB | ✅ Concluído |
| 2.1 | Interface `Entity` e unions | ✅ Concluído |
| 2.2 | Mock data (15 entidades) | ✅ Concluído |
| 3.1–3.4 | Tabela de entidades: 5 colunas, avatares, Financial Standing, dropdown | ✅ Concluído |
| 4.1–4.3 | Busca, toggle e filtros cumulativos funcionais | ✅ Concluído |
| 5.x | Modal de criação/edição de entidade | 🔲 Pendente |
| 6.x | Export CSV das entidades filtradas | 🔲 Pendente |
