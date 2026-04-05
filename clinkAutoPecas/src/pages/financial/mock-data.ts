import type {
  FinancialStatCard,
  MonthlyTrendData,
  PaymentMethodItem,
  Transaction,
} from './financial.types'

// ── 2.2 Transações mock ───────────────────────────────────────────────────────

/**
 * Total simulado de transações no sistema.
 * Usado pelo componente de paginação para exibir "Mostrando X de 128".
 */
export const TOTAL_SIMULATED_TRANSACTIONS = 128

/**
 * Array mock com 16 transações cobrindo os 3 status, 3 métodos e 2 types.
 *
 * Inclui obrigatoriamente os 4 registros visíveis na imagem de referência.
 */
export const transactionsMock: Transaction[] = [
  // ── Registros obrigatórios da imagem ─────────────────────────────────────
  {
    id: 'TR-9401',
    ref: 'ORD-94021',
    entityName: 'Distribuidora Autopeças Sul',
    entityAvatarType: 'building',
    dueDate: '2024-06-24',
    method: 'pix',
    value: 12450.0,
    status: 'pago',
    type: 'receber',
  },
  {
    id: 'TR-8812',
    ref: 'TR-8812',
    entityName: 'Logística TransGlobal S.A.',
    entityAvatarType: 'gear',
    dueDate: '2024-06-28',
    method: 'boleto',
    value: 3120.5,
    status: 'pendente',
    type: 'pagar',
  },
  {
    id: 'TR-9399',
    ref: 'ORD-93998',
    entityName: 'Oficina Mecânica Centro',
    entityAvatarType: 'workshop',
    dueDate: '2024-06-15',
    method: 'cartao',
    value: 890.0,
    status: 'atrasado',
    type: 'receber',
  },
  {
    id: 'TR-2201',
    ref: 'INV-2201',
    entityName: 'Engrenagens Titan Ltda',
    entityAvatarType: 'gear',
    dueDate: '2024-06-21',
    method: 'pix',
    value: 45000.0,
    status: 'pago',
    type: 'receber',
  },

  // ── Contas a receber ──────────────────────────────────────────────────────
  {
    id: 'TR-9512',
    ref: 'ORD-95120',
    entityName: 'Peças & Cia Ltda',
    entityAvatarType: 'building',
    dueDate: '2024-07-03',
    method: 'boleto',
    value: 8750.0,
    status: 'pendente',
    type: 'receber',
  },
  {
    id: 'TR-9344',
    ref: 'INV-3401',
    entityName: 'Rodrigo Almeida ME',
    entityAvatarType: 'person',
    dueDate: '2024-06-10',
    method: 'pix',
    value: 1250.75,
    status: 'atrasado',
    type: 'receber',
  },
  {
    id: 'TR-9601',
    ref: 'ORD-96010',
    entityName: 'AutoTech Distribuidora',
    entityAvatarType: 'building',
    dueDate: '2024-07-10',
    method: 'cartao',
    value: 22300.0,
    status: 'pago',
    type: 'receber',
  },
  {
    id: 'TR-9702',
    ref: 'INV-4102',
    entityName: 'Freios Rápidos S.A.',
    entityAvatarType: 'workshop',
    dueDate: '2024-07-15',
    method: 'boleto',
    value: 5600.0,
    status: 'pendente',
    type: 'receber',
  },
  {
    id: 'TR-9803',
    ref: 'ORD-98031',
    entityName: 'Grupo Motorex',
    entityAvatarType: 'building',
    dueDate: '2024-06-30',
    method: 'pix',
    value: 31800.0,
    status: 'pago',
    type: 'receber',
  },

  // ── Contas a pagar ────────────────────────────────────────────────────────
  {
    id: 'TR-5021',
    ref: 'PUR-5021',
    entityName: 'Bosch Global Parts',
    entityAvatarType: 'gear',
    dueDate: '2024-07-05',
    method: 'boleto',
    value: 18900.0,
    status: 'pendente',
    type: 'pagar',
  },
  {
    id: 'TR-5022',
    ref: 'PUR-5022',
    entityName: 'Continental Pneus',
    entityAvatarType: 'building',
    dueDate: '2024-06-18',
    method: 'pix',
    value: 7400.0,
    status: 'atrasado',
    type: 'pagar',
  },
  {
    id: 'TR-5023',
    ref: 'PUR-5023',
    entityName: 'Mahle Filtros',
    entityAvatarType: 'gear',
    dueDate: '2024-07-20',
    method: 'cartao',
    value: 3250.0,
    status: 'pago',
    type: 'pagar',
  },
  {
    id: 'TR-5024',
    ref: 'PUR-5024',
    entityName: 'Denso Autopeças',
    entityAvatarType: 'building',
    dueDate: '2024-07-25',
    method: 'boleto',
    value: 9800.0,
    status: 'pendente',
    type: 'pagar',
  },
  {
    id: 'TR-5025',
    ref: 'PUR-5025',
    entityName: 'NGK do Brasil',
    entityAvatarType: 'gear',
    dueDate: '2024-07-01',
    method: 'pix',
    value: 2100.0,
    status: 'pago',
    type: 'pagar',
  },
  {
    id: 'TR-5026',
    ref: 'PUR-5026',
    entityName: 'Suspensão Premium Ltda',
    entityAvatarType: 'workshop',
    dueDate: '2024-06-12',
    method: 'cartao',
    value: 14600.0,
    status: 'atrasado',
    type: 'pagar',
  },
  {
    id: 'TR-5027',
    ref: 'PUR-5027',
    entityName: 'Fremax Indústria',
    entityAvatarType: 'gear',
    dueDate: '2024-07-08',
    method: 'boleto',
    value: 6350.0,
    status: 'pendente',
    type: 'pagar',
  },
]

// ── 2.3 Mock do gráfico de tendência mensal ───────────────────────────────────

/**
 * Dados para o gráfico "Tendência Mensal".
 * - `realizado`: faturamento efetivo (linha sólida teal)
 * - `projetado`: meta anual pro-ratada (linha tracejada cinza)
 */
export const trendMock: MonthlyTrendData = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  realizado: [820000, 890000, 950000, 1020000, 1100000, 1240500],
  projetado: [900000, 950000, 1000000, 1050000, 1100000, 1100000],
}

// ── 2.4 Mock dos meios de pagamento ──────────────────────────────────────────

/**
 * Distribuição percentual dos meios de pagamento.
 * Invariante: sum(percent) === 100.
 */
export const paymentMethodsMock: PaymentMethodItem[] = [
  { label: 'PIX INSTANTÂNEO', percent: 45, color: 'teal' },
  { label: 'BOLETO BANCÁRIO', percent: 30, color: 'purple' },
  { label: 'CARTÃO DE CRÉDITO', percent: 25, color: 'green' },
]

/**
 * Mini-cards de estatísticas financeiras agregadas.
 */
export const financialStatsMock: FinancialStatCard[] = [
  { label: 'TAXA DE CONVERSÃO', value: '94.2%' },
  { label: 'TICKET MÉDIO', value: 'R$ 1.4k' },
]
