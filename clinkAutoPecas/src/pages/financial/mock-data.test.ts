import { describe, expect, it } from 'vitest'

import {
  TOTAL_SIMULATED_TRANSACTIONS,
  financialStatsMock,
  paymentMethodsMock,
  transactionsMock,
  trendMock,
} from './mock-data'

// ── 2.2 transactionsMock — estrutura e integridade ────────────────────────────

describe('transactionsMock — estrutura', () => {
  it('contém 16 ou mais transações', () => {
    expect(transactionsMock.length).toBeGreaterThanOrEqual(16)
  })

  it('TOTAL_SIMULATED_TRANSACTIONS é 128', () => {
    expect(TOTAL_SIMULATED_TRANSACTIONS).toBe(128)
  })

  it('cada transação tem os campos obrigatórios', () => {
    for (const t of transactionsMock) {
      expect(t.id).toBeTruthy()
      expect(t.ref).toBeTruthy()
      expect(t.entityName).toBeTruthy()
      expect(t.entityAvatarType).toBeTruthy()
      expect(t.dueDate).toBeTruthy()
      expect(t.method).toBeTruthy()
      expect(typeof t.value).toBe('number')
      expect(t.status).toBeTruthy()
      expect(t.type).toBeTruthy()
    }
  })

  it('todos os ids são únicos', () => {
    const ids = transactionsMock.map((t) => t.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(transactionsMock.length)
  })

  it('todos os valores são positivos', () => {
    for (const t of transactionsMock) {
      expect(t.value).toBeGreaterThan(0)
    }
  })

  it('todas as datas estão no formato YYYY-MM-DD', () => {
    for (const t of transactionsMock) {
      expect(t.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

describe('transactionsMock — cobertura de valores', () => {
  it('cobre os 3 status obrigatórios: pago, pendente, atrasado', () => {
    const statuses = new Set(transactionsMock.map((t) => t.status))

    expect(statuses.has('pago')).toBe(true)
    expect(statuses.has('pendente')).toBe(true)
    expect(statuses.has('atrasado')).toBe(true)
  })

  it('cobre os 3 métodos de pagamento: pix, boleto, cartao', () => {
    const methods = new Set(transactionsMock.map((t) => t.method))

    expect(methods.has('pix')).toBe(true)
    expect(methods.has('boleto')).toBe(true)
    expect(methods.has('cartao')).toBe(true)
  })

  it('cobre os 2 types: receber e pagar', () => {
    const types = new Set(transactionsMock.map((t) => t.type))

    expect(types.has('receber')).toBe(true)
    expect(types.has('pagar')).toBe(true)
  })

  it('cobre os 4 avatarTypes: person, building, workshop, gear', () => {
    const avatarTypes = new Set(transactionsMock.map((t) => t.entityAvatarType))

    expect(avatarTypes.has('person')).toBe(true)
    expect(avatarTypes.has('building')).toBe(true)
    expect(avatarTypes.has('workshop')).toBe(true)
    expect(avatarTypes.has('gear')).toBe(true)
  })
})

describe('transactionsMock — registros obrigatórios da imagem', () => {
  it('contém Distribuidora Autopeças Sul (REF: ORD-94021, Pix, R$ 12.450, Pago)', () => {
    const t = transactionsMock.find((t) => t.ref === 'ORD-94021')

    expect(t).toBeDefined()
    expect(t?.entityName).toBe('Distribuidora Autopeças Sul')
    expect(t?.method).toBe('pix')
    expect(t?.value).toBe(12450.0)
    expect(t?.status).toBe('pago')
  })

  it('contém Logística TransGlobal S.A. (REF: TR-8812, Boleto, R$ 3.120,50, Pendente)', () => {
    const t = transactionsMock.find((t) => t.ref === 'TR-8812')

    expect(t).toBeDefined()
    expect(t?.entityName).toBe('Logística TransGlobal S.A.')
    expect(t?.method).toBe('boleto')
    expect(t?.value).toBe(3120.5)
    expect(t?.status).toBe('pendente')
  })

  it('contém Oficina Mecânica Centro (REF: ORD-93998, Cartão, R$ 890, Atrasado)', () => {
    const t = transactionsMock.find((t) => t.ref === 'ORD-93998')

    expect(t).toBeDefined()
    expect(t?.entityName).toBe('Oficina Mecânica Centro')
    expect(t?.method).toBe('cartao')
    expect(t?.value).toBe(890.0)
    expect(t?.status).toBe('atrasado')
  })

  it('contém Engrenagens Titan Ltda (REF: INV-2201, Pix, R$ 45.000, Pago)', () => {
    const t = transactionsMock.find((t) => t.ref === 'INV-2201')

    expect(t).toBeDefined()
    expect(t?.entityName).toBe('Engrenagens Titan Ltda')
    expect(t?.method).toBe('pix')
    expect(t?.value).toBe(45000.0)
    expect(t?.status).toBe('pago')
  })
})

// ── 2.3 trendMock — integridade ───────────────────────────────────────────────

describe('trendMock — estrutura', () => {
  it('months contém exatamente 6 labels (Jan–Jun)', () => {
    expect(trendMock.months).toHaveLength(6)
    expect(trendMock.months).toEqual(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'])
  })

  it('realizado contém exatamente 6 valores numéricos', () => {
    expect(trendMock.realizado).toHaveLength(6)
    for (const v of trendMock.realizado) {
      expect(typeof v).toBe('number')
      expect(v).toBeGreaterThan(0)
    }
  })

  it('projetado contém exatamente 6 valores numéricos', () => {
    expect(trendMock.projetado).toHaveLength(6)
    for (const v of trendMock.projetado) {
      expect(typeof v).toBe('number')
      expect(v).toBeGreaterThan(0)
    }
  })

  it('months, realizado e projetado têm o mesmo comprimento', () => {
    expect(trendMock.months.length).toBe(trendMock.realizado.length)
    expect(trendMock.months.length).toBe(trendMock.projetado.length)
  })

  it('valores realizados são crescentes (simulam crescimento)', () => {
    for (let i = 1; i < trendMock.realizado.length; i++) {
      expect(trendMock.realizado[i]).toBeGreaterThan(trendMock.realizado[i - 1])
    }
  })
})

// ── 2.4 paymentMethodsMock — integridade ─────────────────────────────────────

describe('paymentMethodsMock — estrutura', () => {
  it('contém exatamente 3 métodos de pagamento', () => {
    expect(paymentMethodsMock).toHaveLength(3)
  })

  it('percentuais somam exatamente 100', () => {
    const total = paymentMethodsMock.reduce((acc, m) => acc + m.percent, 0)
    expect(total).toBe(100)
  })

  it('contém PIX INSTANTÂNEO com 45%', () => {
    const pix = paymentMethodsMock.find((m) => m.label === 'PIX INSTANTÂNEO')

    expect(pix).toBeDefined()
    expect(pix?.percent).toBe(45)
    expect(pix?.color).toBe('teal')
  })

  it('contém BOLETO BANCÁRIO com 30%', () => {
    const boleto = paymentMethodsMock.find((m) => m.label === 'BOLETO BANCÁRIO')

    expect(boleto).toBeDefined()
    expect(boleto?.percent).toBe(30)
    expect(boleto?.color).toBe('purple')
  })

  it('contém CARTÃO DE CRÉDITO com 25%', () => {
    const cartao = paymentMethodsMock.find((m) => m.label === 'CARTÃO DE CRÉDITO')

    expect(cartao).toBeDefined()
    expect(cartao?.percent).toBe(25)
    expect(cartao?.color).toBe('green')
  })

  it('todos os percentuais são positivos', () => {
    for (const m of paymentMethodsMock) {
      expect(m.percent).toBeGreaterThan(0)
    }
  })
})

// ── 2.4 financialStatsMock — integridade ─────────────────────────────────────

describe('financialStatsMock — estrutura', () => {
  it('contém exatamente 2 mini-cards', () => {
    expect(financialStatsMock).toHaveLength(2)
  })

  it('contém Taxa de Conversão com valor 94.2%', () => {
    const taxa = financialStatsMock.find((s) => s.label === 'TAXA DE CONVERSÃO')

    expect(taxa).toBeDefined()
    expect(taxa?.value).toBe('94.2%')
  })

  it('contém Ticket Médio com valor R$ 1.4k', () => {
    const ticket = financialStatsMock.find((s) => s.label === 'TICKET MÉDIO')

    expect(ticket).toBeDefined()
    expect(ticket?.value).toBe('R$ 1.4k')
  })

  it('todos os campos label e value são strings não-vazias', () => {
    for (const s of financialStatsMock) {
      expect(s.label).toBeTruthy()
      expect(s.value).toBeTruthy()
    }
  })
})
