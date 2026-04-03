import type { ReactElement } from 'react'

import type { PaymentMethod } from './sales.types'

type PaymentMethodIconProps = {
  method: PaymentMethod
}

function PixIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10.94 10.94a3.12 3.12 0 0 1-4.41 0L4.35 8.76a.54.54 0 0 0-.76 0l-1.1 1.1a.39.39 0 0 0 0 .54l2.44 2.44a3.89 3.89 0 0 0 5.5 0l2.44-2.44a.39.39 0 0 0 0-.54l-1.1-1.1a.54.54 0 0 0-.83.18ZM13.51 5.6 11.07 3.16a3.89 3.89 0 0 0-5.5 0L3.13 5.6a.39.39 0 0 0 0 .54l1.1 1.1c.21.21.55.21.76 0l2.18-2.18a3.12 3.12 0 0 1 4.41 0l2.18 2.18c.21.21.55.21.76 0l1.1-1.1a.39.39 0 0 0-.11-.54Z"
        fill="#4edea3"
      />
      <path
        d="M6.16 9.07 8 10.91l1.84-1.84a1.17 1.17 0 0 0 0-1.64L8 5.59 6.16 7.43a1.17 1.17 0 0 0 0 1.64Z"
        fill="#4edea3"
      />
    </svg>
  )
}

function BoletoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="3" width="1.5" height="10" rx="0.5" fill="currentColor" />
      <rect x="3.5" y="3" width="1" height="10" rx="0.5" fill="currentColor" />
      <rect x="5.5" y="3" width="2" height="10" rx="0.5" fill="currentColor" />
      <rect x="8.5" y="3" width="1" height="10" rx="0.5" fill="currentColor" />
      <rect x="10.5" y="3" width="1.5" height="10" rx="0.5" fill="currentColor" />
      <rect x="13" y="3" width="2" height="10" rx="0.5" fill="currentColor" />
    </svg>
  )
}

function CartaoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="6" width="14" height="2.5" fill="currentColor" opacity="0.5" />
      <rect x="3" y="10" width="4" height="1.2" rx="0.6" fill="currentColor" opacity="0.7" />
      <circle cx="11" cy="10.6" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="12.8" cy="10.6" r="1.2" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

function DinheiroIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1" y="4" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="3" y="7.4" width="1.5" height="1.2" rx="0.6" fill="currentColor" />
      <rect x="11.5" y="7.4" width="1.5" height="1.2" rx="0.6" fill="currentColor" />
    </svg>
  )
}

const iconMap: Record<PaymentMethod, () => ReactElement> = {
  Pix: PixIcon,
  Boleto: BoletoIcon,
  Cartão: CartaoIcon,
  Dinheiro: DinheiroIcon,
}

export function PaymentMethodIcon({ method }: PaymentMethodIconProps) {
  const Icon = iconMap[method]
  return (
    <span
      className="inline-flex shrink-0 items-center text-on-surface-variant"
      aria-label={method}
    >
      <Icon />
    </span>
  )
}
