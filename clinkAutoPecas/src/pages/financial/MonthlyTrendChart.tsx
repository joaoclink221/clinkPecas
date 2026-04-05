import { type ReactNode, useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { MonthlyTrendData } from './financial.types'
import { trendMock } from './mock-data'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

function formatTooltipValue(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// ── Constantes de estilo ──────────────────────────────────────────────────────

const COLOR_REALIZADO = '#10B981'
const COLOR_PROJETADO = '#6B7280'

const TOOLTIP_STYLE = {
  background: 'var(--color-surface-container-highest)',
  border: '1px solid rgba(60,74,66,0.4)',
  borderRadius: '8px',
  color: 'var(--color-on-surface)',
  fontSize: '12px',
}

const AXIS_TICK_STYLE = {
  fill: 'var(--color-on-surface-variant)',
  fontSize: 11,
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface MonthlyTrendChartProps {
  /** Dados do gráfico. Usa `trendMock` por padrão até a integração com API. */
  data?: MonthlyTrendData
}

// ── Componente ────────────────────────────────────────────────────────────────

export function MonthlyTrendChart({ data = trendMock }: MonthlyTrendChartProps): ReactNode {
  // Transforma os arrays paralelos em array de objetos para o Recharts
  const chartData = useMemo(
    () =>
      data.months.map((month, idx) => ({
        month,
        realizado: data.realizado[idx],
        projetado: data.projetado[idx],
      })),
    [data],
  )

  return (
    <div className="flex flex-col gap-4">

      {/* ── 3.2 Cabeçalho + legenda ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-body-lg font-bold text-on-surface">Tendência Mensal</h2>
          <p className="text-body-sm text-on-surface-variant">
            Comparativo de faturamento vs meta anual
          </p>
        </div>

        {/* Legenda inline — alinhada à direita */}
        <ul
          className="flex shrink-0 items-center gap-4"
          role="list"
          aria-label="Legenda do gráfico"
        >
          <li className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLOR_REALIZADO }}
              aria-hidden
            />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Realizado
            </span>
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLOR_PROJETADO }}
              aria-hidden
            />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Projetado
            </span>
          </li>
        </ul>
      </div>

      {/* ── 3.1 Gráfico de linhas ─────────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="rgba(99,115,101,0.15)"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={AXIS_TICK_STYLE}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={AXIS_TICK_STYLE}
            tickFormatter={formatYAxis}
            width={42}
          />

          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [
              formatTooltipValue(Number(value)),
              name === 'realizado' ? 'Realizado' : 'Projetado',
            ]}
            cursor={{ stroke: 'rgba(99,115,101,0.3)', strokeWidth: 1 }}
          />

          {/* Linha "Realizado" — teal, sólida, com dot */}
          <Line
            type="monotone"
            dataKey="realizado"
            name="realizado"
            stroke={COLOR_REALIZADO}
            strokeWidth={2}
            dot={{ r: 3, fill: COLOR_REALIZADO, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: COLOR_REALIZADO, strokeWidth: 0 }}
          />

          {/* Linha "Projetado" — cinza, tracejada, sem dot */}
          <Line
            type="monotone"
            dataKey="projetado"
            name="projetado"
            stroke={COLOR_PROJETADO}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: COLOR_PROJETADO, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}
