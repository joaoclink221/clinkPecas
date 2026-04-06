import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type DateFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'id' | 'aria-invalid' | 'aria-describedby'
> & {
  /** Rótulo acessível associado ao campo. */
  label: string
  /** Mensagem de erro; ativa estado inválido quando presente. */
  error?: string
}

// ── Ícone calendário ──────────────────────────────────────────────────────────

function CalendarIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute right-3 h-5 w-5 text-on-surface-variant"
    >
      <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 2v4M14 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Campo de data acessível baseado em `<input type="date">` nativo.
 *
 * Usa o date picker nativo do browser (suporte > 97%) para evitar dependência
 * de bibliotecas de calendário. O valor é sempre uma string no formato `YYYY-MM-DD`.
 *
 * @example
 * const [date, setDate] = useState('')
 * <DateField
 *   label="Data da venda"
 *   value={date}
 *   onChange={e => setDate(e.target.value)}
 * />
 */
export function DateField({ label, error, disabled, className = '', ...inputProps }: DateFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <label
        htmlFor={id}
        className="text-label-sm font-medium text-on-surface-variant"
      >
        {label}
      </label>

      <div className="relative flex items-center rounded-md bg-surface-container-highest">
        <input
          id={id}
          type="date"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full border-0 border-b-2 border-transparent bg-transparent py-2.5 pl-3 pr-10 text-body-md text-on-surface outline-none transition-colors [color-scheme:dark] focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          {...inputProps}
        />
        <CalendarIcon />
      </div>

      {error && (
        <p id={errorId} className="text-body-sm text-on-error-container" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
