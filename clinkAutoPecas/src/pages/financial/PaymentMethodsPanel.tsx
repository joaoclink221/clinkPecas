import { type ReactNode } from 'react'

import type { FinancialStatCard, PaymentMethodColor, PaymentMethodItem } from './financial.types'
import { financialStatsMock, paymentMethodsMock } from './mock-data'

// ── Mapeamento de cor para classe Tailwind ────────────────────────────────────

const COLOR_BAR_CLASS: Record<PaymentMethodColor, string> = {
  teal: 'bg-primary',
  purple: 'bg-secondary',
  green: 'bg-green-500',
}

const COLOR_TEXT_CLASS: Record<PaymentMethodColor, string> = {
  teal: 'text-primary',
  purple: 'text-secondary',
  green: 'text-green-500',
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function ProgressBar({ item }: { item: PaymentMethodItem }): ReactNode {
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {item.label}
        </span>
        <span className={`text-label-sm font-bold ${COLOR_TEXT_CLASS[item.color]}`}>
          {item.percent}%
        </span>
      </div>

      {/* Track da barra */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest"
        role="progressbar"
        aria-label={item.label}
        aria-valuenow={item.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${COLOR_BAR_CLASS[item.color]}`}
          style={{ width: `${item.percent}%` }}
        />
      </div>
    </li>
  )
}

function StatMiniCard({ card, index }: { card: FinancialStatCard; index: number }): ReactNode {
  // Primeiro card (Taxa de Conversão) usa cor teal; demais usam branco/on-surface
  const valueColorClass = index === 0 ? 'text-primary' : 'text-on-surface'

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-surface-container-highest p-3">
      <span className="text-[11px] font-semibold uppercase leading-tight tracking-widest text-on-surface-variant">
        {card.label}
      </span>
      <span className={`text-xl font-bold leading-none ${valueColorClass}`}>{card.value}</span>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface PaymentMethodsPanelProps {
  /** Dados das barras de progresso. Usa `paymentMethodsMock` por padrão. */
  methods?: PaymentMethodItem[]
  /** Dados dos mini-cards. Usa `financialStatsMock` por padrão. */
  stats?: FinancialStatCard[]
}

// ── Componente principal ──────────────────────────────────────────────────────

export function PaymentMethodsPanel({
  methods = paymentMethodsMock,
  stats = financialStatsMock,
}: PaymentMethodsPanelProps): ReactNode {
  return (
    <div className="flex flex-col gap-5">

      {/* ── Cabeçalho ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5">
        <h2 className="text-body-lg font-bold text-on-surface">Meios de Pagamento</h2>
        <p className="text-body-sm text-on-surface-variant">Distribuição por canal</p>
      </div>

      {/* ── 4.1 Barras de progresso ──────────────────────────────────────── */}
      <ul
        className="flex flex-col gap-4"
        role="list"
        aria-label="Métodos de pagamento"
      >
        {methods.map((item) => (
          <ProgressBar key={item.label} item={item} />
        ))}
      </ul>

      {/* ── 4.2 Mini-cards de estatísticas ──────────────────────────────── */}
      <div
        className="grid grid-cols-2 gap-3"
        aria-label="Estatísticas de pagamento"
      >
        {stats.map((card, idx) => (
          <StatMiniCard key={card.label} card={card} index={idx} />
        ))}
      </div>

    </div>
  )
}
