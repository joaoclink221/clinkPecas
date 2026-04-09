export type PaymentMethod = 'Pix' | 'Boleto' | 'Cartão' | 'Dinheiro'

/** Forma de pagamento no formulário de nova venda */
export type SaleFormPaymentMethod = 'pix' | 'cartao' | 'boleto' | 'faturado'

/** Cliente disponível para seleção no formulário */
export type Client = {
  id: string
  name: string
}

/** Produto disponível para inclusão na venda */
export type Product = {
  sku: string
  name: string
  /** Preço unitário em BRL */
  unitPrice: number
}

/**
 * Item de venda — subtotal é SEMPRE derivado via `computeSubtotal(item)`,
 * nunca armazenado para evitar inconsistências.
 */
export type SaleItem = {
  product: Product
  quantity: number
}

export type SaleStatus = 'completed' | 'pending' | 'cancelled'

export type Sale = {
  id: string
  customerName: string
  /** CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) */
  customerDoc: string
  /** ISO 8601 date string, e.g. "2024-03-15" */
  date: string
  paymentMethod: PaymentMethod
  /** Número de parcelas — presente apenas em pagamentos parcelados */
  installments?: number
  /** Valor absoluto do desconto em BRL */
  discount: number
  totalValue: number
  status: SaleStatus
}

export type SalesKpiMock = {
  monthlyRevenue: number
  pendingOrders: number
  avgTicket: number
  /** Percentual de cancelamentos (0–100) */
  cancellationRate: number
  /** Variações vs mês anterior em pontos percentuais */
  trends: {
    monthlyRevenue: number
    pendingOrders: number
    avgTicket: number
    cancellationRate: number
  }
}
