---
sidebar_position: 2
title: Módulo de Estoque
---

# Módulo de Estoque

Rota: `/estoque`

## Responsabilidades

O módulo de Estoque permite visualizar, buscar, filtrar, paginar e exportar os SKUs do inventário. Exibe alertas visuais para itens com estoque abaixo do limiar crítico e oferece acesso rápido ao filtro de alertas via card KPI clicável. O botão **Exportar** gera um arquivo CSV dos itens filtrados diretamente no cliente.

## Estrutura do módulo

```
src/pages/inventory/
├── InventoryPage.tsx              ← Componente raiz (estado + layout + export handler)
├── InventoryPage.test.tsx         ← Testes de integração
├── InventoryKpiCard.tsx           ← Card KPI com variantes e interação opcional
├── InventorySearchBar.tsx         ← Barra de busca + botão Exportar
├── InventorySearchBar.test.tsx    ← Testes da barra de busca
├── InventoryTable.tsx             ← Tabela 7 colunas, badges, toast histórico, kebab
├── InventoryTable.test.tsx        ← Testes da tabela
├── InventoryPagination.tsx        ← Navegação prev/next (sem numeração)
├── InventoryPagination.test.tsx   ← Testes do componente de paginação
├── exportInventoryToCsv.ts        ← Utilitário puro: serialização CSV + download + filename
├── exportInventoryToCsv.test.ts   ← Testes unitários (25 casos)
├── inventory.types.ts             ← Interfaces e enums do domínio
├── mock-data.ts                   ← Array de 16 SKUs + objeto KPI mock
└── mock-data.test.ts              ← Testes de integridade do mock
```

---

## Componentes

### `InventoryPage`

Componente raiz da rota `/estoque`. Gerencia todo o estado local do módulo.

**Estado local:**

| Variável | Tipo | Descrição |
|---|---|---|
| `searchQuery` | `string` | Texto do campo de busca |
| `debouncedSearch` | `string` | Busca com delay de 300ms |
| `filtersOpen` | `boolean` | Reservado para painel de filtros avançados |
| `criticalOnly` | `boolean` | Quando `true`, filtra apenas itens críticos |
| `currentPage` | `number` | Página atual (padrão: 1) |
| `toastMessage` | `string \| null` | Mensagem do toast transiente de exportação (3 s) |

**Dados derivados (useMemo):**

| Variável | Descrição |
|---|---|
| `filteredItems` | `stockMockPage` filtrado por `debouncedSearch` e `criticalOnly` |
| `pagedItems` | `filteredItems` fatiado pela página atual (`PAGE_SIZE = 10`) |
| `totalDisplayCount` | Sem busca: `stockKpiMock.totalSkus`; com busca: `filteredItems.length` |
| `totalPages` | `Math.ceil(totalDisplayCount / PAGE_SIZE)` |

---

### `InventorySearchBar`

Barra de busca controlada com input debounced + botões visuais.

```tsx
<InventorySearchBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  filtersOpen={filtersOpen}
  onFiltersToggle={() => setFiltersOpen(prev => !prev)}
  onExport={handleExport}
/>
```

**Nota:** O debounce é responsabilidade da `InventoryPage` via `useDebounce`. O componente é puramente controlado.

`handleExport` em `InventoryPage` chama `exportInventoryToCsv(filteredItems, buildInventoryCsvFilename())` e exibe um toast com a contagem de itens exportados. Usa `filteredItems` (não `pagedItems`) — o CSV respeita os filtros ativos (busca + `criticalOnly`).

---

## Utilitário `exportInventoryToCsv`

`src/pages/inventory/exportInventoryToCsv.ts` — funções puras, sem efeitos colaterais além do download.

### `serializeInventoryToCsv(items: StockItem[]): string`

Converte array em CSV (RFC 4180):
- **Cabeçalho**: `SKU ID,Nome,Categoria,Estoque Atual,Estoque Máx,Limiar Crítico,Fornecedor,Preço Unitário`
- **Separador**: vírgula
- **Escaping**: campos com vírgula/aspas/quebra de linha envolvidos em aspas duplas; aspas internas duplicadas
- Array vazio → retorna apenas o cabeçalho

### `buildInventoryCsvFilename(date?: Date): string`

Gera nome no formato `inventario-YYYY-MM-DD.csv` usando `getUTC*` para consistência em qualquer fuso horário.

### `exportInventoryToCsv(items: StockItem[], filename: string): number`

1. Serializa via `serializeInventoryToCsv`
2. Cria `Blob` com `type: 'text/csv;charset=utf-8;'`
3. `URL.createObjectURL(blob)` → URL temporária
4. Cria `<a>` oculto, `.click()`, remove do body
5. `URL.revokeObjectURL(url)`
6. Retorna `items.length` para o toast

### Integração em `InventoryPage`

```typescript
function handleExport() {
  const count = exportInventoryToCsv(filteredItems, buildInventoryCsvFilename())
  showToast(`${count} ${count !== 1 ? 'SKUs exportados' : 'SKU exportado'}`)
}
```

`filteredItems` é o array **completo filtrado** (não a página visível) — o CSV respeita busca textual e `criticalOnly` simultaneamente.

---

### `InventoryKpiCard`

Card KPI reutilizável com suporte a variantes visuais e interação opcional.

**Props:**

| Prop | Tipo | Descrição |
|---|---|---|
| `label` | `string` | Rótulo do indicador |
| `value` | `string` | Valor principal formatado |
| `subLabel` | `string?` | Texto secundário |
| `badge` | `string?` | Badge de tendência (ex: "+2.4% MOM") |
| `variant` | `'default' \| 'critical' \| 'feature'` | Variante visual |
| `accentClass` | `string` | Classe da borda esquerda |
| `icon` | `ReactNode?` | Ícone no canto superior direito |
| `onClick` | `() => void?` | Torna o card clicável |
| `isActive` | `boolean?` | Exibe ring de destaque quando ativo |

O card **Alerta Crítico** usa `onClick={handleCriticalFilter}` e `isActive={criticalOnly}` para ativar/desativar o filtro de itens críticos na tabela.

---

### `InventoryTable`

Tabela com **7 colunas** e elementos visuais ricos.

| Coluna | Conteúdo |
|---|---|
| SKU ID | Fonte mono, muted |
| Nome da Peça | Bold + subtítulo muted abaixo |
| Categoria | Badge pill colorido (6 cores por categoria) |
| Nível de Estoque | Barra de progresso + quantidade + label "Reposição Urgente" |
| Fornecedor | Texto simples |
| Preço Unit. | BRL alinhado à direita |
| Ações | Ícone histórico (toast) + kebab menu (dropdown) |

#### Highlight de linha crítica (6.2)

Linhas com `stockQty < stockThreshold` recebem fundo `bg-[#fb923c]/[0.06]`.

#### Toast de histórico (6.1)

Ao clicar no ícone de histórico, exibe um toast `"Histórico em breve"` que desaparece em 2 segundos.

#### Dropdown kebab (6.1)

Abre um `<ul role="menu">` com as opções: **Editar**, **Ajustar Estoque**, **Desativar SKU**. Fecha ao clicar em qualquer opção ou no próprio botão.

---

### `InventoryPagination`

Navegação **apenas com chevrons** prev/next (sem numeração de páginas).

```tsx
<InventoryPagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

- Prev desabilitado na página 1.
- Next desabilitado na última página.
- Retorna `null` quando `totalPages <= 1`.

---

## Badges de categoria

| Categoria | Cor do badge |
|---|---|
| Motores | Roxo (`#a78bfa`) |
| Suspensão | Âmbar (`#fbbf24`) |
| Filtros | Azul (`#60a5fa`) |
| Freios | Verde-escuro (`#34d399`) |
| Elétrica | Cyan (`#22d3ee`) |
| Outros | Cinza (`#9ca3af`) |

---

## Barra de progresso de estoque

A largura da barra é `(stockQty / stockMax) * 100%`, limitada a `100%`.

| Percentual | Cor |
|---|---|
| > 50% | `bg-primary` (teal) |
| 20% – 50% | `bg-[#f59e0b]` (âmbar) |
| < 20% | `bg-[#fb923c]` (coral) |

---

## Tipos (`inventory.types.ts`)

```typescript
type Category =
  | 'Motores' | 'Suspensão' | 'Filtros'
  | 'Freios' | 'Elétrica' | 'Outros'

interface StockItem {
  skuId: string
  name: string
  subtitle: string
  category: Category
  stockQty: number      // quantidade atual
  stockMax: number      // capacidade máxima
  stockThreshold: number // limiar de alerta crítico
  supplier: string
  unitPrice: number
}

interface StockKpiMock {
  totalSkus: number       // total de SKUs no sistema
  criticalAlerts: number  // itens abaixo do threshold
  inventoryValue: number  // soma de (stockQty * unitPrice)
  trendTotalSkus: number  // variação % MOM
}
```

---

## Toast de exportação

- Renderizado em `InventoryPage` com `role="status"` e `aria-live="polite"`
- Posicionado fixo `bottom-6 right-6` (z-index 50)
- Mensagem: `"X SKUs exportados"` / `"1 SKU exportado"` (pluralização pt-BR)
- Desaparece após **3 segundos** via `setTimeout` com cleanup em `useRef`
- Não visível antes de clicar em **Exportar**

---

## Filtro crítico (6.3)

Clicar no card **Alerta Crítico** ativa `criticalOnly = true`, o que filtra `filteredItems` para mostrar apenas `stockQty < stockThreshold`. Clicar novamente desativa o filtro. Ao ativar o filtro, `searchQuery` é limpo automaticamente.
