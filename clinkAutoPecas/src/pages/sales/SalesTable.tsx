import { StatusBadge } from '@/shared/ui/status-badge/StatusBadge'

import { PaymentMethodIcon } from './PaymentMethodIcon'
import type { Sale } from './sales.types'

type SalesTableProps = {
  sales: Sale[]
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

const statusLabel: Record<Sale['status'], string> = {
  completed: 'Completed',
  pending: 'Pending',
  cancelled: 'Cancelled',
}

const thClass =
  'px-4 py-3 text-left text-label-technical font-semibold uppercase tracking-wide text-on-surface-variant'

const tdClass = 'px-4 py-3 text-body-sm text-on-surface align-middle'

export function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-surface-container-low py-16 text-body-sm text-on-surface-variant"
        role="status"
        aria-live="polite"
      >
        Nenhuma venda encontrada para os filtros aplicados.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-low shadow-ambient">
      <table className="w-full border-collapse text-left" aria-label="Tabela de vendas">
        <thead>
          <tr className="border-b border-outline-variant/20">
            <th className={thClass} scope="col">Order ID</th>
            <th className={thClass} scope="col">Cliente</th>
            <th className={thClass} scope="col">Data</th>
            <th className={thClass} scope="col">Pagamento</th>
            <th className={`${thClass} text-right`} scope="col">Desconto</th>
            <th className={`${thClass} text-right`} scope="col">Total</th>
            <th className={thClass} scope="col">Status</th>
            <th className={`${thClass} text-center`} scope="col">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr
              key={sale.id}
              className="border-b border-outline-variant/10 transition-colors last:border-0 hover:bg-surface-container-highest/40"
            >
              {/* Order ID — teal link */}
              <td className={tdClass}>
                <span className="font-mono text-primary hover:underline cursor-pointer">
                  {sale.id}
                </span>
              </td>

              {/* Customer Name + doc muted */}
              <td className={tdClass}>
                <span className="block font-medium text-on-surface">{sale.customerName}</span>
                <span className="block text-on-surface-variant">{sale.customerDoc}</span>
              </td>

              {/* Date */}
              <td className={tdClass}>
                <span className="whitespace-nowrap text-on-surface-variant">
                  {formatDate(sale.date)}
                </span>
              </td>

              {/* Payment method — icon + label + optional installments */}
              <td className={tdClass}>
                <span className="flex items-center gap-1.5">
                  <PaymentMethodIcon method={sale.paymentMethod} />
                  <span>{sale.paymentMethod}</span>
                  {sale.installments && sale.installments > 1 ? (
                    <span className="text-on-surface-variant">({sale.installments}×)</span>
                  ) : null}
                </span>
              </td>

              {/* Discount — negative in red or R$ 0,00 */}
              <td className={`${tdClass} text-right`}>
                {sale.discount > 0 ? (
                  <span className="font-medium text-on-error-container">
                    -{brl.format(sale.discount)}
                  </span>
                ) : (
                  <span className="text-on-surface-variant">{brl.format(0)}</span>
                )}
              </td>

              {/* Total Value — bold */}
              <td className={`${tdClass} text-right`}>
                <span className="font-semibold text-on-surface">{brl.format(sale.totalValue)}</span>
              </td>

              {/* Status badge — pill shape, English label */}
              <td className={tdClass}>
                <StatusBadge status={sale.status} className="rounded-full">
                  {statusLabel[sale.status]}
                </StatusBadge>
              </td>

              {/* Actions — 3-dot menu (visual only) */}
              <td className={`${tdClass} text-center`}>
                <button
                  type="button"
                  aria-label={`Ações para ${sale.id}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
