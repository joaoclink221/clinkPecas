export type PaymentMethod = 'Pix' | 'Boleto' | 'Cartão' | 'Dinheiro'

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
