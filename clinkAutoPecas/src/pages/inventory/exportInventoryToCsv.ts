import type { StockItem } from './inventory.types'

// ── Cabeçalho das colunas ─────────────────────────────────────────────────────

const CSV_HEADERS = [
  'SKU ID',
  'Nome',
  'Categoria',
  'Estoque Atual',
  'Estoque Máx',
  'Limiar Crítico',
  'Fornecedor',
  'Preço Unitário',
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

/**
 * Serializa um array de StockItem em uma string CSV (RFC 4180).
 * Retorna apenas o cabeçalho quando o array é vazio.
 */
export function serializeInventoryToCsv(items: StockItem[]): string {
  const header = CSV_HEADERS.join(',')

  if (items.length === 0) return header

  const rows = items.map((item) =>
    [
      escapeField(item.skuId),
      escapeField(item.name),
      escapeField(item.category),
      escapeField(String(item.stockQty)),
      escapeField(String(item.stockMax)),
      escapeField(String(item.stockThreshold)),
      escapeField(item.supplier),
      escapeField(String(item.unitPrice)),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}

/**
 * Gera e força o download de um arquivo CSV com os itens do inventário.
 *
 * @param items    Array de itens a exportar (já filtrado pelo chamador).
 * @param filename Nome do arquivo, incluindo extensão.
 * @returns        Número de registros exportados (para exibir no toast).
 */
export function exportInventoryToCsv(items: StockItem[], filename: string): number {
  const csv = serializeInventoryToCsv(items)

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

  return items.length
}

/**
 * Gera o nome do arquivo CSV com a data atual no formato YYYY-MM-DD.
 * Usa métodos UTC para garantir consistência em qualquer fuso horário.
 */
export function buildInventoryCsvFilename(date: Date = new Date()): string {
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `inventario-${yyyy}-${mm}-${dd}.csv`
}
