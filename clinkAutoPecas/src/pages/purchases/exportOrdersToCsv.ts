import type { PurchaseOrder } from './purchases.types'

// ── Cabeçalho das colunas ─────────────────────────────────────────────────────

const CSV_HEADERS = ['ID Pedido', 'Fornecedor', 'Data Emissão', 'Valor Total', 'Status']

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

/**
 * Serializa um array de PurchaseOrder em uma string CSV (RFC 4180).
 * Retorna string vazia quando o array é vazio (apenas cabeçalho).
 */
export function serializeOrdersToCsv(orders: PurchaseOrder[]): string {
  const header = CSV_HEADERS.join(',')

  if (orders.length === 0) return header

  const rows = orders.map((o) =>
    [
      escapeField(o.id),
      escapeField(o.supplier),
      escapeField(o.issueDate),
      escapeField(String(o.totalValue)),
      escapeField(o.status),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}

/**
 * Gera e força o download de um arquivo CSV com as ordens de compra.
 *
 * @param orders   Array de ordens a exportar (já filtrado pelo chamador).
 * @param filename Nome do arquivo, incluindo extensão.
 * @returns        Número de registros exportados (para exibir no toast).
 */
export function exportOrdersToCsv(orders: PurchaseOrder[], filename: string): number {
  const csv = serializeOrdersToCsv(orders)

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

  return orders.length
}

/**
 * Gera o nome do arquivo CSV com a data atual no formato YYYY-MM-DD.
 */
export function buildCsvFilename(date: Date = new Date()): string {
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `ordens-compra-${yyyy}-${mm}-${dd}.csv`
}
