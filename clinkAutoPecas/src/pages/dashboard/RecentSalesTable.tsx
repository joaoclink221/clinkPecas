import { StatusBadge } from '@/shared/ui/status-badge/StatusBadge'

import { useDashboardData } from './DashboardDataContext'

export function RecentSalesTable() {
  const { recentSales } = useDashboardData()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label-technical text-on-surface-variant">Recent Sales</p>
        <a
          href="#"
          className="text-body-sm font-medium text-primary hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left" aria-label="Recent Sales">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="pb-2 pr-4 text-label-technical text-on-surface-variant" scope="col">ID</th>
              <th className="pb-2 pr-4 text-label-technical text-on-surface-variant" scope="col">Customer</th>
              <th className="pb-2 pr-4 text-label-technical text-on-surface-variant" scope="col">Value</th>
              <th className="pb-2 text-label-technical text-on-surface-variant" scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((row) => (
              <tr
                key={row.id}
                className="border-b border-outline-variant/10 last:border-0"
              >
                <td className="py-2.5 pr-4 text-body-sm font-medium text-on-surface-variant">
                  {row.id}
                </td>
                <td className="py-2.5 pr-4 text-body-sm text-on-surface">
                  {row.customer}
                </td>
                <td className="py-2.5 pr-4 text-body-sm font-semibold text-on-surface">
                  {row.value}
                </td>
                <td className="py-2.5">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
