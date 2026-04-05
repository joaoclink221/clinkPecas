import { type ReactNode } from 'react'

import type { BalanceFilter, EntityStatusFilter, EntityTypeFilter, KpiCardData } from './clients.types'
import { ClientsPagination } from './ClientsPagination'
import { EntityTable } from './EntityTable'
import { buildEntitiesCsvFilename, exportEntitiesToCsv } from './exportEntitiesToCsv'
import { entitiesMock } from './mock-data'
import { useClientsFilters } from './useClientsFilters'

// ── Ícones inline ─────────────────────────────────────────────────────────────

const DownloadIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 13 7 8" />
    <line x1="12" y1="3" x2="12" y2="13" />
  </svg>
)

const PlusIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const UserPlusIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)

const ChevronDownIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-3.5 w-3.5 shrink-0">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// ── Dados estáticos KPI ───────────────────────────────────────────────────────

const KPI_CARDS: KpiCardData[] = [
  {
    label: 'Total Receivables',
    value: 'R$ 1.42M',
    subLabel: '+12% from last month',
    accentClass: 'border-l-[#10B981]',
    accentColor: 'primary',
  },
  {
    label: 'Active Suppliers',
    value: '142',
    subLabel: 'Managing 8,200 SKUs',
    accentClass: 'border-l-[#7C3AED]',
    accentColor: 'secondary',
  },
  {
    label: 'Overdue Accounts',
    value: 'R$ 14,802',
    subLabel: '8 Critical follow-ups needed',
    accentClass: 'border-l-[#FC7C78]',
    accentColor: 'tertiary',
  },
  {
    label: 'New Registrations',
    value: '24',
    subLabel: 'Last 7 days activity',
    accentClass: 'border-l-[#3B82F6]',
    accentColor: 'blue',
  },
]

// ── Estilos reutilizáveis ─────────────────────────────────────────────────────

const secondaryBtn =
  'inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4'

const primaryBtn =
  'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4'

// ── Sub-componentes ───────────────────────────────────────────────────────────

// 1.3 — Dropdown de filtro inline (funcional a partir de 4.3)
interface FilterDropdownProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  ariaLabel: string
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  ariaLabel,
}: FilterDropdownProps<T>): ReactNode {
  return (
    <div className="relative inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-2 text-label-sm text-on-surface hover:bg-surface-container-highest [&:focus-within]:border-primary [&:focus-within]:ring-1 [&:focus-within]:ring-primary">
      <span className="pointer-events-none text-on-surface-variant">{label}:</span>
      <span className="pointer-events-none font-semibold">{value}</span>
      <ChevronDownIcon />
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

// 1.4 — Card KPI
interface KpiCardProps {
  card: KpiCardData
}

function KpiCard({ card }: KpiCardProps): ReactNode {
  return (
    <article
      className={`flex flex-1 flex-col gap-2 border-l-4 bg-surface-container-low px-5 py-4 ${card.accentClass}`}
      aria-label={card.label}
    >
      <p className="text-label-technical text-on-surface-variant uppercase tracking-widest">
        {card.label}
      </p>
      <p className="text-3xl font-bold text-on-surface">{card.value}</p>
      <p className="text-body-sm text-on-surface-variant">{card.subLabel}</p>
    </article>
  )
}

// ── Opções dos dropdowns ─────────────────────────────────────────────────────

const TYPE_OPTIONS: readonly EntityTypeFilter[] = ['All Entities', 'Cliente', 'Fornecedor']
const STATUS_OPTIONS: readonly EntityStatusFilter[] = ['Active Only', 'Inactive', 'All']
const BALANCE_OPTIONS: readonly BalanceFilter[] = ['Any', 'Credit OK', 'Balance Due', 'Prepaid']

// ── Componente principal ──────────────────────────────────────────────────────

export function ClientsPage(): ReactNode {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    balanceFilter,
    setBalanceFilter,
    pagedEntities,
    filteredEntities,
    filteredCount,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
  } = useClientsFilters(entitiesMock)

  function handleExportCsv() {
    exportEntitiesToCsv(filteredEntities, buildEntitiesCsvFilename())
  }

  const firstItem = filteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastItem = Math.min(currentPage * pageSize, filteredCount)

  return (
    <div className="relative flex flex-col gap-6">

      {/* ── 1.1 Header ────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4">
        {/* Linha 1: título + toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-display-lg sm:tracking-display-lg">
              Clientes e Fornecedores
            </h1>
            <p className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              Directory Management
              <span className="font-semibold text-primary">
                • {filteredCount} {filteredCount === 1 ? 'Record' : 'Records'} Active
              </span>
            </p>
          </div>

          {/* 1.2 — Segmented control (4.2: conectado ao filtro) */}
          <nav
            role="tablist"
            aria-label="Alternar entre Clientes e Fornecedores"
            className="flex self-start overflow-hidden rounded-full border border-outline-variant/40 bg-surface-container-low"
          >
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === 'clientes'}
              onClick={() => setActiveTab('clientes')}
              className={`px-6 py-2 text-label-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                activeTab === 'clientes'
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Clientes
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === 'fornecedores'}
              onClick={() => setActiveTab('fornecedores')}
              className={`px-6 py-2 text-label-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                activeTab === 'fornecedores'
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Fornecedores
            </button>
          </nav>
        </div>

        {/* Linha 2: busca + botões de ação */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Busca global */}
          <div className="relative max-w-md flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg
                aria-hidden
                className="h-4 w-4 shrink-0 text-on-surface-variant"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              role="searchbox"
              aria-label="Buscar clientes ou fornecedores"
              placeholder="Search customers or suppliers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low py-2 pl-9 pr-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button type="button" className={secondaryBtn} aria-label="Exportar CSV" onClick={handleExportCsv}>
              <DownloadIcon />
              Export CSV
            </button>
            <button type="button" className={primaryBtn} aria-label="Adicionar entidade">
              <UserPlusIcon />
              Add Entity
            </button>
          </div>
        </div>
      </header>

      {/* ── 1.3 Barra de filtros inline (4.3: dropdowns funcionais) ────────── */}
      <div
        role="group"
        aria-label="Filtros de entidade"
        className="flex flex-wrap items-center gap-3"
      >
        <FilterDropdown
          label="TYPE"
          value={typeFilter}
          options={TYPE_OPTIONS}
          onChange={setTypeFilter}
          ariaLabel="Filtrar por tipo de entidade"
        />
        <FilterDropdown
          label="STATUS"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
          ariaLabel="Filtrar por status"
        />
        <FilterDropdown
          label="BALANCE"
          value={balanceFilter}
          options={BALANCE_OPTIONS}
          onChange={setBalanceFilter}
          ariaLabel="Filtrar por saldo"
        />
      </div>

      {/* ── 3.x Tabela de entidades (4.x: recebe pagedEntities filtradas) ──────── */}
      <EntityTable entities={pagedEntities} />

      {/* ── 5.x Rodapé de paginação ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-body-sm text-on-surface-variant" aria-live="polite" aria-atomic="true">
          Showing {firstItem} to {lastItem} of {filteredCount} entries
        </p>
        <ClientsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── 1.4 Grid dos 4 cards KPI ──────────────────────────────────────── */}
      <section
        aria-label="Indicadores de clientes e fornecedores"
        className="overflow-hidden rounded-xl border border-outline-variant/20"
      >
        <div role="list" className="flex flex-col divide-y divide-outline-variant/20 sm:flex-row sm:divide-x sm:divide-y-0">
          {KPI_CARDS.map((card) => (
            <div key={card.label} role="listitem" className="flex-1">
              <KpiCard card={card} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 1.5 Botão flutuante "+" ────────────────────────────────────────── */}
      {/*
        Posicionado com absolute dentro de container relativo (não fixed global)
        para não quebrar o layout do scroll da página.
      */}
      <div className="sticky bottom-6 flex justify-end pr-2">
        <button
          type="button"
          aria-label="Adicionar nova entidade"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&>svg]:h-6 [&>svg]:w-6"
        >
          <PlusIcon />
        </button>
      </div>

    </div>
  )
}
