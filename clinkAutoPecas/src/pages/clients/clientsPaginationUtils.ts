/**
 * Calcula a sequência de itens da paginação com elipses.
 *
 * Regras:
 * - Sempre exibe página 1 e a última.
 * - Exibe a página ativa e seus vizinhos imediatos (active-1, active, active+1).
 * - Insere `null` (renderizado como "…") nos gaps > 1.
 *
 * @example
 * buildPageItems(5, 125) → [1, 2, 3, 4, 5, 6, null, 125]
 * buildPageItems(1, 125) → [1, 2, null, 125]
 * buildPageItems(125, 125) → [1, null, 124, 125]
 */
export function buildPageItems(currentPage: number, totalPages: number): (number | null)[] {
  if (totalPages <= 1) return [1]

  const visible = new Set<number>()

  // Sempre primeira e última
  visible.add(1)
  visible.add(totalPages)

  // Vizinhos imediatos da página ativa
  for (let p = currentPage - 1; p <= currentPage + 1; p++) {
    if (p >= 1 && p <= totalPages) visible.add(p)
  }

  const sorted = Array.from(visible).sort((a, b) => a - b)

  // Inserir null (elipse) nos gaps > 1 entre páginas consecutivas
  const items: (number | null)[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      items.push(null)
    }
    items.push(sorted[i])
  }

  return items
}
