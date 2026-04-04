import { describe, expect, it } from 'vitest'

import { purchasesMockPage, purchasesKpiMock } from './mock-data'

describe('purchasesMockPage — estrutura e integridade', () => {
  it('contém pelo menos 15 ordens', () => {
    expect(purchasesMockPage.length).toBeGreaterThanOrEqual(15)
  })

  it('todos os registros têm id no formato PUR-XXXX', () => {
    for (const order of purchasesMockPage) {
      expect(order.id).toMatch(/^PUR-\d+$/)
    }
  })

  it('todos os ids são únicos', () => {
    const ids = purchasesMockPage.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todos os registros têm supplier não-vazio', () => {
    for (const order of purchasesMockPage) {
      expect(order.supplier.trim().length).toBeGreaterThan(0)
    }
  })

  it('todos os totalValue são positivos', () => {
    for (const order of purchasesMockPage) {
      expect(order.totalValue).toBeGreaterThan(0)
    }
  })

  it('todos os issueDate estão no formato YYYY-MM-DD', () => {
    for (const order of purchasesMockPage) {
      expect(order.issueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('todos os status são valores válidos do enum', () => {
    const validStatuses = new Set(['received', 'pending', 'cancelled'])
    for (const order of purchasesMockPage) {
      expect(validStatuses.has(order.status)).toBe(true)
    }
  })

  it('cobre os 3 status distintos (received, pending, cancelled)', () => {
    const statuses = new Set(purchasesMockPage.map((o) => o.status))
    expect(statuses.has('received')).toBe(true)
    expect(statuses.has('pending')).toBe(true)
    expect(statuses.has('cancelled')).toBe(true)
  })

  it('cobre pelo menos 5 fornecedores distintos', () => {
    const suppliers = new Set(purchasesMockPage.map((o) => o.supplier))
    expect(suppliers.size).toBeGreaterThanOrEqual(5)
  })

  it('cobre todas as supplierTags possíveis', () => {
    const tags = new Set(purchasesMockPage.map((o) => o.supplierTag))
    expect(tags.has('PREMIUM VENDOR')).toBe(true)
    expect(tags.has('LOGISTICS PENDING')).toBe(true)
    expect(tags.has('DIRECT IMPORT')).toBe(true)
    expect(tags.has('CREDIT HOLD')).toBe(true)
    expect(tags.has('REGIONAL WHOLESALER')).toBe(true)
  })
})

describe('purchasesMockPage — registros exatos da imagem de referência', () => {
  it('PUR-8821 existe com dados corretos', () => {
    const order = purchasesMockPage.find((o) => o.id === 'PUR-8821')
    expect(order).toBeDefined()
    expect(order?.supplier).toBe('Bosch Global Parts')
    expect(order?.supplierTag).toBe('PREMIUM VENDOR')
    expect(order?.issueDate).toBe('2023-10-12')
    expect(order?.totalValue).toBe(12450)
    expect(order?.status).toBe('received')
  })

  it('PUR-8845 existe com dados corretos', () => {
    const order = purchasesMockPage.find((o) => o.id === 'PUR-8845')
    expect(order).toBeDefined()
    expect(order?.supplier).toBe('Continental Tyres Br')
    expect(order?.supplierTag).toBe('LOGISTICS PENDING')
    expect(order?.issueDate).toBe('2023-10-14')
    expect(order?.totalValue).toBe(8920)
    expect(order?.status).toBe('pending')
  })

  it('PUR-8851 existe com dados corretos', () => {
    const order = purchasesMockPage.find((o) => o.id === 'PUR-8851')
    expect(order).toBeDefined()
    expect(order?.supplier).toBe('Magneti Marelli Tech')
    expect(order?.supplierTag).toBe('DIRECT IMPORT')
    expect(order?.issueDate).toBe('2023-10-15')
    expect(order?.totalValue).toBe(45100)
    expect(order?.status).toBe('pending')
  })

  it('PUR-8799 existe com dados corretos', () => {
    const order = purchasesMockPage.find((o) => o.id === 'PUR-8799')
    expect(order).toBeDefined()
    expect(order?.supplier).toBe('Z-Parts Distribuitor')
    expect(order?.supplierTag).toBe('CREDIT HOLD')
    expect(order?.issueDate).toBe('2023-10-08')
    expect(order?.totalValue).toBe(2150)
    expect(order?.status).toBe('cancelled')
  })

  it('PUR-8855 existe com dados corretos', () => {
    const order = purchasesMockPage.find((o) => o.id === 'PUR-8855')
    expect(order).toBeDefined()
    expect(order?.supplier).toBe('NGK Spark Plugs')
    expect(order?.supplierTag).toBe('REGIONAL WHOLESALER')
    expect(order?.issueDate).toBe('2023-10-16')
    expect(order?.totalValue).toBe(7420)
    expect(order?.status).toBe('received')
  })
})

describe('purchasesKpiMock — valores exatos da imagem de referência', () => {
  it('totalMonthly é 142850', () => {
    expect(purchasesKpiMock.totalMonthly).toBe(142850)
  })

  it('pendingOrders é 24', () => {
    expect(purchasesKpiMock.pendingOrders).toBe(24)
  })

  it('receivedLast30d é 118', () => {
    expect(purchasesKpiMock.receivedLast30d).toBe(118)
  })

  it('cancelledOrders é 3', () => {
    expect(purchasesKpiMock.cancelledOrders).toBe(3)
  })

  it('totalInvestment é 1244500', () => {
    expect(purchasesKpiMock.totalInvestment).toBe(1244500)
  })

  it('avgTicket é 5120', () => {
    expect(purchasesKpiMock.avgTicket).toBe(5120)
  })

  it('avgPaymentDays é 42', () => {
    expect(purchasesKpiMock.avgPaymentDays).toBe(42)
  })

  it('trendTotalMonthly é 12.5', () => {
    expect(purchasesKpiMock.trendTotalMonthly).toBe(12.5)
  })

  it('deliveryEfficiency é 94', () => {
    expect(purchasesKpiMock.deliveryEfficiency).toBe(94)
  })
})
