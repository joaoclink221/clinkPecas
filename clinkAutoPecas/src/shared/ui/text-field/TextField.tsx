import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react'

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'aria-invalid' | 'id'> & {
  /** Rótulo associado ao campo (acessível). */
  label: string
  /** Ícone ou elemento decorativo à esquerda do texto. */
  leadingIcon?: ReactNode
  /** Mensagem de erro; quando presente, o campo fica em estado inválido. */
  error?: string
  id?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, leadingIcon, error, id, className = '', disabled, ...inputProps },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? `text-field-${generatedId}`
  const errorId = `${inputId}-error`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <label className="text-label-sm font-medium text-on-surface-variant" htmlFor={inputId}>
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-md bg-surface-container-highest ${
          leadingIcon ? 'pl-10' : 'pl-3'
        } pr-3`}
      >
        {leadingIcon ? (
          <span
            className="pointer-events-none absolute left-3 flex h-5 w-5 items-center justify-center text-on-surface-variant [&>svg]:h-5 [&>svg]:w-5"
            aria-hidden
          >
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full border-0 border-b-2 border-transparent bg-transparent py-2.5 text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          {...inputProps}
        />
      </div>
      {error ? (
        <p id={errorId} className="text-body-sm text-on-error-container" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})
