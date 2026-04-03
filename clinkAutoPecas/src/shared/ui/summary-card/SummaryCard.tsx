export type TrendDirection = 'up' | 'down' | 'neutral'

export type SummaryCardTrend = {
  direction: TrendDirection
  /** Ex.: "+12% vs mês anterior" */
  label: string
}

export type SummaryCardProps = {
  title: string
  /** Valor exibido em destaque (já formatado, ex.: moeda). */
  value: string
  trend?: SummaryCardTrend
  className?: string
}

function trendArrow(direction: TrendDirection): string {
  if (direction === 'up') return '↑'
  if (direction === 'down') return '↓'
  return '→'
}

export function SummaryCard({ title, value, trend, className = '' }: SummaryCardProps) {
  return (
    <article
      className={`rounded-xl bg-surface-container-low p-5 shadow-ambient ${className}`.trim()}
    >
      <p className="text-label-technical text-on-surface-variant">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-on-surface">{value}</p>
      {trend ? (
        <p
          className={`mt-2 text-body-sm font-medium ${
            trend.direction === 'up'
              ? 'text-primary'
              : trend.direction === 'down'
                ? 'text-on-error-container'
                : 'text-on-surface-variant'
          }`}
        >
          <span aria-hidden>{trendArrow(trend.direction)}</span>{' '}
          <span>{trend.label}</span>
        </p>
      ) : null}
    </article>
  )
}
