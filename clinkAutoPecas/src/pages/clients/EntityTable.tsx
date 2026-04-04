import { useEffect, useRef, useState, type ReactNode } from 'react'

import type { AvatarIcon, Entity, FinancialStatus } from './clients.types'

// ── Helpers ───────────────────────────────────────────────────────────────────

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Formata valor monetário — ex: 42500 → "R$ 42.500,00" */
function formatBrl(value: number): string {
  return brl.format(value)
}

/**
 * Calcula porcentagem do saldo devedor em relação ao limite, clampada 0–100.
 * Retorna 0 quando creditLimit é null ou 0 (entidades prepaid/sem limite).
 */
function calcProgressPct(outstanding: number, limit: number | null): number {
  if (!limit) return 0
  return Math.min(100, Math.max(0, (outstanding / limit) * 100))
}

// ── Ícones SVG inline ─────────────────────────────────────────────────────────

// Avatar icons

function EnterpriseIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="1" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  )
}

function PersonIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function TruckIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function ToolsIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

// Action icons

function EditIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function DocumentIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function KebabIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────

const AVATAR_CONFIG: Record<AvatarIcon, { bg: string; text: string }> = {
  enterprise: { bg: 'bg-[#064E3B]', text: 'text-[#6EE7B7]' },
  person:     { bg: 'bg-[#4C1D95]', text: 'text-[#C4B5FD]' },
  truck:      { bg: 'bg-[#1E3A8A]', text: 'text-[#93C5FD]' },
  tools:      { bg: 'bg-[#78350F]', text: 'text-[#FCD34D]' },
}

interface EntityAvatarProps {
  icon: AvatarIcon
  name: string
}

function EntityAvatar({ icon, name }: EntityAvatarProps): ReactNode {
  const { bg, text } = AVATAR_CONFIG[icon]
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg} ${text} [&>svg]:h-5 [&>svg]:w-5`}
      aria-label={`Ícone ${icon} para ${name}`}
    >
      {icon === 'enterprise' && <EnterpriseIcon />}
      {icon === 'person'     && <PersonIcon />}
      {icon === 'truck'      && <TruckIcon />}
      {icon === 'tools'      && <ToolsIcon />}
    </span>
  )
}

// ── Financial Standing — 4 variantes ─────────────────────────────────────────

interface FinancialCellProps {
  financialStatus: FinancialStatus
  creditLimit: number | null
  outstandingBalance: number
}

function FinancialCell({ financialStatus, creditLimit, outstandingBalance }: FinancialCellProps): ReactNode {
  const pct = calcProgressPct(outstandingBalance, creditLimit)

  if (financialStatus === 'ok') {
    return (
      <div className="flex flex-col gap-0.5">
        <p className="text-label-sm">
          <span className="font-semibold text-[#10B981]">{formatBrl(creditLimit ?? 0)}</span>
          {' '}
          <span className="text-on-surface-variant">Limit</span>
        </p>
        <p className="text-label-technical text-on-surface-variant uppercase tracking-wide">
          Outstanding: R$ 0,00
        </p>
      </div>
    )
  }

  if (financialStatus === 'due') {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-label-sm">
          <span className="font-semibold text-[#FC7C78]">{formatBrl(outstandingBalance)}</span>
          {' '}
          <span className="text-[#FC7C78]">Balance Due</span>
        </p>
        {/* Barra de progresso: outstanding / limit */}
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${Math.round(pct)}% do limite utilizado`}
        >
          <div
            className="h-full rounded-full bg-[#FC7C78]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }

  if (financialStatus === 'credit_ok') {
    return (
      <div className="flex flex-col gap-0.5">
        <p className="text-label-sm">
          <span className="font-semibold text-[#10B981]">{formatBrl(creditLimit ?? 0)}</span>
          {' '}
          <span className="text-on-surface-variant">Limit</span>
        </p>
        <span
          className="w-fit rounded px-1.5 py-0.5 text-label-technical font-semibold uppercase tracking-wide bg-[#064E3B] text-[#6EE7B7]"
        >
          Credit OK
        </span>
      </div>
    )
  }

  // prepaid
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-label-sm text-on-surface-variant">R$ 0,00 Prepaid Only</p>
      <p className="text-label-technical text-on-surface-variant/60 uppercase tracking-wide">
        No Active Limit
      </p>
    </div>
  )
}

// ── Kebab dropdown ────────────────────────────────────────────────────────────

const KEBAB_ITEMS = ['Ver Detalhes', 'Editar', 'Desativar'] as const

interface KebabMenuProps {
  entityId: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

function KebabMenu({ entityId, isOpen, onToggle, onClose }: KebabMenuProps): ReactNode {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    if (!isOpen) return

    function handleOutsideClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, onClose])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Mais opções"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4"
        data-entity-id={entityId}
      >
        <KebabIcon />
      </button>

      {isOpen && (
        <ul
          role="menu"
          aria-label="Opções da entidade"
          className="absolute right-0 top-8 z-10 min-w-[10rem] overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-low shadow-lg"
        >
          {KEBAB_ITEMS.map((item) => (
            <li key={item} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={onClose}
                className={`w-full px-4 py-2.5 text-left text-label-sm hover:bg-surface-container-highest focus-visible:outline-none focus-visible:bg-surface-container-highest ${
                  item === 'Desativar' ? 'text-[#FC7C78]' : 'text-on-surface'
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface EntityTableProps {
  /** Lista de entidades a exibir (já filtrada e paginada pelo chamador) */
  entities: Entity[]
}

// ── Componente principal ──────────────────────────────────────────────────────

export function EntityTable({ entities }: EntityTableProps): ReactNode {
  /**
   * ID da entidade com o kebab menu aberto.
   * null = nenhum menu aberto.
   */
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  function toggleMenu(id: string) {
    setOpenMenuId((prev) => (prev === id ? null : id))
  }

  function closeMenu() {
    setOpenMenuId(null)
  }

  if (entities.length === 0) {
    return (
      <div
        className="flex min-h-[200px] items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-low"
        aria-label="Nenhuma entidade encontrada"
      >
        <p className="text-body-sm text-on-surface-variant">Nenhuma entidade encontrada.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
      <table className="w-full border-collapse text-body-sm" aria-label="Tabela de entidades">
        <thead>
          <tr className="border-b border-outline-variant/20 bg-surface-container-low">
            <th scope="col" className="px-4 py-3 text-left text-label-technical font-semibold uppercase tracking-widest text-on-surface-variant">
              Entity Details
            </th>
            <th scope="col" className="px-4 py-3 text-left text-label-technical font-semibold uppercase tracking-widest text-on-surface-variant">
              Tax ID / CNPJ
            </th>
            <th scope="col" className="px-4 py-3 text-left text-label-technical font-semibold uppercase tracking-widest text-on-surface-variant">
              Primary Contact
            </th>
            <th scope="col" className="px-4 py-3 text-left text-label-technical font-semibold uppercase tracking-widest text-on-surface-variant">
              Financial Standing
            </th>
            <th scope="col" className="px-4 py-3 text-left text-label-technical font-semibold uppercase tracking-widest text-on-surface-variant">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/20">
          {entities.map((entity) => (
            <tr
              key={entity.id}
              className="bg-surface-container-low transition-colors hover:bg-surface-container"
              aria-label={entity.name}
            >
              {/* ── Coluna 1: Entity Details ─────────────────────────── */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <EntityAvatar icon={entity.avatarIcon} name={entity.name} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">{entity.name}</span>
                    <span className="text-label-sm text-on-surface-variant">{entity.subtitle}</span>
                  </div>
                </div>
              </td>

              {/* ── Coluna 2: Tax ID / CNPJ ──────────────────────────── */}
              <td className="px-4 py-3">
                <code className="rounded bg-surface-container-highest px-2 py-1 font-mono text-label-sm text-on-surface-variant">
                  {entity.taxId}
                </code>
              </td>

              {/* ── Coluna 3: Primary Contact ─────────────────────────── */}
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <a
                    href={`mailto:${entity.email}`}
                    className="text-label-sm text-[#10B981] hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {entity.email}
                  </a>
                  <span className="text-label-sm text-on-surface-variant">{entity.phone}</span>
                </div>
              </td>

              {/* ── Coluna 4: Financial Standing ──────────────────────── */}
              <td className="px-4 py-3">
                <FinancialCell
                  financialStatus={entity.financialStatus}
                  creditLimit={entity.creditLimit}
                  outstandingBalance={entity.outstandingBalance}
                />
              </td>

              {/* ── Coluna 5: Actions ─────────────────────────────────── */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Editar ${entity.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4"
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    aria-label={`Ver ficha de ${entity.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [&>svg]:h-4 [&>svg]:w-4"
                  >
                    <DocumentIcon />
                  </button>
                  <KebabMenu
                    entityId={entity.id}
                    isOpen={openMenuId === entity.id}
                    onToggle={() => toggleMenu(entity.id)}
                    onClose={closeMenu}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
