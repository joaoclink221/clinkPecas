import { useState } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useDashboardData } from './DashboardDataContext'

type DisplayMode = 'volume' | 'value'

const modeConfig: Record<DisplayMode, { dataKey: string; label: string; formatter: (v: number) => string }> = {
  volume: {
    dataKey: 'volume',
    label: 'Volume',
    formatter: (v) => `${v} units`,
  },
  value: {
    dataKey: 'value',
    label: 'Value',
    formatter: (v) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v),
  },
}

export function SalesVelocityChart() {
  const { salesVelocity } = useDashboardData()
  const [mode, setMode] = useState<DisplayMode>('volume')

  const config = modeConfig[mode]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-label-technical text-on-surface-variant">Sales Velocity</p>
          <p className="text-body-sm text-on-surface-variant/60">Last 30 Days</p>
        </div>

        <div
          className="flex rounded-lg border border-outline-variant/20 bg-surface-container-highest p-0.5"
          role="group"
          aria-label="Modo de exibição"
        >
          {(Object.keys(modeConfig) as DisplayMode[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              aria-pressed={mode === key}
              className={[
                'rounded-md px-3 py-1 text-label-sm font-medium transition-colors',
                mode === key
                  ? 'bg-surface-container-low text-on-surface shadow-ambient'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {modeConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={salesVelocity} barCategoryGap="30%">
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: 'rgba(78,222,163,0.06)' }}
            contentStyle={{
              background: 'var(--color-surface-container-highest)',
              border: '1px solid rgba(60,74,66,0.4)',
              borderRadius: '8px',
              color: 'var(--color-on-surface)',
              fontSize: '12px',
            }}
            formatter={(value) => [typeof value === 'number' ? config.formatter(value) : String(value), config.label]}
          />
          <Bar dataKey={config.dataKey} radius={[4, 4, 0, 0]} maxBarSize={48}>
            {salesVelocity.map((_, index) => (
              <Cell
                key={index}
                fill={
                  index === salesVelocity.length - 2
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-container-highest)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
