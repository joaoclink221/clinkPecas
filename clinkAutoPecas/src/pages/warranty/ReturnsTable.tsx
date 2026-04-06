import { type ReactNode } from 'react'

import type { AvatarIcon, Return, ReturnStatus } from './warranty.types'
import { returnsMock } from './mock-data'

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTH_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day} ${MONTH_SHORT[Number(month) - 1]}, ${year}`
}

// ── 3.3 Ícones de item por categoria ──────────────────────────────────────────

function itemIcon(type: AvatarIcon): ReactNode {
  switch (type) {
    case 'brake':
      // Rotor de freio — 4 linhas cruzadas num círculo
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'alternator':
      // Raio / bolt de energia
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <polyline
            points="9.5 1.5 4.5 8.5 8 8.5 6.5 14.5 11.5 7.5 8 7.5"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      )
    case 'filter':
      // Grid 2×2 de quadrados
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9"   y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="1.5" y="9"   width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9"   y="9"   width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.76 3.76l1.06 1.06M11.18 11.18l1.06 1.06M3.76 12.24l1.06-1.06M11.18 4.82l1.06-1.06"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      )
  }
}

function ItemCell({ avatarIcon, itemName, skuRef }: { avatarIcon: AvatarIcon; itemName: string; skuRef: string }): ReactNode {
  return (
    <div className="flex items-center gap-3">
      {/* Quadrado 32px com fundo escuro e ícone SVG 16px centralizado */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        aria-label={`Ícone ${avatarIcon}`}
      >
        {itemIcon(avatarIcon)}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-sm font-semibold text-on-surface">{itemName}</span>
        <span className="text-[11px] text-on-surface-variant/60">{skuRef}</span>
      </div>
    </div>
  )
}

// ── 3.2 Badges de status de devolução ─────────────────────────────────────────

const STATUS_LABEL: Record<ReturnStatus, string> = {
  analysing: 'ANALYSING',
  approved:  'APPROVED',
  refunded:  'REFUNDED',
}

// Pill uppercase 11px — analysing: roxo sólido, approved: teal, refunded: cinza escuro
const STATUS_STYLE: Record<ReturnStatus, { background: string; color: string }> = {
  analysing: { background: '#7C3AED', color: '#ffffff' },
  approved:  { background: '#10B981', color: '#ffffff' },
  refunded:  { background: 'rgba(255,255,255,0.10)', color: '#9ca3af' },
}

function ReturnStatusBadge({ status }: { status: ReturnStatus }): ReactNode {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
      style={STATUS_STYLE[status]}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

// ── Header do card ────────────────────────────────────────────────────────────

function CardHeader(): ReactNode {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {/* Ícone escudo roxo */}
        <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 text-secondary">
          <path
            d="M10 2L3 5.5v5c0 4.375 2.917 8.458 7 9.458C14.083 18.958 17 14.875 17 10.5v-5L10 2z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
          <polyline points="7.5 10 9.5 12 13 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-body-lg font-bold text-on-surface">Devoluções Recentes</h2>
      </div>
      <button
        type="button"
        className="text-[11px] font-semibold uppercase tracking-widest text-primary hover:underline"
        aria-label="Ver todas as devoluções"
      >
        VER TUDO
      </button>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ReturnsTableProps {
  /** Registros de devolução exibidos na tabela. Usa `returnsMock` por padrão. */
  returns?: Return[]
}

// ── Componente principal ───────────────────────────────────────────────────────

export function ReturnsTable({ returns = returnsMock }: ReturnsTableProps): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <CardHeader />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20">
              {(['ITEM / SKU', 'MOTIVO', 'DATA', 'STATUS'] as const).map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="pb-3 pr-6 text-left text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60 last:pr-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {returns.map((ret) => (
              <tr
                key={ret.id}
                className="border-b border-outline-variant/10 transition-colors hover:bg-surface-container-highest/30"
              >
                {/* 1. Item / SKU */}
                <td className="py-3 pr-6">
                  <ItemCell
                    avatarIcon={ret.avatarIcon}
                    itemName={ret.itemName}
                    skuRef={ret.skuRef}
                  />
                </td>

                {/* 2. Motivo */}
                <td className="py-3 pr-6">
                  <span className="text-body-sm text-on-surface-variant">{ret.reason}</span>
                </td>

                {/* 3. Data */}
                <td className="py-3 pr-6">
                  <span className="whitespace-nowrap text-body-sm text-on-surface-variant">
                    {formatDate(ret.date)}
                  </span>
                </td>

                {/* 4. Status */}
                <td className="py-3">
                  <ReturnStatusBadge status={ret.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
