// ── Unions ────────────────────────────────────────────────────────────────────

/** Ícone do avatar da entidade na coluna Cliente/Beneficiário. */
export type EntityAvatarType = 'person' | 'building' | 'workshop' | 'gear'

/** Método de pagamento da transação. */
export type PaymentMethod = 'pix' | 'boleto' | 'cartao'

/** Status do pagamento — mapeia diretamente para os 3 badges da tela. */
export type TransactionStatus = 'pago' | 'pendente' | 'atrasado'

/** Direção da movimentação: a receber ou a pagar. */
export type TransactionType = 'receber' | 'pagar'

// ── Interface principal ───────────────────────────────────────────────────────

/**
 * Representa uma movimentação financeira (contas a receber ou a pagar).
 */
export interface Transaction {
  /** Identificador único da transação (ex: "TR-8812"). */
  id: string
  /** Referência ao documento de origem (ex: "ORD-94021", "INV-2201"). */
  ref: string
  /** Nome da entidade cliente ou fornecedor. */
  entityName: string
  /** Tipo de ícone SVG usado no avatar da entidade. */
  entityAvatarType: EntityAvatarType
  /** Data de vencimento no formato ISO 8601 (YYYY-MM-DD). */
  dueDate: string
  /** Método de pagamento utilizado. */
  method: PaymentMethod
  /** Valor da transação em reais. */
  value: number
  /** Status atual do pagamento. */
  status: TransactionStatus
  /** Indica se é uma movimentação a receber ou a pagar. */
  type: TransactionType
}

// ── Mock do gráfico de tendência mensal ──────────────────────────────────────

/**
 * Dados para o gráfico "Tendência Mensal" (realizado vs projetado).
 */
export interface MonthlyTrendData {
  /** Labels do eixo X (ex: ["Jan", "Fev", …]). */
  months: string[]
  /** Valores realizados — linha sólida teal. */
  realizado: number[]
  /** Valores projetados — linha tracejada cinza. */
  projetado: number[]
}

// ── Mock dos meios de pagamento ───────────────────────────────────────────────

/** Tokens de cor aceitos para a barra de progresso. */
export type PaymentMethodColor = 'teal' | 'purple' | 'green'

/**
 * Um item da distribuição de meios de pagamento.
 */
export interface PaymentMethodItem {
  label: string
  percent: number
  color: PaymentMethodColor
}

/**
 * Mini-cards de estatísticas financeiras agregadas.
 */
export interface FinancialStatCard {
  label: string
  value: string
}
