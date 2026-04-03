import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useDashboardData } from './DashboardDataContext'

function formatTotalUnits(total: number): string {
  return total >= 1000 ? `${(total / 1000).toFixed(1)}k` : String(total)
}

export function InventoryMixChart() {
  const { inventoryMix } = useDashboardData()
  const totalUnits = inventoryMix.reduce((sum, item) => sum + item.units, 0)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-label-technical text-on-surface-variant">Inventory Mix</p>

      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={inventoryMix}
              dataKey="units"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={2}
              stroke="var(--color-surface-container-low)"
            >
              {inventoryMix.map((item) => (
                <Cell key={item.category} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-container-highest)',
                border: '1px solid rgba(60,74,66,0.4)',
                borderRadius: '8px',
                color: 'var(--color-on-surface)',
                fontSize: '12px',
              }}
              formatter={(value) => [
                typeof value === 'number' ? `${value.toLocaleString()} units` : String(value),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Label central sobreposto ao donut */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden
        >
          <span className="text-headline-sm font-semibold text-on-surface">
            {formatTotalUnits(totalUnits)}
          </span>
          <span className="text-label-sm text-on-surface-variant">UNITS</span>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2" role="list" aria-label="Categorias do inventário">
        {inventoryMix.map((item) => (
          <li key={item.category} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="text-body-sm text-on-surface-variant">{item.category}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
