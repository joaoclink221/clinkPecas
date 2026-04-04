import { useMemo, useRef, useState, type ReactNode } from 'react'

import { InventoryKpiCard } from './InventoryKpiCard'
import { InventorySearchBar } from './InventorySearchBar'
import { InventoryPagination } from './InventoryPagination'
import { InventoryTable } from './InventoryTable'
import { buildInventoryCsvFilename, exportInventoryToCsv } from './exportInventoryToCsv'
import { stockKpiMock, stockMockPage } from './mock-data'
import { useDebounce } from '../sales/useDebounce'

// ── Ícones inline ─────────────────────────────────────────────────────────────

const GridIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const AlertTriangleIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const CurrencyIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ImportIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const PlusIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

// ── Componente da página ───────────────────────────────────────────────────────

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // 3.2 — estado reservado para painel de filtros (expansão futura)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  // 6.3 — filtro de itens críticos (toggle pelo card Alerta Crítico)
  const [criticalOnly, setCriticalOnly] = useState(false)

  function handleCriticalFilter() {
    setCriticalOnly((prev) => !prev)
    // limpar busca de texto ao ativar o filtro crítico
    setSearchQuery('')
  }

  // 3.1 — filtragem local por skuId, name e category + filtro crítico
  const filteredItems = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim()
    let result = stockMockPage
    if (q) {
      result = result.filter(
        (item) =>
          item.skuId.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      )
    }
    if (criticalOnly) {
      result = result.filter((item) => item.stockQty < item.stockThreshold)
    }
    return result
  }, [debouncedSearch, criticalOnly])

  // 5.1 — paginação sobre o array filtrado
  const PAGE_SIZE = 10
  const [currentPage, setCurrentPage] = useState(1)
  // 5.2 — resetar para p.1 ao mudar busca: padrão derive-during-render (sem useEffect)
  const [prevSearch, setPrevSearch] = useState(debouncedSearch)
  if (prevSearch !== debouncedSearch) {
    setPrevSearch(debouncedSearch)
    setCurrentPage(1)
  }

  const pagedItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredItems, currentPage],
  )

  // Sem busca ativa: exibir total do sistema (14.282) para fidelidade ao design.
  // Com busca ativa: exibir contagem real dos resultados filtrados.
  const totalDisplayCount = debouncedSearch ? filteredItems.length : stockKpiMock.totalSkus
  const totalPages = Math.max(1, Math.ceil(totalDisplayCount / PAGE_SIZE))

  const rangeStart = totalDisplayCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, totalDisplayCount)

  // 3.3 — exportar CSV filtrado (respeita criticalOnly + busca)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(message)
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000)
  }

  function handleExport() {
    const count = exportInventoryToCsv(filteredItems, buildInventoryCsvFilename())
    showToast(`${count} ${count !== 1 ? 'SKUs exportados' : 'SKU exportado'}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 3.3 — Toast transiente de exportação */}
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-lg bg-surface-container-highest px-4 py-2.5 text-body-sm font-medium text-on-surface shadow-ambient"
        >
          {toastMessage}
        </div>
      ) : null}

      {/* ── 1.1 Header ──────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-label-technical text-on-surface-variant">
            Módulo de Gerenciamento
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-display-lg sm:tracking-display-lg">
            Controle de Estoque
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start">
          {/* Botão secundário — Lote de Entrada */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4"
          >
            <ImportIcon />
            Lote de Entrada
          </button>

          {/* Botão primário — Nova Peça */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4"
          >
            <PlusIcon />
            Nova Peça
          </button>
        </div>
      </header>

      {/* ── 3.1-3.3 Barra de busca e controles ─────────────────────── */}
      <InventorySearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filtersOpen={filtersOpen}
        onFiltersToggle={() => setFiltersOpen((prev) => !prev)}
        onExport={handleExport}
      />

      {/* ── 1.2 KPI Cards ───────────────────────────────────────────── */}
      <section aria-label="Indicadores de estoque">
        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          role="list"
        >
          {/* Card 1 — Total de SKUs Ativos */}
          <li>
            <InventoryKpiCard
              label="Total de SKUs Ativos"
              value={stockKpiMock.totalSkus.toLocaleString('pt-BR')}
              badge={`+${stockKpiMock.trendTotalSkus.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}% MOM`}
              accentClass="border-l-primary"
              icon={<GridIcon />}
            />
          </li>

          {/* Card 2 — Alerta Crítico (6.3: clicável para filtrar itens críticos) */}
          <li>
            <InventoryKpiCard
              label="Alerta Crítico"
              value={String(stockKpiMock.criticalAlerts)}
              subLabel="Itens com Baixo Estoque"
              variant="critical"
              accentClass="border-l-[#fb923c]"
              icon={<AlertTriangleIcon />}
              onClick={handleCriticalFilter}
              isActive={criticalOnly}
            />
          </li>

          {/* Card 3 — Valor Total do Inventário */}
          <li>
            <InventoryKpiCard
              label="Valor Total do Inventário"
              value={brl.format(stockKpiMock.inventoryValue)}
              variant="feature"
              accentClass="border-l-[#a855f7]"
              icon={<CurrencyIcon />}
              gradientBarClass="bg-gradient-to-r from-[#a855f7] via-[#7c3aed]/40 to-transparent"
            />
          </li>
        </ul>
      </section>

      {/* ── 4.x Tabela de SKUs ──────────────────────────────────────── */}
      <InventoryTable items={pagedItems} />

      {/* ── 5.1 Contador + 5.2 Paginação ────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-body-sm text-on-surface-variant"
          aria-live="polite"
          aria-label="Contador de registros"
        >
          {totalDisplayCount === 0
            ? 'Nenhum SKU encontrado'
            : `Exibindo ${rangeStart.toLocaleString('pt-BR')}–${rangeEnd.toLocaleString('pt-BR')} de ${totalDisplayCount.toLocaleString('pt-BR')} SKUs`}
        </p>
        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  )
}
