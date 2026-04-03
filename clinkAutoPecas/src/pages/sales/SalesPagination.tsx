type SalesPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageItem = number | '…'

/**
 * Gera a sequência de páginas + reticências para o componente de paginação.
 * Sempre exibe: primeira, última e janela de ±1 ao redor da página atual.
 * Insere '…' entre grupos não-adjacentes.
 */
function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const visible = new Set<number>()
  visible.add(1)
  visible.add(totalPages)
  for (let p = Math.max(1, currentPage - 1); p <= Math.min(totalPages, currentPage + 1); p++) {
    visible.add(p)
  }

  const sorted = Array.from(visible).sort((a, b) => a - b)
  const items: PageItem[] = []

  for (let i = 0; i < sorted.length; i++) {
    items.push(sorted[i])
    if (i + 1 < sorted.length && sorted[i + 1] - sorted[i] > 1) {
      items.push('…')
    }
  }

  return items
}

const btnBase =
  'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-label-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'

const btnIdle = `${btnBase} text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface`

const btnActive = `${btnBase} bg-primary text-on-primary`

const btnDisabled = `${btnBase} cursor-not-allowed opacity-40`

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

export function SalesPagination({ currentPage, totalPages, onPageChange }: SalesPaginationProps) {
  if (totalPages <= 1) return null

  const items = buildPageItems(currentPage, totalPages)

  return (
    <nav aria-label="Paginação de vendas" className="flex items-center justify-center gap-1">

      <button
        type="button"
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={currentPage === 1 ? btnDisabled : btnIdle}
      >
        <ChevronLeft />
      </button>

      {items.map((item, idx) =>
        item === '…' ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-8 min-w-8 items-center justify-center text-label-sm text-on-surface-variant"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Página ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={item === currentPage ? btnActive : btnIdle}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={currentPage === totalPages ? btnDisabled : btnIdle}
      >
        <ChevronRight />
      </button>

    </nav>
  )
}
