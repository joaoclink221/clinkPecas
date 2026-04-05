import type { Entity } from './clients.types'

// ── Cabeçalho das colunas ─────────────────────────────────────────────────────

const CSV_HEADERS = [
  'Nome',
  'Tipo',
  'CNPJ/CPF',
  'Email',
  'Telefone',
  'Limite de Crédito',
  'Saldo Devedor',
  'Status Financeiro',
  'Status',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Escapa um campo CSV: envolve em aspas duplas se contiver vírgula, aspas ou
 * quebra de linha; duplica aspas internas conforme RFC 4180.
 */
function escapeField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// ── Serialização ──────────────────────────────────────────────────────────────

/**
 * Serializa um array de Entity em uma string CSV (RFC 4180).
 * Retorna apenas o cabeçalho quando o array é vazio.
 *
 * @param entities Array já filtrado pelo chamador.
 */
export function serializeEntitiesToCsv(entities: Entity[]): string {
  const header = CSV_HEADERS.join(',')

  if (entities.length === 0) return header

  const rows = entities.map((e) =>
    [
      escapeField(e.name),
      escapeField(e.entityKind),
      escapeField(e.taxId),
      escapeField(e.email),
      escapeField(e.phone),
      escapeField(e.creditLimit !== null ? String(e.creditLimit) : ''),
      escapeField(String(e.outstandingBalance)),
      escapeField(e.financialStatus),
      escapeField(e.status),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}

// ── Download ──────────────────────────────────────────────────────────────────

/**
 * Gera e força o download de um arquivo CSV com as entidades fornecidas.
 *
 * @param entities Array já filtrado pelo chamador (usa `filteredEntities`, não a página visível).
 * @param filename Nome do arquivo, incluindo extensão.
 * @returns        Número de registros exportados.
 */
export function exportEntitiesToCsv(entities: Entity[], filename: string): number {
  const csv = serializeEntitiesToCsv(entities)

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'

  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  URL.revokeObjectURL(url)

  return entities.length
}

// ── Filename ──────────────────────────────────────────────────────────────────

/**
 * Gera o nome do arquivo CSV com a data atual no formato YYYY-MM-DD.
 *
 * @example buildEntitiesCsvFilename() → "entidades-2024-03-15.csv"
 */
export function buildEntitiesCsvFilename(date: Date = new Date()): string {
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `entidades-${yyyy}-${mm}-${dd}.csv`
}
