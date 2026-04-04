---
sidebar_position: 1
title: Módulo de Vendas
---

# Módulo de Vendas

Rota: `/vendas`

## Responsabilidades

O módulo de Vendas permite visualizar, filtrar, paginar e criar registros de vendas. Ele é composto por KPI cards, uma barra de filtros, uma tabela paginada e um modal de criação.

## Componentes

### `SalesPage`
Componente raiz da rota `/vendas`. Gerencia todo o estado local do módulo.

**Estado local:**

| Variável | Tipo | Descrição |
|---|---|---|
| `searchQuery` | `string` | Texto digitado no campo de busca |
| `debouncedSearch` | `string` | Busca com delay de 300ms |
| `statusFilter` | `SaleStatus \| ''` | Filtro de status ativo |
| `dateFrom` / `dateTo` | `string` | Intervalo de datas |
| `currentPage` | `number` | Página atual (padrão: 1) |
| `isModalOpen` | `boolean` | Controla visibilidade do modal |
| `localSales` | `Sale[]` | Vendas adicionadas localmente (sem reload) |

---

### `SalesFiltersBar`

Barra de busca + filtros de status e intervalo de data.

```tsx
<SalesFiltersBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  statusFilter={statusFilter}
  onStatusChange={setStatusFilter}
  dateFrom={dateFrom}
  dateTo={dateTo}
  onDateFromChange={setDateFrom}
  onDateToChange={setDateTo}
/>
```

---

### `SalesTable`

Tabela com 8 colunas: **Order ID**, **Cliente**, **Data**, **Pagamento**, **Desconto**, **Total**, **Status**, **Ações**.

Recebe `sales: Sale[]` e renderiza sem estado interno. Cada linha tem um botão de ações (3 pontos) visual.

---

### `SalesPagination`

Navegação com botões de página numerados + chevrons prev/next. Implementa a lógica de reticências (`…`) para muitas páginas.

```tsx
<SalesPagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

---

### `SaleFormModal`

Modal de criação de nova venda. Campos:
- Nome do cliente + documento
- Método de pagamento (select)
- Parcelas (condicional: aparece quando pagamento = `credit_card`)
- Desconto
- Total

Ao confirmar, adiciona a nova venda ao topo da lista sem reload de página.

---

## Tipos (`sales.types.ts`)

```typescript
type PaymentMethod = 'Pix' | 'Boleto' | 'credit_card' | 'Dinheiro'

type SaleStatus = 'completed' | 'pending' | 'cancelled'

interface Sale {
  id: string
  customerName: string
  customerDoc: string
  date: string          // ISO: YYYY-MM-DD
  paymentMethod: PaymentMethod
  installments?: number
  discount: number
  totalValue: number
  status: SaleStatus
}
```

---

## KPIs

| Card | Fonte de dados | Variante |
|---|---|---|
| Total de Vendas | `salesKpiMock.totalSales` | default |
| Receita Total | `salesKpiMock.totalRevenue` | default |
| Pedidos Pendentes | contagem derivada de `localSales` | critical |
| Ticket Médio | `salesKpiMock.avgTicket` | default |

Os KPIs de Pedidos Pendentes são **reativos** — incrementam ao criar uma nova venda com `status: 'pending'`.

---

## Hooks

### `useDebounce<T>(value: T, delay: number): T`
Retorna o valor com atraso. Localizado em `src/pages/sales/useDebounce.ts`.

### `useSalesData()`
Retorna os dados de vendas filtrados e paginados com base nos parâmetros de filtro. Localizado em `src/pages/sales/useSalesData.ts`.

### `useSalesSummary(sales: Sale[])`
Calcula os KPIs a partir de um array de vendas. Localizado em `src/pages/sales/useSalesSummary.ts`.
