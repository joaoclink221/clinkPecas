import type { ReactNode } from 'react'

export type SalesKpiCardProps = {
  /** Rótulo descritivo do indicador (ex.: "Receita Mensal"). */
  label: string
  /** Valor principal formatado (ex.: "R$ 124.592"). */
  value: string
  /** Texto secundário abaixo do valor (ex.: "Aguardando liberação"). */
  subLabel?: string
  /** Badge contextual de variação (ex.: "+12,5%", "42 ativos"). */
  badge?: string
  /** Variante de cor do badge. */
  badgeVariant?: 'positive' | 'warning' | 'critical' | 'neutral'
  /** Cor do accent na borda esquerda (classe Tailwind border-l-*). */
  accentClass: string
  /** Ícone decorativo SVG/ReactNode exibido no canto superior direito. */
  icon?: ReactNode
}

const badgeVariantClass: Record<NonNullable<SalesKpiCardProps['badgeVariant']>, string> = {
  positive: 'text-primary',
  warning: 'text-secondary',
  critical: 'text-on-error-container',
  neutral: 'text-on-surface-variant',
}

export function SalesKpiCard({
  label,
  value,
  subLabel,
  badge,
  badgeVariant = 'neutral',
  accentClass,
  icon,
}: SalesKpiCardProps) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border-l-4 bg-surface-container-low p-5 shadow-ambient ${accentClass}`}
      aria-label={label}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-label-technical text-on-surface-variant">{label}</p>

        {icon ? (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-container-highest text-on-surface-variant [&>svg]:h-4 [&>svg]:w-4"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-headline-sm font-semibold text-on-surface">{value}</p>
        {subLabel ? (
          <p className="text-body-sm text-on-surface-variant">{subLabel}</p>
        ) : null}
      </div>

      {badge ? (
        <span
          className={`w-fit text-label-sm font-semibold ${badgeVariantClass[badgeVariant]}`}
          aria-label={`Variação: ${badge}`}
        >
          {badge}
        </span>
      ) : null}
    </article>
  )
}
