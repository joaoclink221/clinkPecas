import type { ReactNode } from 'react'

// ── Mapa de variantes semânticas de cor ──────────────────────────────────────

const VARIANT_STYLES = {
  /** Verde — indicadores positivos (Total Mensal) */
  success: { border: 'border-l-[#10b981]', label: 'text-[#10b981]', badge: 'text-[#10b981]' },
  /** Roxo — pendências e alertas suaves (Pedidos Pendentes) */
  purple:  { border: 'border-l-[#a855f7]', label: 'text-[#a855f7]', badge: 'text-[#a855f7]' },
  /** Cyan — informações neutras (Recebidos 30d) */
  info:    { border: 'border-l-[#06b6d4]', label: 'text-[#06b6d4]', badge: 'text-[#06b6d4]' },
  /** Coral — erros e cancelamentos (Cancelados) */
  danger:  { border: 'border-l-[#f87171]', label: 'text-[#f87171]', badge: 'text-[#f87171]' },
} as const

export type PurchasesKpiCardVariant = keyof typeof VARIANT_STYLES

export type PurchasesKpiCardProps = {
  /** Rótulo do indicador — exibido na cor de acento da variante. */
  label: string
  /** Valor principal já formatado (ex.: "R$ 142.850", "24"). */
  value: string
  /** Texto secundário abaixo do valor. */
  subLabel?: string
  /** Badge de tendência (ex.: "↑ +12,5% vs mês anterior"). */
  badge?: string
  /** Variante semântica que define a cor de acento do card. */
  variant: PurchasesKpiCardVariant
  /** Ícone SVG/ReactNode exibido no canto superior direito. */
  icon?: ReactNode
}

// ── Componente ────────────────────────────────────────────────────────────────

export function PurchasesKpiCard({
  label,
  value,
  subLabel,
  badge,
  variant,
  icon,
}: PurchasesKpiCardProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border-l-4 bg-surface-container-low p-5 shadow-ambient ${styles.border}`}
      aria-label={label}
    >
      {/* ── Linha superior: label + ícone ───────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <p className={`text-label-technical font-semibold ${styles.label}`}>
          {label}
        </p>
        {icon ? (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-container-highest text-on-surface-variant [&>svg]:h-4 [&>svg]:w-4"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
      </div>

      {/* ── Valor principal ─────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5">
        <p className="text-headline-sm font-semibold text-on-surface">{value}</p>
        {subLabel ? (
          <p className="text-body-sm text-on-surface-variant">{subLabel}</p>
        ) : null}
      </div>

      {/* ── Badge de tendência ───────────────────────────────────── */}
      {badge ? (
        <span
          className={`w-fit text-label-sm font-semibold ${styles.badge}`}
          aria-label={`Indicador: ${badge}`}
        >
          {badge}
        </span>
      ) : null}
    </article>
  )
}
