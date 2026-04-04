import type { StockItem, StockKpiMock } from './inventory.types'

/**
 * Página de itens de estoque usada na tabela (15 itens representativos).
 * Inclui os 4 itens exatos da referência visual e cobre todas as categorias.
 * Ao menos 3 itens estão em estado crítico (stockQty < stockThreshold).
 */
export const stockMockPage: StockItem[] = [
  // ── Os 4 itens exatos da referência visual ────────────────────────────────
  {
    skuId: 'OB-4492-XT',
    name: 'Velas de Ignição Iridium',
    subtitle: 'NGK Premium Series',
    category: 'Motores',
    stockQty: 850,
    stockMax: 1000,
    stockThreshold: 50,
    supplier: 'Global Auto Parts',
    unitPrice: 42.9,
  },
  {
    skuId: 'OB-9921-ZR',
    name: 'Amortecedor Dianteiro',
    subtitle: 'Monroe Heavy Duty',
    category: 'Suspensão',
    stockQty: 12,        // CRÍTICO — abaixo de stockThreshold (20)
    stockMax: 200,
    stockThreshold: 20,
    supplier: 'Monroe Brasil S.A',
    unitPrice: 580.0,
  },
  {
    skuId: 'OB-1022-NK',
    name: 'Filtro de Óleo Sintético',
    subtitle: 'Bosch Genuine Parts',
    category: 'Filtros',
    stockQty: 214,
    stockMax: 500,
    stockThreshold: 30,
    supplier: 'Bosch Automotive',
    unitPrice: 28.5,
  },
  {
    skuId: 'OB-5561-LK',
    name: 'Pastilha de Freio Cerâmica',
    subtitle: 'Brembo Sport',
    category: 'Freios',
    stockQty: 142,
    stockMax: 200,
    stockThreshold: 25,
    supplier: 'Distribuidora Continental',
    unitPrice: 215.9,
  },

  // ── Motores ───────────────────────────────────────────────────────────────
  {
    skuId: 'OB-2211-AB',
    name: 'Correia Dentada',
    subtitle: 'Gates PowerGrip',
    category: 'Motores',
    stockQty: 7,         // CRÍTICO — abaixo de stockThreshold (15)
    stockMax: 100,
    stockThreshold: 15,
    supplier: 'Gates Brasil',
    unitPrice: 135.0,
  },
  {
    skuId: 'OB-9901-MN',
    name: "Bomba d'Água",
    subtitle: 'Continental OEM',
    category: 'Motores',
    stockQty: 33,
    stockMax: 150,
    stockThreshold: 15,
    supplier: 'Continental Auto',
    unitPrice: 287.5,
  },

  // ── Suspensão ─────────────────────────────────────────────────────────────
  {
    skuId: 'OB-8812-GH',
    name: 'Rolamento de Roda Dianteiro',
    subtitle: 'SKF Explorer',
    category: 'Suspensão',
    stockQty: 88,
    stockMax: 300,
    stockThreshold: 30,
    supplier: 'SKF do Brasil',
    unitPrice: 198.0,
  },
  {
    skuId: 'OB-3388-QR',
    name: 'Cubo de Roda Traseiro',
    subtitle: 'Cofap Original',
    category: 'Suspensão',
    stockQty: 51,
    stockMax: 200,
    stockThreshold: 20,
    supplier: 'Cofap Distribuidora',
    unitPrice: 342.0,
  },

  // ── Filtros ───────────────────────────────────────────────────────────────
  {
    skuId: 'OB-4455-IJ',
    name: 'Filtro de Ar Esportivo',
    subtitle: 'K&N High-Flow',
    category: 'Filtros',
    stockQty: 156,
    stockMax: 400,
    stockThreshold: 25,
    supplier: 'K&N Filters',
    unitPrice: 189.9,
  },
  {
    skuId: 'OB-7766-ST',
    name: 'Filtro de Combustível',
    subtitle: 'Mahle Original',
    category: 'Filtros',
    stockQty: 89,
    stockMax: 350,
    stockThreshold: 25,
    supplier: 'Mahle Componentes',
    unitPrice: 47.2,
  },

  // ── Freios ────────────────────────────────────────────────────────────────
  {
    skuId: 'OB-6634-KL',
    name: 'Disco de Freio Ventilado',
    subtitle: 'Fremax Xtreme Stop',
    category: 'Freios',
    stockQty: 64,
    stockMax: 250,
    stockThreshold: 20,
    supplier: 'Fremax Indústria',
    unitPrice: 312.0,
  },
  {
    skuId: 'OB-5544-UV',
    name: 'Lona de Freio a Tambor',
    subtitle: 'Fras-le Premium',
    category: 'Freios',
    stockQty: 198,
    stockMax: 400,
    stockThreshold: 30,
    supplier: 'Fras-le S.A',
    unitPrice: 68.4,
  },

  // ── Elétrica ──────────────────────────────────────────────────────────────
  {
    skuId: 'OB-3347-CD',
    name: 'Bobina de Ignição',
    subtitle: 'Bosch 0221504800',
    category: 'Elétrica',
    stockQty: 45,
    stockMax: 200,
    stockThreshold: 20,
    supplier: 'Bosch Automotive',
    unitPrice: 224.0,
  },
  {
    skuId: 'OB-7723-EF',
    name: 'Sensor de Oxigênio',
    subtitle: 'Delphi OE Grade',
    category: 'Elétrica',
    stockQty: 3,         // CRÍTICO — abaixo de stockThreshold (10)
    stockMax: 150,
    stockThreshold: 10,
    supplier: 'Delphi Technologies',
    unitPrice: 415.0,
  },
  {
    skuId: 'OB-1155-OP',
    name: 'Cabo de Vela de Ignição',
    subtitle: 'NGK RC-FX69',
    category: 'Elétrica',
    stockQty: 112,
    stockMax: 300,
    stockThreshold: 30,
    supplier: 'Global Auto Parts',
    unitPrice: 88.5,
  },

  // ── Outros ────────────────────────────────────────────────────────────────
  {
    skuId: 'OB-2299-WX',
    name: 'Terminal de Bateria Universal',
    subtitle: 'Bosch Silver Plus',
    category: 'Outros',
    stockQty: 245,
    stockMax: 500,
    stockThreshold: 40,
    supplier: 'Distribuidora Continental',
    unitPrice: 24.9,
  },
]

/**
 * Resumo KPI representando a base completa do sistema (14.282 SKUs).
 * Os valores de totalSkus e criticalAlerts não são deriváveis de stockMockPage
 * (que é apenas uma página da tabela); em produção virão de /api/stock/summary.
 */
export const stockKpiMock: StockKpiMock = {
  totalSkus: 14_282,
  criticalAlerts: 48,
  inventoryValue: 2_840_150,
  trendTotalSkus: 2.4,
}
