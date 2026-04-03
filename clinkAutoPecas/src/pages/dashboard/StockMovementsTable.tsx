import { useDashboardData } from './DashboardDataContext'
import type { StockMovementRow } from './mock-data'

type ActionVariant = StockMovementRow['action']

const actionConfig: Record<ActionVariant, { label: string; className: string }> = {
  in: {
    label: 'IN',
    className: 'bg-primary-container/80 text-on-primary-container',
  },
  out: {
    label: 'OUT',
    className: 'bg-error-container text-on-error-container',
  },
  adjustment: {
    label: 'ADJ',
    className: 'bg-secondary-container text-on-secondary-container',
  },
}

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0 text-on-surface-variant"
      aria-hidden
    >
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

export function StockMovementsTable() {
  const { stockMovements } = useDashboardData()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label-technical text-on-surface-variant">Stock Movements</p>
        <a
          href="#"
          className="text-body-sm font-medium text-primary hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Sync Logs
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left" aria-label="Stock Movements">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="pb-2 pr-4 text-label-technical text-on-surface-variant" scope="col">Part</th>
              <th className="pb-2 pr-4 text-label-technical text-on-surface-variant" scope="col">Qty</th>
              <th className="pb-2 text-label-technical text-on-surface-variant" scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map((row) => {
              const action = actionConfig[row.action]
              return (
                <tr
                  key={row.id}
                  className="border-b border-outline-variant/10 last:border-0"
                >
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <PackageIcon />
                      <span className="text-body-sm text-on-surface">{row.part}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-body-sm font-semibold text-on-surface">
                    {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-label-sm font-bold ${action.className}`}
                    >
                      {action.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
