import type { Client, Product, SaleItem } from './sales.types'

// ── Vendedor fixo ─────────────────────────────────────────────────────────────

export const SELLER = 'Carlos Alberto (ID: 442)'

// ── Mock de clientes ──────────────────────────────────────────────────────────

export const clientsMock: Client[] = [
  { id: 'CLI-001', name: 'Auto Peças Carvalho Ltda' },
  { id: 'CLI-002', name: 'Marcos Aurélio Silva' },
  { id: 'CLI-003', name: 'Oficina do Zé Motorista' },
  { id: 'CLI-004', name: 'Fernanda Costa' },
  { id: 'CLI-005', name: 'Turbo Parts Ltda' },
]

// ── Mock de produtos disponíveis ──────────────────────────────────────────────

export const productsMock: Product[] = [
  { sku: 'OG-TB-001', name: 'Turbo Compressor T3 Titanium',    unitPrice: 4500 },
  { sku: 'OG-IJ-992', name: 'Kit Injeção Eletrônica RaceSpec', unitPrice: 3450 },
  { sku: 'OG-FL-210', name: 'Filtro de Óleo Performance Pro',  unitPrice:  189 },
  { sku: 'OG-SU-430', name: 'Suspensão Esportiva Coilover',    unitPrice: 2800 },
  { sku: 'OG-FR-055', name: 'Disco de Freio Ventilado 330mm',  unitPrice:  620 },
  { sku: 'OG-EC-770', name: 'ECU Programável Stage 3',         unitPrice: 1950 },
]

// ── Utilitários de cálculo ────────────────────────────────────────────────────

/**
 * Retorna o subtotal de um item.
 * O subtotal é SEMPRE derivado — nunca armazenado em `SaleItem`.
 */
export function computeSubtotal(item: SaleItem): number {
  return item.product.unitPrice * item.quantity
}

/**
 * Retorna o valor total líquido após aplicar o desconto percentual.
 * @param items       Lista de itens da venda
 * @param discountRate Taxa de desconto (0–1), ex.: 0.10 para 10 %
 */
export function computeTotal(items: SaleItem[], discountRate: number): number {
  const gross = items.reduce((acc, item) => acc + computeSubtotal(item), 0)
  return gross * (1 - Math.min(Math.max(discountRate, 0), 1))
}

// ── Estado inicial da venda (itens da imagem para visualização) ───────────────

export const INITIAL_SALE_ITEMS: SaleItem[] = [
  { product: productsMock[0], quantity: 2 }, // Turbo Compressor T3 Titanium × 2 = R$ 9.000
  { product: productsMock[1], quantity: 1 }, // Kit Injeção Eletrônica RaceSpec × 1 = R$ 3.450
]
