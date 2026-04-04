import { useEffect, useRef, useState } from 'react'

import type { PurchaseOrder, PurchaseStatus } from './purchases.types'
import type { PurchaseStatusFilter } from './usePurchasesFilters'

// ── Props ─────────────────────────────────────────────────────────────────────────────

/** Props do painel de filtros embutido no header da tabela (4.2). */
export type FilterPanelProps = {
  isOpen: boolean
  onToggle: () => void
  status: PurchaseStatusFilter
  onStatusChange: (s: PurchaseStatusFilter) => void
  dateFrom: string
  onDateFromChange: (d: string) => void
  dateTo: string
  onDateToChange: (d: string) => void
  onClear: () => void
  activeCount: number
}

type PurchasesTableProps = {
  orders: PurchaseOrder[]
  filterPanel: FilterPanelProps
  /** Callback chamado ao clicar em "Exportar CSV". Retorna o número de registros exportados (6.1). */
  onExportCsv: () => number
}

// ── Formatadores ──────────────────────────────────────────────────────────────

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatDate(isoDate: string): string {
  // Sufixo T00:00:00 garante interpretação em horário local, não UTC
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ── 3.2 Badge de status ───────────────────────────────────────────────────────

const statusBadgeClass: Record<PurchaseStatus, string> = {
  received:  'bg-[#065f46]/30 text-[#10b981] border border-[#10b981]/25',
  pending:   'bg-[#5b21b6]/25 text-[#c084fc] border border-[#7c3aed]/30',
  cancelled: 'bg-[#7f1d1d]/25 text-[#f87171] border border-[#ef4444]/30',
}

const statusLabel: Record<PurchaseStatus, string> = {
  received:  'Received',
  pending:   'Pending',
  cancelled: 'Cancelled',
}

function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-label-technical font-semibold uppercase tracking-wide ${statusBadgeClass[status]}`}
      aria-label={`Status: ${statusLabel[status]}`}
    >
      {statusLabel[status]}
    </span>
  )
}

// ── 3.3 Ícones inline ─────────────────────────────────────────────────────────

const DotsVerticalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
    <circle cx="12" cy="5"  r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
)

// ── 3.4 Ícone de grade (header do card) ──────────────────────────────────────

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// ── Estilos de th / td ────────────────────────────────────────────────────────

const thClass =
  'px-4 py-3 text-left text-label-technical font-semibold text-on-surface-variant'

const tdClass = 'px-4 py-4 text-body-sm text-on-surface align-middle'

const iconBtnClass =
  'inline-flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'

// ── 3.3 Opções do menu kebab ──────────────────────────────────────────────────

const KEBAB_OPTIONS = ['Ver Detalhes', 'Editar Ordem', 'Cancelar'] as const

// ── 3.3 Sub-componente do dropdown por linha ──────────────────────────────────

type KebabMenuProps = {
  orderId: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

function KebabMenu({ orderId, isOpen, onToggle, onClose }: KebabMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora do container
  useEffect(() => {
    if (!isOpen) return

    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, onClose])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Mais ações para ${orderId}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={iconBtnClass}
        onClick={onToggle}
      >
        <DotsVerticalIcon />
      </button>

      {isOpen ? (
        <ul
          role="menu"
          aria-label={`Menu de ações para ${orderId}`}
          className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-low py-1 shadow-ambient"
        >
          {KEBAB_OPTIONS.map((option) => (
            <li key={option} role="none">
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-2 text-left text-body-sm text-on-surface hover:bg-surface-container-highest"
                onClick={onClose}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────────────────────────────

export function PurchasesTable({ orders, filterPanel, onExportCsv }: PurchasesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(message)
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000)
  }

  function handleExportCsv() {
    const count = onExportCsv()
    showToast(`${count} ${count !== 1 ? 'ordens' : 'ordem'} exportada${count !== 1 ? 's' : ''}`)
  }

  function toggleMenu(orderId: string) {
    setOpenMenuId((prev) => (prev === orderId ? null : orderId))
  }

  return (
    <>
      {/* 6.1 — Toast transiente */}
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-lg bg-surface-container-highest px-4 py-2.5 text-body-sm font-medium text-on-surface shadow-ambient"
        >
          {toastMessage}
        </div>
      ) : null}

    <section aria-label="Listagem de ordens de compra">

      {/* ── 3.4 Header do card ───────────────────────────────── */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Bloco esquerdo — ícone + label */}
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#065f46]/30 text-[#10b981]">
            <GridIcon />
          </span>
          <span className="text-label-technical font-semibold uppercase tracking-widest text-on-surface-variant">
            Listagem de Ordens
          </span>
        </div>

        {/* Bloco direito — botão Filtros (4.2) + Exportar CSV */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Abrir filtros"
            aria-expanded={filterPanel.isOpen}
            onClick={filterPanel.onToggle}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-label-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [&>svg]:h-3.5 [&>svg]:w-3.5 ${
              filterPanel.isOpen || filterPanel.activeCount > 0
                ? 'border-[#10b981]/50 bg-[#065f46]/20 text-[#10b981]'
                : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <FilterIcon />
            Filtros
            {filterPanel.activeCount > 0 ? (
              <span
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-[10px] font-bold text-white"
                aria-label={`${filterPanel.activeCount} filtros ativos`}
              >
                {filterPanel.activeCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            aria-label="Exportar CSV"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-1.5 text-label-sm text-on-surface-variant hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [&>svg]:h-3.5 [&>svg]:w-3.5"
          >
            <DownloadIcon />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* ── 4.2 Painel de filtros inline ──────────────────────────── */}
      {filterPanel.isOpen ? (
        <div
          className="mb-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 shadow-ambient"
          role="region"
          aria-label="Painel de filtros"
        >
          <div className="flex flex-wrap items-end gap-4">

            {/* Seletor de status */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="filter-status"
                className="text-label-technical text-on-surface-variant"
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="filter-status"
                  aria-label="Filtrar por status"
                  value={filterPanel.status}
                  onChange={(e) =>
                    filterPanel.onStatusChange(e.target.value as PurchaseStatusFilter)
                  }
                  className="appearance-none rounded-lg border border-outline-variant/30 bg-surface-container-highest px-3 py-2 pr-8 text-body-sm text-on-surface focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-primary"
                >
                  <option value="all">Todos</option>
                  <option value="received">Received</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-on-surface-variant" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Intervalo de datas */}
            <fieldset className="flex flex-col gap-1">
              <legend className="text-label-technical text-on-surface-variant">
                Intervalo de datas
              </legend>
              <div className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-highest px-3 py-2">
                <input
                  type="date"
                  aria-label="Data inicial"
                  value={filterPanel.dateFrom}
                  onChange={(e) => filterPanel.onDateFromChange(e.target.value)}
                  className="bg-transparent text-body-sm text-on-surface focus:outline-none"
                />
                <span className="text-on-surface-variant" aria-hidden>–</span>
                <input
                  type="date"
                  aria-label="Data final"
                  value={filterPanel.dateTo}
                  onChange={(e) => filterPanel.onDateToChange(e.target.value)}
                  className="bg-transparent text-body-sm text-on-surface focus:outline-none"
                />
              </div>
            </fieldset>

            {/* Botão limpar */}
            <button
              type="button"
              onClick={filterPanel.onClear}
              className="rounded-lg border border-outline-variant/30 px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            >
              Limpar filtros
            </button>

          </div>
        </div>
      ) : null}

      {/* ── 3.1 Tabela ───────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl bg-surface-container-low shadow-ambient">
        <table
          className="w-full border-collapse text-left"
          aria-label="Tabela de ordens de compra"
        >
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className={thClass} scope="col">ID Pedido</th>
              <th className={thClass} scope="col">Fornecedor</th>
              <th className={thClass} scope="col">Data Emissão</th>
              <th className={`${thClass} text-right`} scope="col">Valor Total</th>
              <th className={thClass} scope="col">Status</th>
              <th className={`${thClass} text-center`} scope="col">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-highest/30"
              >
                {/* 3.1 — ID em teal, fonte mono */}
                <td className={tdClass}>
                  <span className="font-mono font-semibold text-[#10b981]">
                    #{order.id}
                  </span>
                </td>

                {/* 3.1 — Nome bold + supplierTag muted 11px uppercase abaixo */}
                <td className={tdClass}>
                  <span className="block font-semibold text-on-surface">
                    {order.supplier}
                  </span>
                  <span
                    className="block text-on-surface-variant"
                    style={{ fontSize: '11px' }}
                  >
                    {order.supplierTag}
                  </span>
                </td>

                {/* 3.1 — Data formatada pt-BR */}
                <td className={tdClass}>
                  <span className="text-on-surface-variant">
                    {formatDate(order.issueDate)}
                  </span>
                </td>

                {/* 3.1 — Valor BRL alinhado à direita */}
                <td className={`${tdClass} text-right`}>
                  <span className="font-semibold text-on-surface">
                    {brl.format(order.totalValue)}
                  </span>
                </td>

                {/* 3.2 — Badge de status */}
                <td className={tdClass}>
                  <PurchaseStatusBadge status={order.status} />
                </td>

                {/* 3.3 — Menu kebab */}
                <td className={`${tdClass} text-center`}>
                  <KebabMenu
                    orderId={order.id}
                    isOpen={openMenuId === order.id}
                    onToggle={() => toggleMenu(order.id)}
                    onClose={() => setOpenMenuId(null)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </>
  )
}
