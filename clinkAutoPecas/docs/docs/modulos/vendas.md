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

Modal de criação de nova venda. Redesenhado para suportar o fluxo completo de "Geração de Orçamento & Venda Direta".

#### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `open` | `boolean` | Controla visibilidade do modal |
| `onClose` | `() => void` | Callback disparado ao fechar (X, CANCELAR, overlay) |
| `onCreated` | `(sale: Sale) => void` | Callback após submit bem-sucedido (implementado nas fases 2.x+) |

#### Estrutura visual (fases 1.1 e 1.2)

**Header:** ícone de carrinho teal (`CartIcon`), `h2` "Nova Venda" bold, subtítulo "GERAÇÃO DE ORÇAMENTO & VENDA DIRETA" uppercase muted, botão X (`aria-label="Fechar modal"`).

**Corpo:** seções `SectionSlot` placeholder — substituídas pelos campos reais nas fases 2.x+:
- Seleção de Cliente + Vendedor Responsável (grid 2 colunas)
- Itens da Venda (largura total)
- Forma de Pagamento + Resumo/Totais (grid 2 colunas)

**Rodapé:** botão ghost "CANCELAR" (uppercase) + botão primário teal "Finalizar Venda" (`CheckCircleIcon`).

#### Lógica de habilitação do botão "Finalizar Venda"

```ts
const isFormValid =
  selectedClient !== null &&   // cliente selecionado (fase 2.x)
  items.length > 0 &&          // ao menos 1 item na tabela (fase 2.x)
  paymentMethod !== null        // forma de pagamento escolhida (fase 2.x)
```

Botão desabilitado (`disabled={!isFormValid}`) ao abrir o modal. Será habilitado após implementação das seções nas fases 2.x+.

#### Fases de implementação

| Fase | Descrição | Status |
|---|---|---|
| 1.1 | Modal + overlay + header (CartIcon, h2, subtítulo, X) | ✅ Concluído |
| 1.2 | Rodapé: CANCELAR + Finalizar Venda (disabled logic) | ✅ Concluído |
| 2.1 | Tipos `Client`, `Product`, `SaleItem`, `SaleFormPaymentMethod` + mocks | ✅ Concluído |
| 2.2 | Estado inicial `SaleFormState` com 2 itens da imagem e `discountRate: 0.10` | ✅ Concluído |
| 3.1 | Dropdown "Seleção de Cliente" — select customizado com `clientsMock`, chevron, estado controlado | ✅ Concluído |
| 3.2 | Campo "Vendedor Responsável" readonly — `SELLER` hardcoded, `BadgeIcon`, fundo distinto | ✅ Concluído |
| 4.1 | Tabela de itens 5 colunas — nome/SKU, qty input, preço unit, subtotal derivado, ações | ✅ Concluído |
| 4.2 | Edição de quantidade reativa — clamp ≥1, recalculo imediato do subtotal | ✅ Concluído |
| 4.3 | Remoção de item com lixeira coral — estado vazio + Finalizar Venda disable | ✅ Concluído |
| 4.4 | Botão "Adicionar Produto" teal com dropdown popover — increment se já existe | ✅ Concluído |
| 5.1 | `PaymentToggle` — 4 pills PIX/Cartão/Boleto/Faturado, `aria-pressed`, PIX padrão | ✅ Concluído |
| 5.2 | `SummaryPanel` — Subtotal, Desconto (coral), Total Líquido (teal 32px), reativo | ✅ Concluído |
| 5.3 | Badge "Cupom Aplicado: -X%" visível quando `discountRate > 0`; calcula sobre `gross` | ✅ Concluído |
| 6.1 | Validação no clique: guards `selectedClient`, `items.length`, `paymentMethod` — toast específico por falha | ✅ Concluído |
| 6.2 | Submit mock 800ms: spinner `Finalizando…`, toast sucesso com total líquido, fechar + reset | ✅ Concluídos |

---

## Tipos (`sales.types.ts`)

```typescript
type PaymentMethod = 'Pix' | 'Boleto' | 'Cartão' | 'Dinheiro'

/** Opções de pagamento no formulário de nova venda */
type SaleFormPaymentMethod = 'pix' | 'cartao' | 'boleto' | 'faturado'

type Client  = { id: string; name: string }

type Product = { sku: string; name: string; unitPrice: number }

/** subtotal é sempre derivado via computeSubtotal(item) — nunca armazenado */
type SaleItem = { product: Product; quantity: number }

type SaleStatus = 'completed' | 'pending' | 'cancelled'

type Sale = {
  id: string
  customerName: string
  customerDoc: string      // CPF ou CNPJ
  date: string            // ISO 8601: YYYY-MM-DD
  paymentMethod: PaymentMethod
  installments?: number
  discount: number
  totalValue: number
  status: SaleStatus
}
```

---

## Mocks e utilitários (`saleFormMocks.ts`)

| Exportação | Tipo | Descrição |
|---|---|---|
| `SELLER` | `string` | Vendedor fixo: `"Carlos Alberto (ID: 442)"` |
| `clientsMock` | `Client[]` | 5 clientes de exemplo |
| `productsMock` | `Product[]` | 6+ produtos, incluindo os 2 da imagem |
| `INITIAL_SALE_ITEMS` | `SaleItem[]` | 2 itens pré-carregados para visualização |
| `computeSubtotal(item)` | `(SaleItem) => number` | `unitPrice × quantity` — único ponto de cálculo de subtotal |
| `computeTotal(items, rate)` | `(SaleItem[], number) => number` | Gross × (1 − rate), com clamp 0–1 no rate |

### Produtos presentes em `productsMock`

| SKU | Nome | Preço unitário |
|---|---|---|
| `OG-TB-001` | Turbo Compressor T3 Titanium | R$ 4.500 |
| `OG-IJ-992` | Kit Injeção Eletrônica RaceSpec | R$ 3.450 |
| `OG-FL-210` | Filtro de Óleo Performance Pro | R$ 189 |
| `OG-SU-430` | Suspensão Esportiva Coilover | R$ 2.800 |
| `OG-FR-055` | Disco de Freio Ventilado 330mm | R$ 620 |
| `OG-EC-770` | ECU Programável Stage 3 | R$ 1.950 |

### Estado inicial (`INITIAL_FORM_STATE` em `SaleFormModal.tsx`)

```ts
const INITIAL_FORM_STATE: SaleFormState = {
  selectedClient: null,
  items:          INITIAL_SALE_ITEMS,   // Turbo × 2 + Kit Injeção × 1
  paymentMethod:  null,
  couponCode:     '',
  discountRate:   0.10,                 // simula cupom de -10 % da imagem
}
```

Com esses valores, `computeTotal(INITIAL_SALE_ITEMS, 0.10)` retorna **R$ 11.205** — idêntico ao total da imagem.

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
