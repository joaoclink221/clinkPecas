export type Category =
  | 'Motores'
  | 'Suspensão'
  | 'Filtros'
  | 'Freios'
  | 'Elétrica'
  | 'Outros'

export type StockItem = {
  /** Código único do produto (ex.: "OB-4492-XT"). */
  skuId: string
  /** Nome comercial da peça (ex.: "Velas de Ignição Iridium"). */
  name: string
  /** Linha ou série do fabricante (ex.: "NGK Premium Series"). */
  subtitle: string
  category: Category
  /** Quantidade atual em estoque. */
  stockQty: number
  /** Capacidade máxima do estoque para esta SKU. */
  stockMax: number
  /** Abaixo deste valor o item entra em estado de alerta/crítico. */
  stockThreshold: number
  supplier: string
  /** Preço unitário em BRL. */
  unitPrice: number
}

export type StockKpiMock = {
  /** Total de SKUs ativos no sistema (toda a base, não só a página). */
  totalSkus: number
  /** Itens com stockQty abaixo de stockThreshold em toda a base. */
  criticalAlerts: number
  /** Soma de (stockQty * unitPrice) de toda a base em BRL. */
  inventoryValue: number
  /** Variação percentual mês a mês para totalSkus (0–100). */
  trendTotalSkus: number
}
