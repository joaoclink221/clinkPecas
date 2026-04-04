import { type ReactNode } from 'react'

import { PurchasesKpiCard } from './PurchasesKpiCard'
import { PurchasesPagination } from './PurchasesPagination'
import { PurchasesTable } from './PurchasesTable'
import { buildCsvFilename, exportOrdersToCsv } from './exportOrdersToCsv'
import { purchasesKpiMock } from './mock-data'
import { usePurchasesFilters } from './usePurchasesFilters'

// ── Formatadores ─────────────────────────────────────────────────────────────

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const brlDecimals = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// ── Ícones inline ─────────────────────────────────────────────────────────────

const PlusIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const SearchIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden
    className="h-4 w-4 shrink-0 text-on-surface-variant">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const TrendingUpIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const ClipboardIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

const CheckCircleIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const XCircleIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

// ── Componente da página ──────────────────────────────────────────────────────

export function PurchasesPage() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isFiltersOpen,
    toggleFilters,
    activeFilterCount,
    clearFilters,
    filteredOrders,
    paginatedOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    totalFilteredCount,
    pageSize,
  } = usePurchasesFilters()

  return (
    <div className="flex flex-col gap-6">

      {/* ── 1.1 Busca global ─────────────────────────────────────────── */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <SearchIcon />
        </span>
        <input
          id="purchases-search"
          type="search"
          role="searchbox"
          aria-label="Buscar pedido ou fornecedor"
          placeholder="Buscar pedido ou fornecedor…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low py-2 pl-9 pr-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* ── 1.1 Header ───────────────────────────────────────────────── */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-display-lg sm:tracking-display-lg">
            Ordens de Compra
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Gerenciamento de suprimentos e relações com fornecedores
          </p>
        </div>

        <div className="self-start sm:self-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#10b981] px-5 py-2.5 text-label-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981] [&>svg]:h-4 [&>svg]:w-4"
          >
            <PlusIcon />
            Novo Pedido
          </button>
        </div>
      </header>

      {/* ── 1.2 KPI Cards ────────────────────────────────────────────── */}
      <section aria-label="Indicadores de compras">
        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          role="list"
        >
          {/* Card 1 — Total Mensal (verde) */}
          <li>
            <PurchasesKpiCard
              label="Total Mensal"
              value={brl.format(purchasesKpiMock.totalMonthly)}
              badge={`↑ +${purchasesKpiMock.trendTotalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}% vs mês anterior`}
              variant="success"
              icon={<TrendingUpIcon />}
            />
          </li>

          {/* Card 2 — Pedidos Pendentes (roxo) */}
          <li>
            <PurchasesKpiCard
              label="Pedidos Pendentes"
              value={String(purchasesKpiMock.pendingOrders).padStart(2, '0')}
              subLabel="Aguardando confirmação"
              variant="purple"
              icon={<ClipboardIcon />}
            />
          </li>

          {/* Card 3 — Recebidos 30d (cyan) */}
          <li>
            <PurchasesKpiCard
              label="Recebidos (30d)"
              value={String(purchasesKpiMock.receivedLast30d)}
              subLabel={`Eficiência de entrega: ${purchasesKpiMock.deliveryEfficiency}%`}
              variant="info"
              icon={<CheckCircleIcon />}
            />
          </li>

          {/* Card 4 — Cancelados (coral) */}
          <li>
            <PurchasesKpiCard
              label="Cancelados"
              value={String(purchasesKpiMock.cancelledOrders).padStart(2, '0')}
              subLabel="Falha no fornecimento"
              variant="danger"
              icon={<XCircleIcon />}
            />
          </li>
        </ul>
      </section>

      {/* ── 3.x / 4.x / 5.x / 6.x Tabela de ordens (dados paginados) ──── */}
      <PurchasesTable
        orders={paginatedOrders}
        filterPanel={{
          isOpen: isFiltersOpen,
          onToggle: toggleFilters,
          status: statusFilter,
          onStatusChange: setStatusFilter,
          dateFrom,
          onDateFromChange: setDateFrom,
          dateTo,
          onDateToChange: setDateTo,
          onClear: clearFilters,
          activeCount: activeFilterCount,
        }}
        onExportCsv={() => exportOrdersToCsv(filteredOrders, buildCsvFilename())}
      />

      {/* ── 5.1 Contador + 5.2 Paginação ────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <p
          className="text-body-sm text-on-surface-variant"
          aria-live="polite"
          aria-atomic="true"
        >
          Mostrando{' '}
          <span className="font-semibold text-on-surface">
            {Math.min(pageSize, paginatedOrders.length)}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-on-surface">{totalFilteredCount}</span>{' '}
          resultado{totalFilteredCount !== 1 ? 's' : ''}
        </p>

        <PurchasesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── 1.3 Rodapé de métricas com badge Sync Active ─────────────── */}
      <footer
        aria-label="Métricas de suprimentos"
        className="sticky bottom-0 -mx-6 -mb-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 bg-surface-container-low/95 px-6 py-3 backdrop-blur md:-mx-8 md:-mb-8 md:px-8"
      >
        {/* Bloco esquerdo — 3 métricas */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-label-technical text-on-surface-variant">
              Investimento Total Out
            </span>
            <span className="text-body-sm font-semibold text-[#10b981]">
              {brlDecimals.format(purchasesKpiMock.totalInvestment)}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-label-technical text-on-surface-variant">
              Ticket Médio Pedido
            </span>
            <span className="text-body-sm font-semibold text-[#10b981]">
              {brlDecimals.format(purchasesKpiMock.avgTicket)}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-label-technical text-on-surface-variant">
              Prazo Médio Pagamento
            </span>
            <span className="text-body-sm font-semibold text-[#10b981]">
              {purchasesKpiMock.avgPaymentDays} Dias
            </span>
          </div>
        </div>

        {/* Bloco direito — badge Sync Active + copyright */}
        <div className="flex shrink-0 items-center gap-4">
          {/* Badge pulsante verde */}
          <div
            className="flex items-center gap-2"
            aria-label="Status de sincronização: ativo"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            </span>
            <span className="text-label-sm font-semibold text-[#10b981]">
              Sync Active
            </span>
          </div>

          <span className="hidden text-label-technical text-on-surface-variant sm:block">
            Obsidian Gear © {new Date().getFullYear()}
          </span>
        </div>
      </footer>

    </div>
  )
}
