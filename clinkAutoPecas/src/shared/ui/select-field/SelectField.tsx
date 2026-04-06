import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
}

export type SelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'aria-invalid' | 'aria-describedby'
> & {
  /** Rótulo acessível associado ao select. */
  label: string
  /** Lista de opções renderizadas. */
  options: readonly SelectOption[]
  /** Placeholder exibido como primeira opção desabilitada. */
  placeholder?: string
  /** Mensagem de erro; ativa estado inválido quando presente. */
  error?: string
}

// ── Ícone chevron ─────────────────────────────────────────────────────────────

function ChevronDownIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="h-4 w-4 text-on-surface-variant"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Select dropdown acessível com label vinculado, estado de erro e ícone chevron.
 *
 * Segue o mesmo estilo visual do `TextField` — fundo `surface-container-highest`,
 * borda inferior teal no focus, mensagem de erro com `role="alert"`.
 *
 * @example
 * <SelectField
 *   label="Departamento"
 *   placeholder="Selecione…"
 *   options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
 *   value={dept}
 *   onChange={e => setDept(e.target.value)}
 * />
 */
export function SelectField({
  label,
  options,
  placeholder,
  error,
  disabled,
  className = '',
  ...selectProps
}: SelectFieldProps) {
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
        <select
          id={id}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full appearance-none border-0 border-b-2 border-transparent bg-transparent py-2.5 pl-3 pr-10 text-body-md text-on-surface outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron posicionado sobre o select — pointer-events-none para não bloquear clique */}
        <span className="pointer-events-none absolute right-3 flex items-center justify-center">
          <ChevronDownIcon />
        </span>
      </div>

      {error && (
        <p id={errorId} className="text-body-sm text-on-error-container" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
