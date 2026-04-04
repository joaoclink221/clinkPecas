import { describe, expect, it } from 'vitest'

import type { AvatarIcon, EntityKind, EntityStatus, FinancialStatus } from './clients.types'
import { entitiesMock } from './mock-data'

// ── Estrutura do array ────────────────────────────────────────────────────────

describe('entitiesMock — estrutura do array', () => {
  it('contém pelo menos 15 entidades', () => {
    expect(entitiesMock.length).toBeGreaterThanOrEqual(15)
  })

  it('todos os registros têm id único', () => {
    const ids = entitiesMock.map((e) => e.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(entitiesMock.length)
  })

  it('todos os registros têm campos obrigatórios preenchidos', () => {
    for (const entity of entitiesMock) {
      expect(entity.id).toBeTruthy()
      expect(entity.name).toBeTruthy()
      expect(entity.subtitle).toBeTruthy()
      expect(entity.taxId).toBeTruthy()
      expect(entity.email).toBeTruthy()
      expect(entity.phone).toBeTruthy()
    }
  })
})

// ── Cobertura de entityKind ───────────────────────────────────────────────────

describe('entitiesMock — cobertura de entityKind', () => {
  const VALID_KINDS: EntityKind[] = ['cliente', 'fornecedor']

  it('contém ao menos um "cliente"', () => {
    expect(entitiesMock.some((e) => e.entityKind === 'cliente')).toBe(true)
  })

  it('contém ao menos um "fornecedor"', () => {
    expect(entitiesMock.some((e) => e.entityKind === 'fornecedor')).toBe(true)
  })

  it('todos os entityKind são valores válidos', () => {
    for (const entity of entitiesMock) {
      expect(VALID_KINDS).toContain(entity.entityKind)
    }
  })
})

// ── Cobertura de financialStatus ──────────────────────────────────────────────

describe('entitiesMock — cobertura de financialStatus', () => {
  const VALID_STATUSES: FinancialStatus[] = ['ok', 'due', 'credit_ok', 'prepaid']

  it('cobre o estado "ok" (saldo zerado com limite)', () => {
    expect(entitiesMock.some((e) => e.financialStatus === 'ok')).toBe(true)
  })

  it('cobre o estado "due" (saldo devedor)', () => {
    expect(entitiesMock.some((e) => e.financialStatus === 'due')).toBe(true)
  })

  it('cobre o estado "credit_ok" (crédito aprovado)', () => {
    expect(entitiesMock.some((e) => e.financialStatus === 'credit_ok')).toBe(true)
  })

  it('cobre o estado "prepaid" (pré-pago, sem limite)', () => {
    expect(entitiesMock.some((e) => e.financialStatus === 'prepaid')).toBe(true)
  })

  it('todos os financialStatus são valores válidos', () => {
    for (const entity of entitiesMock) {
      expect(VALID_STATUSES).toContain(entity.financialStatus)
    }
  })
})

// ── Cobertura de entityStatus ─────────────────────────────────────────────────

describe('entitiesMock — cobertura de entityStatus', () => {
  const VALID_STATUSES: EntityStatus[] = ['active', 'inactive']

  it('contém ao menos uma entidade "active"', () => {
    expect(entitiesMock.some((e) => e.status === 'active')).toBe(true)
  })

  it('contém ao menos uma entidade "inactive"', () => {
    expect(entitiesMock.some((e) => e.status === 'inactive')).toBe(true)
  })

  it('todos os status são valores válidos', () => {
    for (const entity of entitiesMock) {
      expect(VALID_STATUSES).toContain(entity.status)
    }
  })
})

// ── Cobertura de avatarIcon ───────────────────────────────────────────────────

describe('entitiesMock — cobertura de avatarIcon', () => {
  const VALID_ICONS: AvatarIcon[] = ['enterprise', 'person', 'truck', 'tools']

  it('cobre o ícone "enterprise"', () => {
    expect(entitiesMock.some((e) => e.avatarIcon === 'enterprise')).toBe(true)
  })

  it('cobre o ícone "person"', () => {
    expect(entitiesMock.some((e) => e.avatarIcon === 'person')).toBe(true)
  })

  it('cobre o ícone "truck"', () => {
    expect(entitiesMock.some((e) => e.avatarIcon === 'truck')).toBe(true)
  })

  it('cobre o ícone "tools"', () => {
    expect(entitiesMock.some((e) => e.avatarIcon === 'tools')).toBe(true)
  })

  it('todos os avatarIcon são valores válidos', () => {
    for (const entity of entitiesMock) {
      expect(VALID_ICONS).toContain(entity.avatarIcon)
    }
  })
})

// ── Regras de negócio ─────────────────────────────────────────────────────────

describe('entitiesMock — regras de negócio', () => {
  it('entidades "prepaid" têm creditLimit null', () => {
    const prepaid = entitiesMock.filter((e) => e.financialStatus === 'prepaid')

    for (const entity of prepaid) {
      expect(entity.creditLimit).toBeNull()
    }
  })

  it('entidades "ok" têm outstandingBalance igual a 0', () => {
    const ok = entitiesMock.filter((e) => e.financialStatus === 'ok')

    for (const entity of ok) {
      expect(entity.outstandingBalance).toBe(0)
    }
  })

  it('entidades "due" têm outstandingBalance maior que 0', () => {
    const due = entitiesMock.filter((e) => e.financialStatus === 'due')

    for (const entity of due) {
      expect(entity.outstandingBalance).toBeGreaterThan(0)
    }
  })

  it('outstandingBalance nunca é negativo', () => {
    for (const entity of entitiesMock) {
      expect(entity.outstandingBalance).toBeGreaterThanOrEqual(0)
    }
  })

  it('creditLimit, quando definido, é maior que 0', () => {
    const withLimit = entitiesMock.filter((e) => e.creditLimit !== null)

    for (const entity of withLimit) {
      expect(entity.creditLimit).toBeGreaterThan(0)
    }
  })
})

// ── Os 4 registros exatos da referência visual ────────────────────────────────

describe('entitiesMock — registros obrigatórios da referência visual', () => {
  it('contém "Turbo Dynamics Inc." com CNPJ e financialStatus "ok"', () => {
    const entity = entitiesMock.find((e) => e.name === 'Turbo Dynamics Inc.')

    expect(entity).toBeDefined()
    expect(entity?.taxId).toBe('12.345.678/0001-90')
    expect(entity?.creditLimit).toBe(42500)
    expect(entity?.outstandingBalance).toBe(0)
    expect(entity?.financialStatus).toBe('ok')
  })

  it('contém "Juliana Mendes" com CPF e financialStatus "due"', () => {
    const entity = entitiesMock.find((e) => e.name === 'Juliana Mendes')

    expect(entity).toBeDefined()
    expect(entity?.taxId).toBe('458.122.903-22')
    expect(entity?.financialStatus).toBe('due')
    expect(entity?.outstandingBalance).toBeGreaterThan(0)
  })

  it('contém "Global Logistics Hub" com CNPJ e financialStatus "credit_ok"', () => {
    const entity = entitiesMock.find((e) => e.name === 'Global Logistics Hub')

    expect(entity).toBeDefined()
    expect(entity?.taxId).toBe('33.918.452/0001-08')
    expect(entity?.creditLimit).toBe(150000)
    expect(entity?.financialStatus).toBe('credit_ok')
  })

  it('contém "Auto Fix Workshop" com CNPJ e financialStatus "prepaid"', () => {
    const entity = entitiesMock.find((e) => e.name === 'Auto Fix Workshop')

    expect(entity).toBeDefined()
    expect(entity?.taxId).toBe('08.221.445/0001-22')
    expect(entity?.creditLimit).toBeNull()
    expect(entity?.financialStatus).toBe('prepaid')
  })

  it('os 4 registros obrigatórios têm status "active"', () => {
    const required = ['Turbo Dynamics Inc.', 'Juliana Mendes', 'Global Logistics Hub', 'Auto Fix Workshop']

    for (const name of required) {
      const entity = entitiesMock.find((e) => e.name === name)
      expect(entity?.status).toBe('active')
    }
  })
})
