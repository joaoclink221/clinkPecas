import type { ReactNode } from 'react'

export type InventoryKpiCardVariant = 'default' | 'critical' | 'feature'

export type InventoryKpiCardProps = {
  /** Rótulo do indicador. Em variant="critical" é exibido na cor de alerta. */
  label: string
  /** Valor principal já formatado (ex.: "14.282", "R$ 2.840.150"). */
  value: string
  /** Texto secundário abaixo do valor. */
  subLabel?: string
  /** Badge opcional no canto superior direito (ex.: "+2.4% MOM"). */
  badge?: string
  /** Variante visual que define posicionamento e cores específicas. */
  variant?: InventoryKpiCardVariant
  /** Classe Tailwind da borda esquerda colorida (ex.: "border-l-primary"). */
  accentClass: string
  /** Ícone SVG/ReactNode exibido no canto superior direito. */
  icon?: ReactNode
  /** Exibe barra gradiente decorativa no rodapé do card (variant feature). */
  gradientBarClass?: string
  /** Callback para tornar o card clicável (ex.: filtro crítico). */
  onClick?: () => void
  /** Indica que o filtro associado está ativo — destaca o card com ring. */
  isActive?: boolean
}

export function InventoryKpiCard({
  label,
  value,
  subLabel,
  badge,
  variant = 'default',
  accentClass,
  icon,
  gradientBarClass,
  onClick,
  isActive = false,
}: InventoryKpiCardProps) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-xl border-l-4 bg-surface-container-low shadow-ambient ${accentClass}${
        onClick ? ' cursor-pointer' : ''
      }${isActive ? ' ring-2 ring-[#fb923c] ring-offset-2 ring-offset-surface' : ''}`}
      aria-label={label}
      aria-pressed={onClick ? isActive : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      role={onClick ? 'button' : undefined}
    >
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* ── Linha superior: label + ícone / badge ───────────────── */}
        <div className="flex items-start justify-between gap-2">
          <p
            className={
              variant === 'critical'
                ? 'text-label-technical font-semibold text-[#fb923c]'
                : 'text-label-technical text-on-surface-variant'
            }
          >
            {label}
          </p>

          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-container-highest text-on-surface-variant [&>svg]:h-4 [&>svg]:w-4"
            aria-hidden
          >
            {icon}
          </span>
        </div>

        {/* ── Valor principal ─────────────────────────────────────── */}
        <div className="flex flex-col gap-0.5">
          {variant === 'feature' ? (
            <p className="text-[2rem] font-bold leading-none tracking-tight text-on-surface sm:text-[2.5rem]">
              {value}
            </p>
          ) : (
            <p className="text-headline-sm font-semibold text-on-surface">{value}</p>
          )}

          {subLabel ? (
            <p className="text-body-sm text-on-surface-variant">{subLabel}</p>
          ) : null}
        </div>

        {/* ── Badge (default variant: canto inferior esquerdo) ─────── */}
        {badge ? (
          <span
            className="w-fit text-label-sm font-semibold text-primary"
            aria-label={`Variação: ${badge}`}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {/* ── Barra gradiente decorativa (variant feature) ─────────── */}
      {gradientBarClass ? (
        <div
          className={`h-[3px] w-full ${gradientBarClass}`}
          aria-hidden
        />
      ) : null}
    </article>
  )
}
