import { useEffect, useRef, useState, type ReactNode } from 'react'

import type { WarrantyProtocol, WarrantyProtocolStatus } from './warranty.types'
import { warrantyProtocolsMock } from './mock-data'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Converte "YYYY-MM-DD" → "DD/MM/YY" */
function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year.slice(2)}`
}

/** Retorna true se a data de expiração já passou em relação a hoje */
function isExpired(expirationDate: string): boolean {
  return new Date(expirationDate) < new Date()
}

// ── Ícones inline SVG ──────────────────────────────────────────────────────────

const CalendarIcon = (): ReactNode => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-3.5 w-3.5 shrink-0">
    <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <line x1="1" y1="5.5" x2="13" y2="5.5" stroke="currentColor" strokeWidth="1.3" />
    <line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const LinkIcon = (): ReactNode => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-3.5 w-3.5 shrink-0">
    <path
      d="M5.5 8.5a3.5 3.5 0 005 0l1.5-1.5a3.536 3.536 0 00-5-5L6 3"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M8.5 5.5a3.5 3.5 0 00-5 0L2 7a3.536 3.536 0 005 5L8 11"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
)

// ── 4.2 Badge de status do protocolo ─────────────────────────────────────────

const PROTOCOL_STATUS_LABEL: Record<WarrantyProtocolStatus, string> = {
  in_progress: 'IN PROGRESS',
  completed:   'COMPLETED',
}

// in_progress: translúcido teal com borda; completed: translúcido cinza neutro
const PROTOCOL_STATUS_STYLE: Record<WarrantyProtocolStatus, { background: string; color: string; border: string }> = {
  in_progress: {
    background: 'rgba(16,185,129,0.12)',
    color:      '#10B981',
    border:     '1px solid rgba(16,185,129,0.4)',
  },
  completed: {
    background: 'rgba(255,255,255,0.07)',
    color:      '#9ca3af',
    border:     '1px solid rgba(255,255,255,0.12)',
  },
}

function ProtocolStatusBadge({ status }: { status: WarrantyProtocolStatus }): ReactNode {
  const style = PROTOCOL_STATUS_STYLE[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={style}
    >
      {PROTOCOL_STATUS_LABEL[status]}
    </span>
  )
}

// ── 4.3 / 4.4 Rodapé do card ──────────────────────────────────────────────────

function ProtocolCardFooter({
  openDate,
  expirationDate,
  linkedOrder,
}: Pick<WarrantyProtocol, 'openDate' | 'expirationDate' | 'linkedOrder'>): ReactNode {
  const expired = isExpired(expirationDate)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {/* Data de abertura */}
      <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/60">
        <CalendarIcon />
        {formatShortDate(openDate)}
      </span>

      {/* Data de expiração — coral + "VENCIDA" se vencida (4.4) */}
      <span
        className="flex items-center gap-1 text-[11px] font-medium"
        style={{ color: expired ? '#FC7C78' : undefined }}
      >
        <CalendarIcon />
        <span className={expired ? undefined : 'text-on-surface-variant/60'}>
          Exp: {formatShortDate(expirationDate)}
        </span>
        {expired && (
          <span
            className="ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(252,124,120,0.15)', color: '#FC7C78' }}
          >
            VENCIDA
          </span>
        )}
      </span>

      {/* Ordem vinculada — teal clicável (visual only) */}
      <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
        <LinkIcon />
        {linkedOrder}
      </span>
    </div>
  )
}

// ── 4.1 Card de protocolo ─────────────────────────────────────────────────────

// Borda esquerda: teal para in_progress, cinza para completed
const CARD_BORDER_COLOR: Record<WarrantyProtocolStatus, string> = {
  in_progress: '#10B981',
  completed:   'rgba(255,255,255,0.15)',
}

function ProtocolCard({ protocol }: { protocol: WarrantyProtocol }): ReactNode {
  return (
    <article
      aria-label={`Protocolo ${protocol.protocolId}`}
      className="flex flex-col gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-highest/40 p-4"
      style={{ borderLeft: `4px solid ${CARD_BORDER_COLOR[protocol.status]}` }}
    >
      {/* Header: "PROTOCOLO #GAR-XXXX" + badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50">
          PROTOCOLO #{protocol.protocolId}
        </span>
        <ProtocolStatusBadge status={protocol.status} />
      </div>

      {/* Título da peça */}
      <p className="text-body-sm font-bold text-on-surface leading-snug">
        {protocol.itemName}
      </p>

      {/* Descrição / diagnóstico */}
      <p className="text-[12px] leading-relaxed text-on-surface-variant/70">
        {protocol.description}
      </p>

      {/* Rodapé: abertura, expiração (+ VENCIDA), ORD vinculada */}
      <ProtocolCardFooter
        openDate={protocol.openDate}
        expirationDate={protocol.expirationDate}
        linkedOrder={protocol.linkedOrder}
      />
    </article>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface WarrantyTrackingPanelProps {
  /** Protocolos exibidos no painel. Usa `warrantyProtocolsMock` por padrão. */
  protocols?: WarrantyProtocol[]
}

// ── 6.2 Kebab dropdown ────────────────────────────────────────────────────────

const KEBAB_OPTIONS = [
  'Ver Todos os Protocolos',
  'Exportar Relatório',
  'Configurar Alertas',
] as const

// ── Componente principal ───────────────────────────────────────────────────────

export function WarrantyTrackingPanel({
  protocols = warrantyProtocolsMock,
}: WarrantyTrackingPanelProps): ReactNode {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const kebabRef = useRef<HTMLDivElement>(null)

  // Fecha o dropdown ao clicar fora do container
  useEffect(() => {
    if (!dropdownOpen) return

    function handleOutsideClick(e: MouseEvent): void {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

  return (
    <div className="flex flex-col gap-4">
      {/* Header do painel */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 text-primary">
            <path
              d="M10 2L3 5.5v5c0 4.375 2.917 8.458 7 9.458C14.083 18.958 17 14.875 17 10.5v-5L10 2z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <polyline points="7.5 10 9.5 12 13 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-body-lg font-bold text-on-surface">Tracking de Garantia</h2>
        </div>

        {/* Kebab com dropdown */}
        <div ref={kebabRef} className="relative">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest"
            aria-label="Opções de tracking"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
              <circle cx="8" cy="3"  r="1" fill="currentColor" />
              <circle cx="8" cy="8"  r="1" fill="currentColor" />
              <circle cx="8" cy="13" r="1" fill="currentColor" />
            </svg>
          </button>

          {dropdownOpen && (
            <ul
              role="menu"
              aria-label="Menu de opções de tracking"
              className="absolute right-0 top-8 z-20 min-w-[200px] rounded-xl border border-outline-variant/20 bg-surface-container-low py-1 shadow-xl"
            >
              {KEBAB_OPTIONS.map((option) => (
                <li key={option} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-highest"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Lista de cards */}
      <div className="flex flex-col gap-3">
        {protocols.map((protocol) => (
          <ProtocolCard key={protocol.protocolId} protocol={protocol} />
        ))}
      </div>
    </div>
  )
}
