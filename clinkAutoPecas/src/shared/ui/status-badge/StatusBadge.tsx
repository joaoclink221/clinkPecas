import type { HTMLAttributes, ReactNode } from 'react'

export type StatusKind = 'pending' | 'completed' | 'cancelled'

export type StatusBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  status: StatusKind
  /** Sobrescreve o texto padrão do status. */
  children?: ReactNode
}

const defaultLabel: Record<StatusKind, string> = {
  pending: 'Pendente',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

const statusClass: Record<StatusKind, string> = {
  pending:
    'border border-status-pending-border bg-status-pending-bg text-status-pending-fg',
  completed:
    'border border-status-completed-border bg-status-completed-bg text-status-completed-fg',
  cancelled:
    'border border-status-cancelled-border bg-status-cancelled-bg text-status-cancelled-fg',
}

export function StatusBadge({ status, children, className = '', ...rest }: StatusBadgeProps) {
  const content = children ?? defaultLabel[status]

  return (
    <span
      className={`inline-flex max-w-max items-center rounded-sm px-2 py-1 text-label-sm font-bold uppercase tracking-wide ${statusClass[status]} ${className}`.trim()}
      {...rest}
    >
      {content}
    </span>
  )
}
