// ── Domínio ───────────────────────────────────────────────────────────────────

export type ActiveTab = 'clientes' | 'fornecedores'

/** Tipo da entidade no diretório */
export type EntityKind = 'cliente' | 'fornecedor'

/** Filtro de tipo usado nos dropdowns da UI */
export type EntityTypeFilter = 'All Entities' | 'Cliente' | 'Fornecedor'

/** Filtro de status usado nos dropdowns da UI */
export type EntityStatusFilter = 'Active Only' | 'Inactive' | 'All'

/** Filtro de saldo financeiro usado no dropdown BALANCE */
export type BalanceFilter = 'Any' | 'Credit OK' | 'Balance Due' | 'Prepaid'

// ── Ícone de avatar ────────────────────────────────────────────────────────────

/**
 * Identificador do ícone SVG exibido no avatar da entidade.
 * - enterprise : prédio/empresa (grandes corporações)
 * - person     : pessoa física / B2C
 * - truck      : transportadora / fleet service
 * - tools      : oficina / partner garage
 */
export type AvatarIcon = 'enterprise' | 'person' | 'truck' | 'tools'

// ── Status financeiro ──────────────────────────────────────────────────────────

/**
 * Estado financeiro da entidade — 4 variantes visíveis na tabela:
 * - ok         : limite definido, saldo zerado (Outstanding: R$ 0,00)
 * - due        : saldo devedor (barra de progresso coral)
 * - credit_ok  : crédito aprovado e disponível
 * - prepaid    : apenas pré-pago, sem limite de crédito ativo
 */
export type FinancialStatus = 'ok' | 'due' | 'credit_ok' | 'prepaid'

/** Status operacional da entidade no sistema */
export type EntityStatus = 'active' | 'inactive'

// ── Interface principal ────────────────────────────────────────────────────────

export interface Entity {
  /** Identificador único */
  id: string
  /** Tipo da entidade: cliente ou fornecedor */
  entityKind: EntityKind
  /** Razão social / nome completo */
  name: string
  /** Subtítulo descritivo (ex: "Large Fleet Enterprise", "Individual / B2C") */
  subtitle: string
  /** Ícone de avatar exibido na tabela */
  avatarIcon: AvatarIcon
  /** CNPJ (xx.xxx.xxx/xxxx-xx) ou CPF (xxx.xxx.xxx-xx) já formatado */
  taxId: string
  /** E-mail do contato principal */
  email: string
  /** Telefone formatado (+55 xx xxxxx-xxxx) */
  phone: string
  /**
   * Limite de crédito em reais.
   * null quando a entidade é pré-paga (sem limite ativo).
   */
  creditLimit: number | null
  /**
   * Saldo devedor atual em reais.
   * 0 quando não há pendências.
   */
  outstandingBalance: number
  /** Estado financeiro — determina badge/barra exibida na tabela */
  financialStatus: FinancialStatus
  /** Status operacional da entidade */
  status: EntityStatus
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────

export interface KpiCardData {
  /** Rótulo superior em uppercase */
  label: string
  /** Valor principal formatado */
  value: string
  /** Sub-label descritivo abaixo do valor */
  subLabel: string
  /** Classe da borda esquerda (accent colorido) */
  accentClass: string
  /** Cor de fundo suave da borda (para aria/identificação) */
  accentColor: 'primary' | 'secondary' | 'tertiary' | 'blue'
}
