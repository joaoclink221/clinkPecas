type InventoryPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const btnBase =
  'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'

const btnIdle = `${btnBase} text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface`

const btnDisabled = `${btnBase} cursor-not-allowed opacity-40 text-on-surface-variant`

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function InventoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: InventoryPaginationProps) {
  if (totalPages <= 1) return null

  const isFirst = currentPage === 1
  const isLast = currentPage === totalPages

  return (
    <nav aria-label="Paginação de estoque" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={isFirst ? btnDisabled : btnIdle}
      >
        <ChevronLeft />
      </button>

      <button
        type="button"
        aria-label="Próxima página"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={isLast ? btnDisabled : btnIdle}
      >
        <ChevronRight />
      </button>
    </nav>
  )
}
