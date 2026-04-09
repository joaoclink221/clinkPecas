// ── Chave do localStorage ─────────────────────────────────────────────────────

/** Chave usada para persistir e restaurar o estado completo do formulário de chamado. */
export const CHAMADO_DRAFT_KEY = 'chamado_draft'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ChamadoReason = 'avaria' | 'incompativel' | 'erro_pedido'

export interface Chamado {
  /** SKU do item vinculado ao chamado; null enquanto não selecionado. */
  skuId: string | null
  /** Data do incidente em formato ISO 8601 (YYYY-MM-DD) ou string vazia. */
  incidentDate: string
  /** Motivo da solicitação; null enquanto não selecionado. */
  reason: ChamadoReason | null
  /** Descrição detalhada do ocorrido ou defeito apresentado. */
  description: string
  /**
   * Arquivos de evidência anexados pelo usuário.
   * Nota: `File` não é serializável em JSON — o array é omitido na persistência
   * do rascunho e reiniciado como vazio ao restaurar.
   */
  attachments: File[]
  status: 'draft' | 'open'
}

// ── Estado inicial ─────────────────────────────────────────────────────────────

export const INITIAL_CLAIM_STATE: Chamado = {
  skuId: null,
  incidentDate: '',
  reason: null,
  description: '',
  attachments: [],
  status: 'draft',
}

// ── Mock de SKUs disponíveis ───────────────────────────────────────────────────

export interface SkuOption {
  sku: string
  name: string
}

/**
 * SKUs disponíveis para seleção no chamado.
 * Inclui peças de venda (OG-*) e referências de pedidos de garantia (ORD-*).
 */
export const availableSkusMock: SkuOption[] = [
  { sku: 'OG-TB-001', name: 'Turbo Compressor T3 Titanium' },
  { sku: 'OG-IJ-992', name: 'Kit Injeção Eletrônica RaceSpec' },
  { sku: 'ORD-98231-X', name: 'Disco de Freio Ventilado' },
  { sku: 'ORD-88122-Y', name: 'Alternador 120A' },
  { sku: 'ORD-99100-A', name: 'Kit Filtros (4un)' },
]
