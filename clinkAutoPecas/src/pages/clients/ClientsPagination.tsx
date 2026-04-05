import { type ReactNode } from 'react'

import { buildPageItems } from './clientsPaginationUtils'

// ── Ícones inline ─────────────────────────────────────────────────────────────

const ChevronLeftIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRightIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// ── Estilos ───────────────────────────────────────────────────────────────────

const baseBtn =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-label-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

const navBtn =
  `${baseBtn} border border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-40`

const pageBtn = (active: boolean) =>
  active
    ? `${baseBtn} bg-primary text-on-primary`
    : `${baseBtn} border border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container-highest`

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ClientsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Navegação de paginação com reticências.
 *
 * Componente puramente apresentacional — toda a lógica de estado
 * vive no `useClientsFilters`.
 */
export function ClientsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientsPaginationProps): ReactNode {
  if (totalPages <= 1) return null

  const items = buildPageItems(currentPage, totalPages)

  return (
    <nav
      role="navigation"
      aria-label="Paginação de entidades"
      className="flex items-center justify-center gap-1"
    >
      {/* Prev */}
      <button
        type="button"
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={navBtn}
      >
        <ChevronLeftIcon />
      </button>

      {/* Páginas numeradas */}
      {items.map((item, idx) =>
        item === null ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center text-on-surface-variant text-label-sm select-none"
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
            className={pageBtn(item === currentPage)}
          >
            {item}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        aria-label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={navBtn}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  )
}
