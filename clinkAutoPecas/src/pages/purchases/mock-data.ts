import type { PurchaseOrder, PurchasesKpiMock } from './purchases.types'

// ── Página de ordens visível na tabela ────────────────────────────────────────
// Representa a primeira página dos 1.248 resultados totais do sistema.
// Os 5 primeiros registros são idênticos à imagem de referência.

export const purchasesMockPage: PurchaseOrder[] = [
  // ── Registros exatos da imagem de referência ─────────────────────────
  {
    id: 'PUR-8821',
    supplier: 'Bosch Global Parts',
    supplierTag: 'PREMIUM VENDOR',
    issueDate: '2023-10-12',
    totalValue: 12450.0,
    status: 'received',
  },
  {
    id: 'PUR-8845',
    supplier: 'Continental Tyres Br',
    supplierTag: 'LOGISTICS PENDING',
    issueDate: '2023-10-14',
    totalValue: 8920.0,
    status: 'pending',
  },
  {
    id: 'PUR-8851',
    supplier: 'Magneti Marelli Tech',
    supplierTag: 'DIRECT IMPORT',
    issueDate: '2023-10-15',
    totalValue: 45100.0,
    status: 'pending',
  },
  {
    id: 'PUR-8799',
    supplier: 'Z-Parts Distribuitor',
    supplierTag: 'CREDIT HOLD',
    issueDate: '2023-10-08',
    totalValue: 2150.0,
    status: 'cancelled',
  },
  {
    id: 'PUR-8855',
    supplier: 'NGK Spark Plugs',
    supplierTag: 'REGIONAL WHOLESALER',
    issueDate: '2023-10-16',
    totalValue: 7420.0,
    status: 'received',
  },
  // ── Registros complementares ──────────────────────────────────────────
  {
    id: 'PUR-8760',
    supplier: 'Denso Brasil Ltda',
    supplierTag: 'PREMIUM VENDOR',
    issueDate: '2023-10-03',
    totalValue: 18750.0,
    status: 'received',
  },
  {
    id: 'PUR-8765',
    supplier: 'TRW Automotive',
    supplierTag: 'DIRECT IMPORT',
    issueDate: '2023-10-04',
    totalValue: 9300.0,
    status: 'pending',
  },
  {
    id: 'PUR-8770',
    supplier: 'SKF Rolamentos',
    supplierTag: 'REGIONAL WHOLESALER',
    issueDate: '2023-10-05',
    totalValue: 14500.0,
    status: 'received',
  },
  {
    id: 'PUR-8775',
    supplier: 'Gates Rubber Co',
    supplierTag: 'LOGISTICS PENDING',
    issueDate: '2023-10-06',
    totalValue: 6100.0,
    status: 'received',
  },
  {
    id: 'PUR-8780',
    supplier: 'Mahle Componentes',
    supplierTag: 'PREMIUM VENDOR',
    issueDate: '2023-10-07',
    totalValue: 22400.0,
    status: 'received',
  },
  {
    id: 'PUR-8785',
    supplier: 'Valeo Sistemas',
    supplierTag: 'DIRECT IMPORT',
    issueDate: '2023-10-09',
    totalValue: 11200.0,
    status: 'pending',
  },
  {
    id: 'PUR-8790',
    supplier: 'Wabco Brasil',
    supplierTag: 'CREDIT HOLD',
    issueDate: '2023-10-10',
    totalValue: 8850.0,
    status: 'cancelled',
  },
  {
    id: 'PUR-8795',
    supplier: 'Federal Mogul',
    supplierTag: 'PREMIUM VENDOR',
    issueDate: '2023-10-11',
    totalValue: 5600.0,
    status: 'received',
  },
  {
    id: 'PUR-8800',
    supplier: 'Delphi Technologies',
    supplierTag: 'LOGISTICS PENDING',
    issueDate: '2023-10-13',
    totalValue: 4800.0,
    status: 'received',
  },
  {
    id: 'PUR-8810',
    supplier: 'Bosch Filtros',
    supplierTag: 'REGIONAL WHOLESALER',
    issueDate: '2023-10-17',
    totalValue: 3190.0,
    status: 'pending',
  },
]

// ── KPIs agregados do sistema (representa 1.248 ordens totais) ────────────────
// Valores hardcoded para fidelidade ao design de referência.
// Em produção, estes viriam de uma endpoint de resumo da API.

export const purchasesKpiMock: PurchasesKpiMock = {
  totalMonthly: 142850,
  pendingOrders: 24,
  receivedLast30d: 118,
  cancelledOrders: 3,
  trendTotalMonthly: 12.5,
  deliveryEfficiency: 94,
  totalInvestment: 1244500,
  avgTicket: 5120,
  avgPaymentDays: 42,
}
