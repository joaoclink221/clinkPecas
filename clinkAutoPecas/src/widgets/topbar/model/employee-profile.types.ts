// ── 2.1 Interface do Perfil do Funcionário ────────────────────────────────────

export const DEPARTMENTS = [
  'Logística',
  'Vendas',
  'Estoque',
  'Financeiro',
  'RH',
  'Compras',
] as const

export type Department = (typeof DEPARTMENTS)[number]

export interface UserPreferences {
  /** Modo de alto contraste para melhor visibilidade de dados críticos. */
  highContrast: boolean
  /** Alertas em tempo real para mudanças críticas de estoque. */
  pushNotifications: boolean
}

export interface UserProfile {
  fullName: string
  email: string
  department: Department
  /** Cargo do funcionário — somente leitura, não editável pelo usuário. */
  role: string
  /** URL do avatar ou null quando não há imagem cadastrada. */
  avatarUrl: string | null
  preferences: UserPreferences
}
