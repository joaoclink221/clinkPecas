import { type ReactNode } from 'react'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ToggleOption {
  /** Valor interno — comparado com `value` para determinar o item ativo. */
  value: string
  /** Rótulo visível no botão. */
  label: string
  /** Desabilita individualmente esta opção sem afetar as demais. */
  disabled?: boolean
}

export interface ToggleGroupProps {
  /** Lista de opções disponíveis para seleção. */
  options: readonly ToggleOption[]
  /** Valor da opção atualmente selecionada. */
  value: string
  /** Callback disparado quando o usuário seleciona uma opção diferente. */
  onChange: (value: string) => void
  /**
   * Rótulo acessível do grupo — obrigatório para screen readers quando não há
   * um `<label>` visível associado externamente.
   */
  label: string
  /** Desabilita todas as opções ao mesmo tempo. */
  disabled?: boolean
  /** Tamanho dos botões internos. Padrão: 'md'. */
  size?: 'sm' | 'md'
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const sizeClass: Record<NonNullable<ToggleGroupProps['size']>, string> = {
  sm: 'rounded-lg px-3 py-1 text-label-sm',
  md: 'rounded-xl px-4 py-2 text-body-sm',
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Segmented control (toggle group) para seleção exclusiva entre opções.
 *
 * Usa `role="group"` + `aria-pressed` em cada botão — padrão amplamente
 * suportado por screen readers e alinhado com as guidelines ARIA 1.2.
 *
 * @example
 * <ToggleGroup
 *   label="Tipo de pessoa"
 *   options={[
 *     { value: 'pf', label: 'Pessoa Física' },
 *     { value: 'pj', label: 'Pessoa Jurídica' },
 *   ]}
 *   value={tipo}
 *   onChange={setTipo}
 * />
 */
export function ToggleGroup({
  options,
  value,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: ToggleGroupProps): ReactNode {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-xl bg-surface-container-highest p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value
        const isDisabled = disabled || option.disabled === true

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            disabled={isDisabled}
            onClick={() => {
              if (!isActive) onChange(option.value)
            }}
            className={[
              'font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              sizeClass[size],
              isActive
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
            ]
              .join(' ')
              .trim()}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
