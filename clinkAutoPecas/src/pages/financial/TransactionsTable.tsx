import { useState, type ReactNode } from 'react'

import type {
  EntityAvatarType,
  PaymentMethod,
  Transaction,
  TransactionStatus,
  TransactionType,
} from './financial.types'
import { TOTAL_SIMULATED_TRANSACTIONS, transactionsMock } from './mock-data'

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTH_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day} ${MONTH_SHORT[Number(month) - 1]} ${year}`
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// ── Paginação ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 4

// ── 5.2 Avatar da entidade ─────────────────────────────────────────────────────

// Mapeamento de tipo para cor de fundo do avatar
const AVATAR_COLOR: Record<EntityAvatarType, string> = {
  person:   '#10B981',
  building: '#7C3AED',
  workshop: '#FC7C78',
  gear:     '#4B5563',
}

// Ícones SVG inline por tipo de entidade
function avatarIcon(type: EntityAvatarType): ReactNode {
  switch (type) {
    case 'person':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <circle cx="8" cy="5.5" r="2.5" fill="white" />
          <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'building':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <rect x="3" y="5" width="10" height="9" rx="1" stroke="white" strokeWidth="1.5" />
          <path d="M1.5 5L8 1.5 14.5 5"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 14v-3.5h4V14" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )
    case 'workshop':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <path
            d="M13 3a3 3 0 01-4.28 2.72L4.5 10.5a1.5 1.5 0 102.12 2.12l5.28-5.28A3 3 0 0113 3z"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.5" />
          <path
            d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.76 3.76l1.06 1.06M11.18 11.18l1.06 1.06M3.76 12.24l1.06-1.06M11.18 4.82l1.06-1.06"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
  }
}

function EntityAvatar({ type, name }: { type: EntityAvatarType; name: string }): ReactNode {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: AVATAR_COLOR[type] }}
      aria-label={`Avatar ${type}: ${name}`}
    >
      {avatarIcon(type)}
    </div>
  )
}

// ── 5.4 Ícones de método de pagamento ─────────────────────────────────────────

const METHOD_LABEL: Record<PaymentMethod, string> = {
  pix: 'Pix',
  boleto: 'Boleto',
  cartao: 'Cartão',
}

function PaymentMethodCell({ method }: { method: PaymentMethod }): ReactNode {
  // Três ícones SVG distintos — nunca emoji ou texto puro (critério 5.4)
  let icon: ReactNode

  if (method === 'pix') {
    // 2×2 grid de quadrados — teal
    icon = (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4 shrink-0 text-primary">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
        <rect x="9"   y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
        <rect x="1.5" y="9"   width="5.5" height="5.5" rx="1" fill="currentColor" />
        <rect x="9"   y="9"   width="5.5" height="5.5" rx="1" fill="currentColor" />
      </svg>
    )
  } else if (method === 'boleto') {
    // Barras verticais de espessura variada — muted
    icon = (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4 shrink-0 text-on-surface-variant">
        <rect x="1.5" y="2.5" width="2"   height="11" rx="0.5" fill="currentColor" />
        <rect x="5.5" y="2.5" width="2"   height="11" rx="0.5" fill="currentColor" />
        <rect x="9.5" y="2.5" width="1"   height="11" rx="0.5" fill="currentColor" />
        <rect x="12"  y="2.5" width="2.5" height="11" rx="0.5" fill="currentColor" />
      </svg>
    )
  } else {
    // Retângulo com chip — muted
    icon = (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4 shrink-0 text-on-surface-variant">
        <rect x="1" y="3.5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="1" y1="6.5" x2="15" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="9" width="3" height="2" rx="0.5" fill="currentColor" />
      </svg>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-body-sm text-on-surface-variant">{METHOD_LABEL[method]}</span>
    </div>
  )
}

// ── 5.3 Badges de status ──────────────────────────────────────────────────────

const STATUS_LABEL: Record<TransactionStatus, string> = {
  pago: 'PAGO',
  pendente: 'PENDENTE',
  atrasado: 'ATRASADO',
}

// Inline styles para precisão de cor — pago (teal), pendente (roxo/lilás), atrasado (coral sólido)
const STATUS_STYLE: Record<TransactionStatus, { background: string; color: string }> = {
  pago:     { background: 'rgba(16,185,129,0.15)', color: '#10B981' },
  pendente: { background: 'rgba(124,58,237,0.15)', color: '#a78bfa' },
  atrasado: { background: '#FC7C78',               color: '#ffffff' },
}

function StatusBadge({ status }: { status: TransactionStatus }): ReactNode {
  return (
    <span
      className="inline-flex items-center rounded-[20px] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
      style={STATUS_STYLE[status]}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

// ── 6.1 Barra de paginação ────────────────────────────────────────────────────

interface PaginationBarProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps): ReactNode {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className="mt-4 flex items-center justify-end gap-1"
      aria-label="Paginação de transações"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <polyline points="10 4 6 8 10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-label={`Página ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-label-sm font-semibold transition-colors ${
            page === currentPage
              ? 'bg-primary text-white'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <polyline points="6 4 10 8 6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  )
}

// ── 6.3 Coluna de Ações (kebab com dropdown mock) ─────────────────────────────

const KEBAB_ACTIONS = ['Visualizar detalhes', 'Marcar como pago', 'Cancelar transação'] as const

function ActionsCell({ isFirst }: { isFirst: boolean }): ReactNode {
  const [isOpen, setIsOpen] = useState(false)

  if (isFirst) {
    // Botão "+" flutuante — primeira linha
    return (
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary/10"
        aria-label="Adicionar ação"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    )
  }

  // Kebab (3 pontos verticais) com dropdown mock — demais linhas
  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-highest"
        aria-label="Mais ações"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <circle cx="8" cy="3"  r="1" fill="currentColor" />
          <circle cx="8" cy="8"  r="1" fill="currentColor" />
          <circle cx="8" cy="13" r="1" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-8 z-10 min-w-[180px] rounded-lg border border-outline-variant/30 bg-surface-container-highest py-1 shadow-lg"
          role="menu"
          aria-label="Ações disponíveis"
        >
          {KEBAB_ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
              onClick={() => setIsOpen(false)}
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TransactionsTableProps {
  /** Conjunto de transações. Usa `transactionsMock` por padrão. */
  transactions?: Transaction[]
}

// ── Componente principal ───────────────────────────────────────────────────────

export function TransactionsTable({
  transactions = transactionsMock,
}: TransactionsTableProps): ReactNode {
  const [activeType, setActiveType] = useState<TransactionType>('receber')
  const [currentPage, setCurrentPage] = useState(1)

  // 6.1 — resetar página ao trocar o tipo
  function handleTypeChange(newType: TransactionType): void {
    setActiveType(newType)
    setCurrentPage(1)
  }

  const filtered = transactions.filter((t) => t.type === activeType)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  const rangeStart = filtered.length === 0 ? 0 : pageStart + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const pillBase = 'rounded-full px-4 py-1.5 text-label-sm font-semibold transition-colors'
  const pillActive = 'bg-surface-container-highest text-on-surface'
  const pillInactive = 'text-on-surface-variant hover:text-on-surface'

  return (
    <section aria-label="Últimas Movimentações">

      {/* ── 5.1 Cabeçalho + Toggle pill ──────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-body-lg font-bold text-on-surface">Últimas Movimentações</h2>
          <p className="text-body-sm text-on-surface-variant">
            Mostrando {rangeStart}–{rangeEnd} de {TOTAL_SIMULATED_TRANSACTIONS} transações
          </p>
        </div>

        <div
          className="flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-low p-1"
          role="group"
          aria-label="Filtro de tipo de transação"
        >
          <button
            type="button"
            className={`${pillBase} ${activeType === 'receber' ? pillActive : pillInactive}`}
            aria-pressed={activeType === 'receber'}
            onClick={() => handleTypeChange('receber')}
          >
            Contas a Receber
          </button>
          <button
            type="button"
            className={`${pillBase} ${activeType === 'pagar' ? pillActive : pillInactive}`}
            aria-pressed={activeType === 'pagar'}
            onClick={() => handleTypeChange('pagar')}
          >
            Contas a Pagar
          </button>
        </div>
      </div>

      {/* ── 5.2 Tabela de 6 colunas ──────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20">
              {(['CLIENTE/BENEFICIÁRIO', 'VENCIMENTO', 'MÉTODO', 'VALOR', 'STATUS', 'AÇÕES'] as const).map(
                (col) => (
                  <th
                    key={col}
                    scope="col"
                    className="pb-3 pr-6 text-left text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60 last:pr-0"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx, idx) => (
              <tr
                key={tx.id}
                className="border-b border-outline-variant/10 transition-colors hover:bg-surface-container-highest/30"
                style={tx.status === 'atrasado' ? { background: 'rgba(252,124,120,0.05)' } : undefined}
              >
                {/* 1. Cliente/Beneficiário */}
                <td className="py-3 pr-6">
                  <div className="flex items-center gap-3">
                    <EntityAvatar type={tx.entityAvatarType} name={tx.entityName} />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-body-sm font-semibold text-on-surface">
                        {tx.entityName}
                      </span>
                      <span className="text-[11px] text-on-surface-variant/60">{tx.ref}</span>
                    </div>
                  </div>
                </td>

                {/* 2. Vencimento — coral se atrasado */}
                <td className="py-3 pr-6">
                  <span
                    className="whitespace-nowrap text-body-sm font-medium"
                    style={tx.status === 'atrasado' ? { color: '#FC7C78' } : undefined}
                  >
                    {formatDate(tx.dueDate)}
                  </span>
                </td>

                {/* 3. Método */}
                <td className="py-3 pr-6">
                  <PaymentMethodCell method={tx.method} />
                </td>

                {/* 4. Valor */}
                <td className="py-3 pr-6">
                  <span className="whitespace-nowrap text-body-sm font-bold text-on-surface">
                    {formatBRL(tx.value)}
                  </span>
                </td>

                {/* 5. Status */}
                <td className="py-3 pr-6">
                  <StatusBadge status={tx.status} />
                </td>

                {/* 6. Ações */}
                <td className="py-3">
                  <ActionsCell isFirst={idx === 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 6.1 Paginação ──────────────────────────────────────────────────── */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </section>
  )
}
