import { useEffect, useState, type ReactNode } from 'react'

import { WarrantyClaimModal } from './WarrantyClaimModal'
import { PredictiveInsightsCard } from './PredictiveInsightsCard'
import { PolicyGuideCard } from './PolicyGuideCard'
import { ReturnsTable } from './ReturnsTable'
import { WarrantyTrackingPanel } from './WarrantyTrackingPanel'

// ── Ícones inline SVG ──────────────────────────────────────────────────────────

const PlusIcon = (): ReactNode => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
    <line x1="8" y1="2.5" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ShieldIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
    <path
      d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
    <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PackageIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
    <path
      d="M21 10V6a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 6v10a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16v-4"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
    <polyline points="3.29 7 12 12 20.71 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="22" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const DollarIcon = (): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
)

// ── KPI cards ──────────────────────────────────────────────────────────────────

interface WarrantyKpiCardData {
  id: string
  label: string
  value: string
  badgeLabel: string
  badgeStyle: { background: string; color: string }
  iconBg: string
  icon: ReactNode
}

const WARRANTY_KPI_CARDS: WarrantyKpiCardData[] = [
  {
    id: 'garantias-ativas',
    label: 'GARANTIAS ATIVAS',
    value: '142',
    badgeLabel: '+12% VS LAST MONTH',
    badgeStyle: { background: 'rgba(16,185,129,0.12)', color: '#10B981' },
    iconBg: '#10B981',
    icon: <ShieldIcon />,
  },
  {
    id: 'devolucoes-pendentes',
    label: 'DEVOLUÇÕES PENDENTES',
    value: '28',
    badgeLabel: 'AWAITING LOGISTICS',
    badgeStyle: { background: 'rgba(124,58,237,0.12)', color: '#a78bfa' },
    iconBg: '#7C3AED',
    icon: <PackageIcon />,
  },
  {
    id: 'total-reembolsos',
    label: 'TOTAL EM REEMBOLSOS',
    value: 'R$ 14.2k',
    badgeLabel: 'CURRENT CYCLE',
    badgeStyle: { background: 'rgba(252,124,120,0.12)', color: '#FC7C78' },
    iconBg: '#FC7C78',
    icon: <DollarIcon />,
  },
]

function WarrantyKpiCard({ card }: { card: WarrantyKpiCardData }): ReactNode {
  return (
    <article
      aria-label={card.label}
      className="flex flex-col gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
    >
      {/* Ícone + badge no topo */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: card.iconBg }}
        >
          {card.icon}
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={card.badgeStyle}
        >
          {card.badgeLabel}
        </span>
      </div>

      {/* Valor e label */}
      <div className="flex flex-col gap-1">
        <p className="text-[2rem] font-bold leading-tight tracking-tight text-on-surface">
          {card.value}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {card.label}
        </p>
      </div>
    </article>
  )
}

// ── Abas secundárias ───────────────────────────────────────────────────────────

const SECONDARY_TABS = ['POST-SALES', 'COMPLIANCE'] as const

// ── Componente principal ───────────────────────────────────────────────────────

// ── Toast de confirmação ────────────────────────────────────────────────────────

function PageToast({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}): ReactNode {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-primary/30 bg-surface-container-low px-4 py-3 shadow-xl"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 shrink-0 text-primary">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="6.5 10 9 12.5 13.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-body-sm font-semibold text-on-surface">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-1 text-on-surface-variant hover:text-on-surface"
        aria-label="Fechar notificação"
      >
        <svg viewBox="0 0 14 14" fill="none" aria-hidden className="h-3.5 w-3.5">
          <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

export function WarrantyPage(): ReactNode {
  const [modalOpen, setModalOpen] = useState(false)
  const [pageToast, setPageToast] = useState<string | null>(null)

  function handleTicketSuccess(protocol: string): void {
    setModalOpen(false)
    setPageToast(`Protocolo #${protocol} aberto com sucesso`)
  }

  function handleDraftSaved(): void {
    setPageToast('Rascunho salvo')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── 1.1 Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4">
        {/* Linha 1: H1 bicolor + botão Abrir Chamado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-display-lg sm:tracking-display-lg">
              <span className="text-on-surface">Pós-Venda </span>
              <span style={{ color: '#10B981' }}>&amp;</span>
              <span className="text-on-surface"> Qualidade</span>
            </h1>
            <p className="max-w-lg text-body-sm text-on-surface-variant">
              Gerenciamento centralizado de protocolos de garantia e processos
              de devolução logística para a rede Obsidian Gear.
            </p>
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-label-sm font-bold text-[#0D1117] transition-colors hover:bg-primary/90 sm:self-auto"
            aria-label="Abrir chamado de garantia"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon />
            Abrir Chamado
          </button>
        </div>

        {/* Linha 2: abas secundárias POST-SALES / COMPLIANCE */}
        <nav
          role="tablist"
          aria-label="Seções do módulo de garantia"
          className="flex gap-1 border-b border-outline-variant/20"
        >
          {SECONDARY_TABS.map((tab, idx) => (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={idx === 0}
              className={`px-4 pb-3 pt-1 text-label-sm font-semibold tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
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

      {/* ── 1.2 Grid dos 3 KPI cards ────────────────────────────────────────── */}
      <section
        aria-label="Indicadores de garantia"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {WARRANTY_KPI_CARDS.map((card) => (
          <WarrantyKpiCard key={card.id} card={card} />
        ))}
      </section>

      {/* ── 1.3 Linha do meio: Devoluções Recentes + Tracking ───────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[60fr_38fr]">
        {/* Slot largo — Devoluções Recentes */}
        <section
          aria-label="Devoluções Recentes"
          className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
        >
          <ReturnsTable />
        </section>

        {/* Slot menor — Tracking de Garantia */}
        <section
          aria-label="Tracking de Garantia"
          className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
        >
          <WarrantyTrackingPanel />
        </section>
      </div>

      {/* ── 1.3 Linha inferior: Inteligência Preditiva + Guia de Políticas ──── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[60fr_38fr]">
        {/* Slot largo — Inteligência Preditiva de Falhas */}
        <section
          aria-label="Inteligência Preditiva de Falhas"
          className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
        >
          <PredictiveInsightsCard />
        </section>

        {/* Slot menor — Guia de Políticas */}
        <section
          aria-label="Guia de Políticas"
          className="flex min-h-[14rem] items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
        >
          <PolicyGuideCard />
        </section>
      </div>

      {/* ── Modal Abrir Chamado ────────────────────────────────────── */}
      <WarrantyClaimModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleTicketSuccess}
        onDraftSaved={handleDraftSaved}
      />

      {/* ── Toast de página (sucesso / rascunho) ───────────────────── */}
      {pageToast && (
        <PageToast message={pageToast} onDismiss={() => setPageToast(null)} />
      )}
    </div>
  )
}
