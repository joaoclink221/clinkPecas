type InventorySearchBarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  /** Estado reservado para expansão futura do painel de filtros. */
  filtersOpen: boolean
  onFiltersToggle: () => void
  onExport: () => void
}

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-on-surface-variant"
    aria-hidden
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const FunnelIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const secondaryBtn =
  'inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export function InventorySearchBar({
  searchQuery,
  onSearchChange,
  onFiltersToggle,
  onExport,
}: InventorySearchBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* ── 3.1 Input de busca ──────────────────────────────────── */}
      <label htmlFor="inventory-search" className="sr-only">
        Buscar por peça, SKU ou categoria
      </label>
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <SearchIcon />
        </span>
        <input
          id="inventory-search"
          type="search"
          role="searchbox"
          aria-label="Buscar por peça, SKU ou categoria"
          placeholder="Buscar por peça, SKU ou categoria…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low py-2 pl-9 pr-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* ── 3.2 Botão Filtros (visual) ───────────────────────────── */}
      <button
        type="button"
        onClick={onFiltersToggle}
        className={secondaryBtn}
        aria-label="Abrir filtros"
      >
        <FunnelIcon />
        Filtros
      </button>

      {/* ── 3.3 Botão Exportar (visual) ─────────────────────────── */}
      <button
        type="button"
        onClick={onExport}
        className={secondaryBtn}
        aria-label="Exportar dados"
      >
        <DownloadIcon />
        Exportar
      </button>
    </div>
  )
}
