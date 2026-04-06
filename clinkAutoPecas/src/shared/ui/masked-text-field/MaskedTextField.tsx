import { useCallback, type ChangeEvent } from 'react'

import { applyMask, type MaskType } from '@/shared/lib/masks'
import { TextField, type TextFieldProps } from '@/shared/ui/text-field'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type MaskedTextFieldProps = Omit<TextFieldProps, 'onChange' | 'type'> & {
  /** Tipo de máscara a aplicar. */
  mask: MaskType
  /**
   * Callback que recebe o valor já formatado (ex.: `"123.456.789-01"`).
   * Para obter somente os dígitos, use `unmask(value)` da lib de máscaras.
   */
  onChange?: (maskedValue: string) => void
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Wrapper do `TextField` que aplica formatação automática via `applyMask`.
 *
 * O valor armazenado no estado pai é sempre o valor **formatado** (ex.: `"(11) 98765-4321"`).
 * Para persistir apenas os dígitos, use `unmask()` antes de enviar ao backend.
 *
 * @example
 * const [cpf, setCpf] = useState('')
 * <MaskedTextField label="CPF" mask="cpf" value={cpf} onChange={setCpf} />
 * // Para enviar: unmask(cpf) → "12345678901"
 */
export function MaskedTextField({ mask, onChange, ...rest }: MaskedTextFieldProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = applyMask(mask, e.target.value)
      onChange?.(formatted)
    },
    [mask, onChange],
  )

  return (
    <TextField
      {...rest}
      type="text"
      inputMode={mask === 'moeda' ? 'decimal' : 'numeric'}
      onChange={handleChange}
    />
  )
}
