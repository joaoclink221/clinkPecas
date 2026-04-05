import { type ReactNode } from 'react'

import { MonthlyTrendChart } from './MonthlyTrendChart'
import { PaymentMethodsPanel } from './PaymentMethodsPanel'
import { TransactionsTable } from './TransactionsTable'

// ── Ícones inline ──────────────────────────────────────────────────────────────

const CalendarIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 shrink-0">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const BuildingIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 shrink-0">
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M3 9h18M9 21V9" />
  </svg>
)

const SlidersIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
)

const TrendingUpIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-3.5 w-3.5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const BarChart2Icon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-3.5 w-3.5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const AlertTriangleIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-3.5 w-3.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ChevronDownIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-3.5 w-3.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// ── Tipos e dados dos cards KPI ────────────────────────────────────────────────

type KpiIndicator =
  | { kind: 'trend'; label: string; positive: boolean }
  | { kind: 'badge'; label: string }
  | { kind: 'alert'; label: string }

interface KpiCardData {
  id: string
  label: string
  value: string
  indicator: KpiIndicator
  sub: string
  accentClass: string
}

const KPI_CARDS: KpiCardData[] = [
  {
    id: 'receita',
    label: 'RECEITA TOTAL',
    value: 'R$ 1.240.500',
    indicator: { kind: 'trend', label: '+12.5%', positive: true },
    sub: 'Expectativa: R$ 1.1M',
    accentClass: 'border-l-primary',
  },
  {
    id: 'despesas',
    label: 'DESPESAS',
    value: 'R$ 845.200',
    indicator: { kind: 'trend', label: '+4.2%', positive: false },
    sub: 'Previsto: R$ 820K',
    accentClass: 'border-l-secondary',
  },
  {
    id: 'fluxo',
    label: 'FLUXO DE CAIXA',
    value: 'R$ 395.300',
    indicator: { kind: 'badge', label: 'Estável' },
    sub: 'Saldo em conta corrente',
    accentClass: 'border-l-blue-500',
  },
  {
    id: 'inadimplencia',
    label: 'INADIMPLÊNCIA',
    value: 'R$ 34.700',
    indicator: { kind: 'alert', label: '2.8%' },
    sub: 'Atrasos > 30 dias',
    accentClass: 'border-l-tertiary',
  },
]

// ── Subcomponente: KpiCard ─────────────────────────────────────────────────────

function KpiIndicatorBadge({ indicator }: { indicator: KpiIndicator }): ReactNode {
  if (indicator.kind === 'trend') {
    const colorClass = indicator.positive ? 'text-primary' : 'text-secondary'
    return (
      <span className={`flex items-center gap-1 text-label-sm font-semibold ${colorClass}`}>
        <TrendingUpIcon />
        {indicator.label}
      </span>
    )
  }

  if (indicator.kind === 'badge') {
    return (
      <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-label-sm font-semibold text-blue-400">
        <BarChart2Icon />
        {indicator.label}
      </span>
    )
  }

  // kind === 'alert'
  return (
    <span className="flex items-center gap-1 text-label-sm font-semibold text-tertiary">
      <AlertTriangleIcon />
      {indicator.label}
    </span>
  )
}

function KpiCard({ card }: { card: KpiCardData }): ReactNode {
  return (
    <article
      aria-label={card.label}
      className={`flex flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-outline-variant/20 border-l-4 bg-surface-container-low p-5 ${card.accentClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {card.label}
        </span>
        <KpiIndicatorBadge indicator={card.indicator} />
      </div>
      <p className="text-[1.75rem] font-bold leading-tight tracking-tight text-on-surface">
        {card.value}
      </p>
      <p className="text-body-sm text-on-surface-variant">{card.sub}</p>
    </article>
  )
}

// ── Estilos ────────────────────────────────────────────────────────────────────

const filterBtn =
  'flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest'

const iconBtn =
  'flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface transition-colors hover:bg-surface-container-highest'

// ── Abas secundárias ──────────────────────────────────────────────────────────

const SECONDARY_TABS = ['Overview', 'Relatórios', 'Conciliação'] as const

// ── Componente principal ───────────────────────────────────────────────────────

export function FinancialPage(): ReactNode {
  return (
    <div className="flex flex-col gap-6">

      {/* ── 1.1 Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4">
        {/* Linha 1: label + h1 / filtros globais */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Controladoria Digital
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-display-lg sm:tracking-display-lg">
              Gestão Financeira
            </h1>
          </div>

          {/* Controles de filtro global — visuais */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button type="button" aria-label="Período: Últimos 30 Dias" className={filterBtn}>
              <CalendarIcon />
              <span>Últimos 30 Dias</span>
              <ChevronDownIcon />
            </button>
            <button type="button" aria-label="Filtrar por Centro de Custo" className={filterBtn}>
              <BuildingIcon />
              <span>Centro de Custo</span>
              <ChevronDownIcon />
            </button>
            <button type="button" aria-label="Filtros avançados" className={iconBtn}>
              <SlidersIcon />
            </button>
          </div>
        </div>

        {/* Linha 2: abas secundárias — visuais */}
        <nav
          role="tablist"
          aria-label="Seções do módulo financeiro"
          className="flex gap-1 border-b border-outline-variant/20"
        >
          {SECONDARY_TABS.map((tab, idx) => (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={idx === 0}
              className={`px-4 pb-3 pt-1 text-label-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                idx === 0
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* ── 1.2 Grid dos 4 KPI cards ───────────────────────────────────────── */}
      <section
        aria-label="Indicadores financeiros"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.id} card={card} />
        ))}
      </section>

      {/* ── 1.3 Slots dos dois widgets do meio ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65fr_35fr]">
        {/* Slot largo — Tendência Mensal */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
          <MonthlyTrendChart />
        </div>

        {/* Slot menor — Meios de Pagamento */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
          <PaymentMethodsPanel />
        </div>
      </div>

      {/* ── 5.x Tabela de movimentações ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
        <TransactionsTable />
      </div>

      {/* ── 1.4 Rodapé de segurança ──────────────────────────────────────────────── */}
      <footer className="border-t border-outline-variant/20 py-4">
        <p className="text-center text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/40">
          OBSIDIAN GEAR SYSTEMS &copy; 2024 | SECURE FINTECH LAYER V2.1.0
        </p>
      </footer>

    </div>
  )
}
