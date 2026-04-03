import type { SaleStatus } from './sales.types'

export type StatusFilterValue = SaleStatus | 'all'

export type SalesFiltersBarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  statusFilter: StatusFilterValue
  onStatusChange: (value: StatusFilterValue) => void
}

const inputClass =
  'w-full rounded-lg border border-outline-variant/30 bg-surface-container-highest px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary'

const iconWrapperClass =
  'pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant'

export function SalesFiltersBar({
  searchQuery,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  statusFilter,
  onStatusChange,
}: SalesFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3" role="search" aria-label="Filtros de vendas">

      {/* ── 3.1 Busca textual ─────────────────────────────────────── */}
      <div className="relative min-w-60 flex-1">
        <span className={iconWrapperClass} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="search"
          aria-label="Buscar vendas"
          placeholder="Buscar por cliente, SKU ou ID do pedido…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${inputClass} pl-9`}
        />
      </div>

      {/* ── 3.2 Intervalo de datas ────────────────────────────────── */}
      <fieldset className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-highest px-3 py-1.5">
        <legend className="sr-only">Intervalo de datas</legend>
        <span className="text-on-surface-variant" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <input
          type="date"
          aria-label="Data inicial"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="bg-transparent text-body-sm text-on-surface focus:outline-none"
        />
        <span className="text-on-surface-variant" aria-hidden>–</span>
        <input
          type="date"
          aria-label="Data final"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="bg-transparent text-body-sm text-on-surface focus:outline-none"
        />
      </fieldset>

      {/* ── 3.3 Dropdown de status + botão funil ─────────────────── */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            aria-label="Filtrar por status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as StatusFilterValue)}
            className={`${inputClass} appearance-none pr-8`}
          >
            <option value="all">Todos Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-on-surface-variant" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Botão funil — visual only nesta etapa */}
        <button
          type="button"
          aria-label="Filtros avançados"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-highest/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
      </div>

    </div>
  )
}
