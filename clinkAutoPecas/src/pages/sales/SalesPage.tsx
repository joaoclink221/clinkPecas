import { useState, type ReactNode } from 'react'

import { SaleFormModal } from './SaleFormModal'
import { SalesFiltersBar, type StatusFilterValue } from './SalesFiltersBar'
import { SalesKpiCard } from './SalesKpiCard'
import { SalesPagination } from './SalesPagination'
import { SalesTable } from './SalesTable'
import type { Sale } from './sales.types'
import { useDebounce } from './useDebounce'
import { useSalesData } from './useSalesData'
import { useSalesSummary } from './useSalesSummary'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function formatTrend(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
}

const TrendingUpIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const ClipboardIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

const TagIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const AlertCircleIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const PAGE_SIZE = 10

export function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-01-31')
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localSales, setLocalSales] = useState<Sale[]>([])

  const debouncedSearch = useDebounce(searchQuery, 300)

  // 5.3 — Handlers que resetam currentPage junto com cada filtro
  function handleSearchChange(v: string) { setSearchQuery(v); setCurrentPage(1) }
  function handleDateFromChange(v: string) { setDateFrom(v); setCurrentPage(1) }
  function handleDateToChange(v: string) { setDateTo(v); setCurrentPage(1) }
  function handleStatusChange(v: StatusFilterValue) { setStatusFilter(v); setCurrentPage(1) }

  // 6.2 — Dados paginados e filtrados via hook (mock ou API real)
  const { sales: pagedSales, total } = useSalesData(
    { page: currentPage, pageSize: PAGE_SIZE, search: debouncedSearch, dateFrom, dateTo, status: statusFilter },
    { prepend: localSales },
  )

  // 6.3 — KPIs atualizados com optimistic inserts
  const { summary } = useSalesSummary(localSales)

  // 6.1 — Callback após criar venda: insere otimisticamente e volta para página 1
  function handleSaleCreated(sale: Sale) {
    setLocalSales((prev) => [sale, ...prev])
    setCurrentPage(1)
    setIsModalOpen(false)
  }

  // KPI cards dinâmicos derivados do summary (atualiza após nova venda)
  const kpiCards = [
    {
      id: 'monthly-revenue',
      label: 'Receita Mensal',
      value: brl.format(summary.monthlyRevenue),
      subLabel: 'vs. mês anterior',
      badge: formatTrend(summary.trends.monthlyRevenue),
      badgeVariant: 'positive' as const,
      accentClass: 'border-l-primary',
      icon: <TrendingUpIcon />,
    },
    {
      id: 'pending-orders',
      label: 'Pedidos Pendentes',
      value: String(summary.pendingOrders),
      subLabel: 'Aguardando liberação',
      badge: formatTrend(summary.trends.pendingOrders),
      badgeVariant: 'warning' as const,
      accentClass: 'border-l-secondary',
      icon: <ClipboardIcon />,
    },
    {
      id: 'avg-ticket',
      label: 'Ticket Médio',
      value: brl.format(summary.avgTicket),
      subLabel: 'Por pedido',
      badge: formatTrend(summary.trends.avgTicket),
      badgeVariant: 'positive' as const,
      accentClass: 'border-l-[#60a5fa]',
      icon: <TagIcon />,
    },
    {
      id: 'cancellations',
      label: 'Cancelamentos',
      value: `${summary.cancellationRate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`,
      subLabel: 'Taxa do período',
      badge: formatTrend(summary.trends.cancellationRate),
      badgeVariant: 'positive' as const,
      accentClass: 'border-l-on-error-container',
      icon: <AlertCircleIcon />,
    },
  ]

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const firstItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const lastItem = Math.min(currentPage * PAGE_SIZE, total)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-label-sm text-on-surface-variant" role="list">
              <li>Portal</li>
              <li aria-hidden>/</li>
              <li className="font-medium text-on-surface" aria-current="page">
                Gestão de Vendas
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-display-lg sm:tracking-display-lg">
            Vendas.
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Acompanhe pedidos, receita e desempenho comercial em tempo real.
          </p>
        </div>

        <div className="self-start">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Nova Venda
          </button>
        </div>
      </header>

      {/* ── KPI cards ────────────────────────────────────────────── */}
      <section aria-label="Indicadores de vendas">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4" role="list">
          {kpiCards.map((kpi) => (
            <li key={kpi.id}>
              <SalesKpiCard
                label={kpi.label}
                value={kpi.value}
                subLabel={kpi.subLabel}
                badge={kpi.badge}
                badgeVariant={kpi.badgeVariant}
                accentClass={kpi.accentClass}
                icon={kpi.icon}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3.x Filtros ────────────────────────────────────────────── */}
      <SalesFiltersBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* ── Tabela de transações ───────────────────────────────────── */}
      <section aria-label="Tabela de vendas">
        <p className="mb-2 text-body-sm text-on-surface-variant" aria-live="polite">
          Mostrando {firstItem}–{lastItem} de {total} transa{total !== 1 ? 'ções' : 'ção'}
        </p>
        <SalesTable sales={pagedSales} />
        <div className="mt-4">
          <SalesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* ── Modal Nova Venda ──────────────────────────────────────── */}
      <SaleFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleSaleCreated}
      />

    </div>
  )
}
