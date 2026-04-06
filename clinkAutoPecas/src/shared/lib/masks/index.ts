/**
 * Funções puras de formatação/máscara para campos de formulário.
 *
 * Todas as funções recebem uma string qualquer (com ou sem máscara) e retornam
 * a string formatada. Nenhuma função lança exceção — entradas inválidas são
 * tratadas defensivamente retornando o valor parcial ou vazio.
 *
 * Uso típico: chamar no handler onChange antes de atualizar o estado.
 * Para persistir apenas os dígitos, use `unmask()`.
 */

export type MaskType = 'cpf' | 'cnpj' | 'telefone' | 'moeda'

// ── Helpers internos ──────────────────────────────────────────────────────────

/** Retorna apenas os dígitos da string. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

// ── Máscaras individuais ──────────────────────────────────────────────────────

/**
 * Formata CPF no padrão `000.000.000-00`.
 * Aceita até 11 dígitos; dígitos extras são descartados.
 */
export function maskCpf(value: string): string {
  const d = digitsOnly(value).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/**
 * Formata CNPJ no padrão `00.000.000/0000-00`.
 * Aceita até 14 dígitos; dígitos extras são descartados.
 */
export function maskCnpj(value: string): string {
  const d = digitsOnly(value).slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

/**
 * Formata telefone no padrão `(00) 00000-0000` (celular, 11 dígitos)
 * ou `(00) 0000-0000` (fixo, 10 dígitos).
 * Aceita até 11 dígitos; dígitos extras são descartados.
 */
export function maskTelefone(value: string): string {
  const d = digitsOnly(value).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/**
 * Formata valor monetário no padrão `R$ 1.234,56`.
 *
 * Interpreta a string como centavos (os dois últimos dígitos são centavos).
 * Ex.: digitar "12345" → `R$ 123,45`; digitar "1234567" → `R$ 12.345,67`.
 *
 * Retorna string vazia se não houver dígitos.
 */
export function maskMoeda(value: string): string {
  const d = digitsOnly(value)
  if (!d) return ''
  const cents = parseInt(d, 10)
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

/** Aplica a máscara correta conforme o tipo especificado. */
export function applyMask(type: MaskType, value: string): string {
  switch (type) {
    case 'cpf':      return maskCpf(value)
    case 'cnpj':     return maskCnpj(value)
    case 'telefone': return maskTelefone(value)
    case 'moeda':    return maskMoeda(value)
  }
}

// ── Utilitário ────────────────────────────────────────────────────────────────

/**
 * Remove toda a formatação e retorna apenas os dígitos.
 * Útil para persistir/enviar o valor raw ao backend.
 *
 * @example unmask('123.456.789-09') // '12345678909'
 * @example unmask('R$ 1.234,56')    // '123456'
 */
export function unmask(value: string): string {
  return digitsOnly(value)
}
