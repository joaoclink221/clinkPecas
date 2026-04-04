---
sidebar_position: 3
title: Módulo de Compras
---

# Módulo de Compras

Rota: `/compras`

## Responsabilidades

O módulo de Compras centraliza o gerenciamento de ordens de compra, controle de fornecedores e métricas de suprimentos. Permite visualizar, filtrar e criar pedidos de compra com acompanhamento de status em tempo real.

## Estrutura do módulo

```
src/pages/purchases/
├── PurchasesPage.tsx              ← Componente raiz (estado + layout)
├── PurchasesPage.test.tsx         ← Testes de integração
├── PurchasesKpiCard.tsx           ← Card KPI com variantes semânticas de cor
├── PurchasesKpiCard.test.tsx      ← Testes do card KPI
├── PurchasesTable.tsx             ← Tabela de ordens (6 colunas, badges, painel de filtros, export CSV)
├── PurchasesTable.test.tsx        ← Testes da tabela (3.1–3.4, 4.2, 6.1/6.2)
├── PurchasesPagination.tsx        ← Navegação numerada prev/next com reticências
├── PurchasesPagination.test.tsx   ← Testes do componente de paginação (18 casos)
├── usePurchasesFilters.ts         ← Hook: debounce 300ms, filtros, paginação
├── usePurchasesFilters.test.ts    ← Testes unitários do hook (41 casos)
├── exportOrdersToCsv.ts           ← Utilitário puro: serialização CSV + download + filename
├── exportOrdersToCsv.test.ts      ← Testes unitários (serializeOrdersToCsv, buildCsvFilename, exportOrdersToCsv)
├── purchases.types.ts             ← Interfaces e enums do domínio
├── mock-data.ts                   ← Array de ordens + objeto KPI mock
└── mock-data.test.ts              ← Testes de integridade do mock
```

---

## Tipos (`purchases.types.ts`)

```typescript
type PurchaseStatus = 'received' | 'pending' | 'cancelled'

type SupplierTag =
  | 'PREMIUM VENDOR'
  | 'LOGISTICS PENDING'
  | 'DIRECT IMPORT'
  | 'CREDIT HOLD'
  | 'REGIONAL WHOLESALER'

type PurchaseOrder = {
  id: string            // ex.: "PUR-8821"
  supplier: string      // ex.: "Bosch Global Parts"
  supplierTag: SupplierTag
  issueDate: string     // ISO: "YYYY-MM-DD"
  totalValue: number    // BRL sem formatação
  status: PurchaseStatus
}

type PurchasesKpiMock = {
  totalMonthly: number       // soma dos valores do mês
  pendingOrders: number      // count status === 'pending'
  receivedLast30d: number    // count status === 'received'
  cancelledOrders: number    // count status === 'cancelled'
  trendTotalMonthly: number  // variação % MOM
  deliveryEfficiency: number // eficiência de entrega %
  totalInvestment: number    // investimento total Out (BRL)
  avgTicket: number          // ticket médio por pedido (BRL)
  avgPaymentDays: number     // prazo médio pagamento (dias)
}
```

---

## Componentes

### `PurchasesPage`

Componente raiz da rota `/compras`. Gerencia o estado local do módulo.

**Estado local (etapa atual):**

| Variável | Tipo | Descrição |
|---|---|---|
| `searchQuery` | `string` | Texto do campo de busca global (visual nesta etapa) |

**Layout da página:**

1. **Busca global** — input de busca com placeholder "Buscar pedido ou fornecedor…"
2. **Header** — h1 "Ordens de Compra", subtítulo e botão "Novo Pedido"
3. **KPI Cards** — grid 4 colunas com indicadores de suprimentos
4. **Tabela de ordens** — `PurchasesTable` com header do card, 6 colunas e menu kebab por linha
5. **Rodapé de métricas** — barra sticky-bottom com 3 métricas + badge Sync Active

`PurchasesPage` consome o hook `usePurchasesFilters()` para toda a lógica de estado de busca e filtros, passando `filteredOrders` e o objeto `filterPanel` para `PurchasesTable`.

---

### `PurchasesKpiCard`

Card KPI com sistema de variantes semânticas de cor, desenhado para o domínio de compras.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `label` | `string` | ✓ | Rótulo do indicador (exibido na cor de acento) |
| `value` | `string` | ✓ | Valor principal já formatado |
| `variant` | `PurchasesKpiCardVariant` | ✓ | Variante semântica de cor |
| `subLabel` | `string?` | — | Texto secundário abaixo do valor |
| `badge` | `string?` | — | Badge de tendência (ex.: "↑ +12,5% vs mês anterior") |
| `icon` | `ReactNode?` | — | Ícone no canto superior direito |

**Variantes disponíveis:**

| Variante | Cor | Semântica |
|---|---|---|
| `success` | `#10b981` (verde) | Indicadores positivos — Total Mensal |
| `purple` | `#a855f7` (roxo) | Pendências e alertas suaves — Pedidos Pendentes |
| `info` | `#06b6d4` (cyan) | Informações neutras — Recebidos 30d |
| `danger` | `#f87171` (coral) | Erros e cancelamentos — Cancelados |

---

## KPI Cards da página

| Card | Valor (mock) | Variante | Informação extra |
|---|---|---|---|
| Total Mensal | R$ 142.850 | `success` | Badge "+12,5% vs mês anterior" |
| Pedidos Pendentes | 24 | `purple` | SubLabel "Aguardando confirmação" |
| Recebidos (30d) | 118 | `info` | SubLabel "Eficiência de entrega: 94%" |
| Cancelados | 03 | `danger` | SubLabel "Falha no fornecimento" |

---

## Rodapé de métricas (1.3)

Barra `sticky bottom-0` com fundo translúcido (`backdrop-blur`) que permanece visível durante o scroll.

**Métricas exibidas (hardcoded nesta etapa):**

| Métrica | Valor |
|---|---|
| Investimento Total Out | R$ 1.244.500,00 |
| Ticket Médio Pedido | R$ 5.120,00 |
| Prazo Médio Pagamento | 42 Dias |

**Badge Sync Active:**
- Cor verde `#10b981`
- Animação `animate-ping` (Tailwind) no ponto de status
- `aria-label="Status de sincronização: ativo"` para acessibilidade

---

## Acessibilidade

- Busca global usa `role="searchbox"` e `aria-label` descritivo
- Cards KPI têm `role="article"` e `aria-label` com o nome do indicador
- Badge `success` do badge de tendência tem `aria-label="Indicador: ..."` 
- Section KPIs tem `aria-label="Indicadores de compras"`
- Rodapé tem `aria-label="Métricas de suprimentos"` e badge com `aria-label` de status

---

## Hook `usePurchasesFilters`

Encapsula toda a lógica de filtragem local (4.1 e 4.2), mantendo `PurchasesPage` e `PurchasesTable` livres de lógica de domínio.

### Retorno

| Campo | Tipo | Descrição |
|---|---|---|
| `searchQuery` / `setSearchQuery` | `string` | Texto imediato do input de busca |
| `statusFilter` / `setStatusFilter` | `PurchaseStatusFilter` | `'all' \| 'received' \| 'pending' \| 'cancelled'` |
| `dateFrom` / `setDateFrom` | `string` | Data inicial ISO (`YYYY-MM-DD`) ou vazio |
| `dateTo` / `setDateTo` | `string` | Data final ISO ou vazio |
| `isFiltersOpen` | `boolean` | Controla visibilidade do painel de filtros |
| `toggleFilters` / `closeFilters` | `() => void` | Abre/fecha o painel |
| `filteredOrders` | `PurchaseOrder[]` | Array derivado do mock após aplicar todos os filtros |
| `activeFilterCount` | `number` | Conta filtros ativos (exceto busca textual) |
| `clearFilters` | `() => void` | Reseta status + datas + página + fecha painel |
| `currentPage` / `setCurrentPage` | `number` | Página atual (1-indexed) |
| `pageSize` | `number` | Itens por página (fixo em 5) |
| `paginatedOrders` | `PurchaseOrder[]` | Slice de `filteredOrders` para a página atual |
| `totalPages` | `number` | `Math.max(1, Math.ceil(filteredOrders.length / 5))` |
| `totalFilteredCount` | `number` | `filteredOrders.length` — para o contador de resultados |

### Comportamento

- **Debounce 300ms** (4.1): busca textual aplica filtro 300ms após último keystroke, evitando recalculações a cada tecla
- **Filtro textual** (4.1): case-insensitive, busca em `id` e `supplier`
- **Filtro de status** (4.2): filtra por `status === statusFilter` quando ≠ `'all'`
- **Filtro de data** (4.2): comparação lexicográfica de strings ISO (`issueDate >= dateFrom`, `issueDate <= dateTo`)
- **`clearFilters`** não limpa `searchQuery` (comportamento intencional — busca e filtros são dimensões independentes)
- `filteredOrders`, `paginatedOrders`, `totalPages` são calculados via `useMemo` — sem re-renders desnecessários
- **Reset de página** (5.1): `setStatusFilter`, `setDateFrom`, `setDateTo` e `clearFilters` chamam `setCurrentPage(1)` diretamente (sem `useEffect` — evita renders em cascata); o debounce reseta a página dentro do `setTimeout` (assíncrono)

---

## Componente `PurchasesPagination`

Navegação numerada estilo GitHub Pagination, seguindo o mesmo padrão de `SalesPagination`.

### Props

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `currentPage` | `number` | ✓ | Página ativa (1-indexed) |
| `totalPages` | `number` | ✓ | Total de páginas |
| `onPageChange` | `(page: number) => void` | ✓ | Callback ao navegar |

### Comportamento

- **`totalPages <= 1`**: retorna `null` (não renderiza nada)
- **Botão Prev**: desabilitado quando `currentPage === 1`
- **Botão Next**: desabilitado quando `currentPage === totalPages`
- **Página ativa**: `aria-current="page"`, estilo `bg-primary text-on-primary`
- **Reticências**: `buildPageItems` (função interna) exibe `…` entre grupos não-adjacentes quando `totalPages > 7`; sempre mostra primeira, última e janela de ±1 ao redor da página atual

### Contador de resultados (`PurchasesPage`)

Renderizado acima do componente de paginação:

```
Mostrando [paginatedOrders.length] de [totalFilteredCount] resultado(s)
```

- `aria-live="polite"` + `aria-atomic="true"` para anunciar mudanças a leitores de tela

---

## Componente `PurchasesTable`

### Props

| Prop | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `orders` | `PurchaseOrder[]` | ✓ | Lista de ordens a renderizar (já filtrada e paginada) |
| `filterPanel` | `FilterPanelProps` | ✓ | Estado e handlers do painel de filtros (ver abaixo) |
| `onExportCsv` | `() => number` | ✓ | Callback chamado ao clicar em "Exportar CSV"; retorna o nº de registros exportados para o toast (6.1) |

### Estrutura visual (3.4 → 3.1)

O componente é composto por duas partes:

**Header do card (3.4 / 4.2)**
- Ícone de grade verde (`#10b981`) + label `LISTAGEM DE ORDENS` em uppercase muted
- Botão `Filtros`: chama `filterPanel.onToggle`; muda visual (teal) quando `isOpen` ou `activeCount > 0`; exibe badge circular com `activeCount`
- Botão `Exportar CSV`: chama `props.onExportCsv()` ao clicar; exibe toast `"X ordens exportadas"` (ou `"1 ordem exportada"` no singular) por 3 s (6.1/6.2)

**Tabela (3.1)**

| Coluna | Conteúdo | Detalhe visual |
|---|---|---|
| ID Pedido | `#PUR-XXXX` | `font-mono`, cor `#10b981` |
| Fornecedor | Nome em bold + `supplierTag` abaixo | Tag em 11px uppercase muted |
| Data Emissão | ISO → pt-BR (`12 de out. de 2023`) | `text-on-surface-variant` |
| Valor Total | BRL com 2 casas decimais | Alinhado à direita, `font-semibold` |
| Status | `PurchaseStatusBadge` pill | 3 variantes (ver abaixo) |
| Ações | `KebabMenu` — 3 opções | Fecha ao clicar fora |

**Painel de filtros inline (4.2)**

Renderizado condicionalmente (`filterPanel.isOpen`) entre o header e a tabela:
- `<select>` de status — 4 opções: Todos, Received, Pending, Cancelled
- `<fieldset>` de intervalo de datas — 2 `<input type="date">`
- Botão `Limpar filtros` — chama `filterPanel.onClear`
- `role="region"` + `aria-label="Painel de filtros"` para acessibilidade

**`FilterPanelProps`** (exportado de `PurchasesTable.tsx`):

```typescript
type FilterPanelProps = {
  isOpen: boolean
  onToggle: () => void
  status: PurchaseStatusFilter          // 'all' | 'received' | 'pending' | 'cancelled'
  onStatusChange: (s: PurchaseStatusFilter) => void
  dateFrom: string                      // 'YYYY-MM-DD' ou ''
  onDateFromChange: (d: string) => void
  dateTo: string
  onDateToChange: (d: string) => void
  onClear: () => void
  activeCount: number
}
```

### Badges de status (3.2)

| Status | Fundo | Texto | Borda |
|---|---|---|---|
| `received` | `#065f46/30` | `#10b981` (teal) | `#10b981/25` |
| `pending` | `#5b21b6/25` | `#c084fc` (lilás) | `#7c3aed/30` |
| `cancelled` | `#7f1d1d/25` | `#f87171` (coral) | `#ef4444/30` |

Padding horizontal `px-3` (≈ 12px), `border-radius: 9999px` (`rounded-full`), texto `uppercase`.

### Menu kebab (3.3)

Opções disponíveis: **Ver Detalhes**, **Editar Ordem**, **Cancelar**.

- Apenas um menu aberto por vez (estado `openMenuId: string | null` em `PurchasesTable`)
- Fecha ao clicar em qualquer opção
- Fecha ao clicar fora do container (`mousedown` + `useRef` via `KebabMenu` interno)
- `aria-expanded` e `aria-haspopup="menu"` no botão trigger
- `role="menu"` no `<ul>` e `role="menuitem"` nos botões de opção

---

## Utilitário `exportOrdersToCsv`

`src/pages/purchases/exportOrdersToCsv.ts` — funções puras, sem efeitos colaterais além do download.

### `serializeOrdersToCsv(orders: PurchaseOrder[]): string`

Converte array em CSV (RFC 4180):
- **Cabeçalho**: `ID Pedido,Fornecedor,Data Emissão,Valor Total,Status`
- **Separador**: vírgula
- **Escaping**: campos com vírgula/aspas/quebra de linha são envolvidos em aspas duplas; aspas internas duplicadas
- Array vazio → retorna apenas o cabeçalho

### `buildCsvFilename(date?: Date): string`

Gera nome do arquivo no formato `ordens-compra-YYYY-MM-DD.csv` usando `getUTC*` para garantir consistência em qualquer fuso horário.

### `exportOrdersToCsv(orders: PurchaseOrder[], filename: string): number`

1. Chama `serializeOrdersToCsv(orders)` para gerar a string CSV
2. Cria `Blob` com `type: 'text/csv;charset=utf-8;'`
3. `URL.createObjectURL(blob)` → URL temporária
4. Cria `<a>` com `href` e `download`, estilo `display:none`
5. Apende ao `document.body`, `.click()`, remove do body
6. `URL.revokeObjectURL(url)`
7. Retorna `orders.length` para o toast

### Integração em `PurchasesPage`

```typescript
onExportCsv={() => exportOrdersToCsv(filteredOrders, buildCsvFilename())}
```

`filteredOrders` é o array **completo filtrado** (não apenas a página visível), garantindo que o CSV respeite o filtro ativo (6.2).

---

## Acessibilidade (atualizado)

- Busca global usa `role="searchbox"` e `aria-label` descritivo
- Cards KPI têm `role="article"` e `aria-label` com o nome do indicador
- Section KPIs tem `aria-label="Indicadores de compras"`
- Seção da tabela tem `aria-label="Listagem de ordens de compra"` (`role="region"`)
- Tabela tem `aria-label="Tabela de ordens de compra"`
- Badges de status têm `aria-label="Status: Received/Pending/Cancelled"`
- Botão kebab tem `aria-expanded`, `aria-haspopup="menu"` e `aria-label` com ID da ordem
- Coluna de ações tem `<span class="sr-only">Ações</span>`
- Rodapé tem `aria-label="Métricas de suprimentos"` e badge com `aria-label` de status
- Contador de resultados tem `aria-live="polite"` e `aria-atomic="true"`
- Nav de paginação tem `aria-label="Paginação de ordens de compra"`
- Botões de página têm `aria-label="Página N"` e `aria-current="page"` na ativa
- Toast de exportação tem `role="status"` e `aria-live="polite"` — anunciado por leitores de tela

---

## Evolução planejada

| Etapa | Funcionalidade |
|---|---|
| ✅ 2.x | Tipos de domínio (`purchases.types.ts`) + mock data (15 ordens + KPIs) |
| ✅ 3.x | Tabela de ordens (`PurchasesTable`) — 6 colunas, badges, kebab, header do card |
| ✅ 4.x | Busca com debounce 300ms (4.1) + filtros status/data inline (4.2) via `usePurchasesFilters` |
| ✅ 5.x | Paginação local (5.1) + componente visual numerado `PurchasesPagination` (5.2) |
| ✅ 6.x | Exportar CSV filtrado (6.1) + toast de confirmação respeitando filtro ativo (6.2) |
| 7.x | Modal de criação de nova ordem (`PurchaseFormModal`) |
| 7.x | Ordenação de colunas |
| 8.x | Dados reais via API |
