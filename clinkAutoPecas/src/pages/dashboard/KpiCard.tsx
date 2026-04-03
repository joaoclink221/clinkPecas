import type { ReactNode } from 'react'

export type KpiCardProps = {
  /** Rótulo descritivo do indicador (ex.: "Monthly Sales"). */
  label: string
  /** Valor principal formatado (ex.: "$124,592"). */
  value: string
  /** Badge contextual no canto superior direito (ex.: "+12.4%", "24 Active"). */
  badge?: string
  /** Variante de cor do badge. */
  badgeVariant?: 'positive' | 'warning' | 'critical' | 'neutral'
  /** Ícone decorativo SVG/ReactNode. */
  icon?: ReactNode
}

const badgeVariantClass: Record<NonNullable<KpiCardProps['badgeVariant']>, string> = {
  positive: 'text-primary',
  warning: 'text-secondary',
  critical: 'text-on-error-container',
  neutral: 'text-on-surface-variant',
}

export function KpiCard({
  label,
  value,
  badge,
  badgeVariant = 'neutral',
  icon,
}: KpiCardProps) {
  return (
    <article
      className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-5 shadow-ambient"
      aria-label={label}
    >
      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-primary [&>svg]:h-5 [&>svg]:w-5"
            aria-hidden
          >
            {icon}
          </span>
        ) : (
          <span className="h-9 w-9 shrink-0 rounded-lg bg-surface-container-highest" aria-hidden />
        )}

        {badge ? (
          <span
            className={`text-label-sm font-semibold ${badgeVariantClass[badgeVariant]}`}
            aria-label={`Indicador: ${badge}`}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-label-technical text-on-surface-variant">{label}</p>
        <p className="text-headline-sm font-semibold text-on-surface">{value}</p>
      </div>
    </article>
  )
}
