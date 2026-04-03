import type { ReactNode } from 'react'

import { DashboardDataProvider, useDashboardData } from './DashboardDataContext'
import { InventoryMixChart } from './InventoryMixChart'
import { KpiCard } from './KpiCard'
import { LiveFeedBadge } from './LiveFeedBadge'
import { RecentSalesTable } from './RecentSalesTable'
import { SalesVelocityChart } from './SalesVelocityChart'
import { StockMovementsTable } from './StockMovementsTable'

const kpiIcons: Record<string, ReactNode> = {
  'monthly-sales': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  'pending-orders': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  'low-stock-sku': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  'revenue-growth': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
}

function DashboardContent() {
  const { kpiData } = useDashboardData()

  return (
    <div className="flex flex-col gap-6">

      {/* ── 1.1 Header ───────────────────────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* 5.2: text-4xl em mobile, display-lg em sm+ para evitar overflow */}
          <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-display-lg sm:tracking-display-lg">Overview.</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Real-time telemetry for Obsidian Gear logistics engine.
          </p>
        </div>

        {/* 5.1: badge dinâmico com setInterval */}
        <LiveFeedBadge />
      </header>

      {/* ── KPI cards ────────────────────────────────────────────────── */}
      <section aria-label="Indicadores principais">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4" role="list">
          {kpiData.map((kpi) => (
            <li key={kpi.id}>
              <KpiCard
                label={kpi.label}
                value={kpi.value}
                badge={kpi.badge}
                badgeVariant={kpi.badgeVariant}
                icon={kpiIcons[kpi.id]}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3.x Widget area ───────────────────────────────────────────── */}
      <section aria-label="Widgets de análise" className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Coluna larga (2/3): Sales Velocity chart + Recent Sales slot */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-xl bg-surface-container-low p-5 shadow-ambient">
            <SalesVelocityChart />
          </div>

          <div className="rounded-xl bg-surface-container-low p-5 shadow-ambient">
            <RecentSalesTable />
          </div>
        </div>

        {/* Coluna menor (1/3): Inventory Mix chart + Stock Movements slot */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-surface-container-low p-5 shadow-ambient">
            <InventoryMixChart />
          </div>

          <div className="rounded-xl bg-surface-container-low p-5 shadow-ambient">
            <StockMovementsTable />
          </div>
        </div>
      </section>

    </div>
  )
}

export function DashboardPage() {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  )
}
