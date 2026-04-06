// ── 2.1 Devolução ─────────────────────────────────────────────────────────────

/** Ícone de avatar do item devolvido */
export type AvatarIcon = 'brake' | 'alternator' | 'filter' | 'gear'

/** Status do processo de devolução — cobre os 3 badges da tabela */
export type ReturnStatus = 'analysing' | 'approved' | 'refunded'

export interface Return {
  /** Identificador único da devolução */
  id: string
  /** Nome do item devolvido */
  itemName: string
  /** Referência do pedido de origem (ex: "ORD-98231-X") */
  skuRef: string
  /** Tipo de ícone de avatar do item */
  avatarIcon: AvatarIcon
  /** Motivo da devolução (ex: "Avaria no Transporte") */
  reason: string
  /** Data do registro no formato ISO 8601 (YYYY-MM-DD) */
  date: string
  /** Estado atual do processo de devolução */
  status: ReturnStatus
}

// ── 2.2 Protocolo de Garantia ─────────────────────────────────────────────────

/** Status do protocolo de garantia */
export type WarrantyProtocolStatus = 'in_progress' | 'completed'

export interface WarrantyProtocol {
  /** Identificador do protocolo (ex: "GAR-2290") */
  protocolId: string
  /** Nome do item ou componente coberto pela garantia */
  itemName: string
  /** Texto de diagnóstico técnico */
  description: string
  /** Data de abertura do protocolo em ISO 8601 (YYYY-MM-DD) */
  openDate: string
  /** Data de expiração da cobertura em ISO 8601 (YYYY-MM-DD) */
  expirationDate: string
  /** Pedido vinculado (ex: "ORD-772") */
  linkedOrder: string
  /** Estado atual do protocolo */
  status: WarrantyProtocolStatus
}
