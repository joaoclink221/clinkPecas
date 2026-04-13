// ── Chave do rascunho no localStorage ─────────────────────────────────────────

export const PURCHASE_ORDER_DRAFT_KEY = 'purchase_order_draft'

// ── Tipos do formulário de ordem de compra ────────────────────────────────────

/** Item adicionado à ordem de compra. */
export interface OrderItem {
  /** Código SKU do produto. */
  sku: string
  /** Nome/descrição do produto. */
  name: string
  /** Quantidade solicitada. */
  qty: number
  /** Preço unitário em USD sem formatação. */
  unitCost: number
  /** Data estimada de entrega no formato ISO "YYYY-MM-DD". */
  deliveryPrep: string
}

/** Item disponível no catálogo para adicionar à ordem. */
export interface ComponentCatalogItem {
  sku: string
  name: string
  /** Preço unitário sugerido em USD. */
  unitCost: number
}

/** Estado completo do formulário de nova ordem de compra. */
export interface PurchaseOrderForm {
  /** Nome do fornecedor selecionado ou null se não selecionado. */
  supplier: string | null
  /** Nome do agente/comprador responsável ou null se não selecionado. */
  agent: string | null
  /** Data de emissão no formato ISO "YYYY-MM-DD" ou string vazia. */
  issueDate: string
  /** Data prevista de entrega no formato ISO "YYYY-MM-DD" ou string vazia. */
  expectedDelivery: string
  /** Itens adicionados à ordem. */
  items: OrderItem[]
  /** Custo de logística estimado em USD (fixo em 450). */
  estLogistics: number
}

// ── Utilitários de cálculo ─────────────────────────────────────────────────────

/** Soma qty × unitCost de todos os itens. */
export function computeSubtotal(items: OrderItem[]): number {
  return items.reduce((acc, item) => acc + item.qty * item.unitCost, 0)
}

/** Subtotal + estLogistics. */
export function computeTotal(items: OrderItem[], estLogistics: number): number {
  return computeSubtotal(items) + estLogistics
}

// ── Itens iniciais de visualização (2 itens da referência de design) ───────────

export const INITIAL_ORDER_ITEMS: OrderItem[] = [
  {
    sku: 'BRM-0092-CF',
    name: 'Ceramic Brake Pad Set \u2013 Front',
    qty: 45,
    unitCost: 124,
    deliveryPrep: '2023-11-04',
  },
  {
    sku: 'BRM-rotor-v3',
    name: 'Ventilated Disc Rotor',
    qty: 20,
    unitCost: 312,
    deliveryPrep: '2023-11-08',
  },
]

// ── Estado inicial ─────────────────────────────────────────────────────────────

export const INITIAL_PURCHASE_ORDER_FORM: PurchaseOrderForm = {
  supplier: null,
  agent: null,
  /** Pré-preenchido com a data da referência de design (27 Out 2023). */
  issueDate: '2023-10-27',
  expectedDelivery: '',
  items: INITIAL_ORDER_ITEMS,
  estLogistics: 450,
}

// ── Mocks de fornecedores (strings) ───────────────────────────────────────────

export const suppliersMock: string[] = [
  'Bosch Global Parts',
  'Continental Tyres Br',
  'Magneti Marelli Tech',
  'NGK Spark Plugs',
  'Denso Brasil Ltda',
]

// ── Mocks de funcionários/compradores (strings) ────────────────────────────────

export const employeesMock: string[] = [
  'Carlos Mendes',
  'Fernanda Rocha',
  'Paulo Teixeira',
  'Ana Lima',
  'Ricardo Souza',
]

// ── Catálogo de componentes disponíveis ───────────────────────────────────────

export const componentCatalogMock: ComponentCatalogItem[] = [
  { sku: 'BRM-0092-CF',  name: 'Ceramic Brake Pad Set \u2013 Front', unitCost: 124 },
  { sku: 'BRM-rotor-v3', name: 'Ventilated Disc Rotor',              unitCost: 312 },
  { sku: 'FLT-oil-5w30', name: 'Engine Oil Filter 5W-30',            unitCost: 18  },
  { sku: 'SUS-shock-r1', name: 'Rear Shock Absorber Kit',            unitCost: 245 },
  { sku: 'ENG-belt-002', name: 'Timing Belt Set',                    unitCost: 89  },
  { sku: 'ELE-alt-120a', name: 'Alternator 120A',                    unitCost: 410 },
  { sku: 'FLT-air-k04',  name: 'Air Filter K04 Series',              unitCost: 34  },
]
