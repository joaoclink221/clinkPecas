// ── Enums e union types ───────────────────────────────────────────────────────

/** Status de ciclo de vida de uma ordem de compra. */
export type PurchaseStatus = 'received' | 'pending' | 'cancelled'

/**
 * Tag descritiva do fornecedor exibida como subtítulo muted na tabela.
 * Representa a relação comercial / situação logística do fornecedor.
 */
export type SupplierTag =
  | 'PREMIUM VENDOR'
  | 'LOGISTICS PENDING'
  | 'DIRECT IMPORT'
  | 'CREDIT HOLD'
  | 'REGIONAL WHOLESALER'

// ── Interfaces de domínio ─────────────────────────────────────────────────────

/** Representa uma ordem de compra no sistema de suprimentos. */
export type PurchaseOrder = {
  /** Identificador único da ordem (ex.: "PUR-8821"). */
  id: string
  /** Razão social ou nome comercial do fornecedor. */
  supplier: string
  /** Tag descritiva do fornecedor exibida em muted abaixo do nome. */
  supplierTag: SupplierTag
  /** Data de emissão no formato ISO "YYYY-MM-DD". */
  issueDate: string
  /** Valor total da ordem em BRL (sem formatação). */
  totalValue: number
  /** Status atual do ciclo de vida da ordem. */
  status: PurchaseStatus
}

// ── Tipo de resumo para KPIs ──────────────────────────────────────────────────

/**
 * Resumo agregado dos indicadores de compras para o período atual.
 * Representa métricas calculadas sobre o conjunto completo de ordens do sistema
 * (não apenas a página visível da tabela).
 */
export type PurchasesKpiMock = {
  /** Soma dos valores de todas as ordens do mês corrente (BRL). */
  totalMonthly: number
  /** Quantidade de ordens com status 'pending'. */
  pendingOrders: number
  /** Quantidade de ordens com status 'received' nos últimos 30 dias. */
  receivedLast30d: number
  /** Quantidade de ordens com status 'cancelled'. */
  cancelledOrders: number
  /** Variação percentual do total mensal vs. mês anterior (ex.: 12.5 = +12,5%). */
  trendTotalMonthly: number
  /** Eficiência de entrega percentual dos pedidos recebidos (ex.: 94 = 94%). */
  deliveryEfficiency: number
  /** Investimento total acumulado no mês de Out (BRL). */
  totalInvestment: number
  /** Ticket médio por pedido no período (BRL). */
  avgTicket: number
  /** Prazo médio de pagamento em dias. */
  avgPaymentDays: number
}
