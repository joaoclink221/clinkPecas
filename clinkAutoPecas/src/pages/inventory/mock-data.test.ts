import { describe, expect, it } from 'vitest'

import { stockKpiMock, stockMockPage } from './mock-data'
import type { Category } from './inventory.types'

describe('stockMockPage — estrutura e integridade', () => {
  it('contém ao menos 15 itens', () => {
    expect(stockMockPage.length).toBeGreaterThanOrEqual(15)
  })

  it('todos os itens possuem skuId não-vazio', () => {
    stockMockPage.forEach((item) => {
      expect(item.skuId.trim()).not.toBe('')
    })
  })

  it('skuIds são únicos', () => {
    const ids = stockMockPage.map((i) => i.skuId)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('todos os itens têm unitPrice > 0', () => {
    stockMockPage.forEach((item) => {
      expect(item.unitPrice).toBeGreaterThan(0)
    })
  })

  it('todos os itens têm stockMax >= stockThreshold', () => {
    stockMockPage.forEach((item) => {
      expect(item.stockMax).toBeGreaterThanOrEqual(item.stockThreshold)
    })
  })

  it('todos os itens têm stockQty >= 0', () => {
    stockMockPage.forEach((item) => {
      expect(item.stockQty).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('stockMockPage — os 4 itens exatos da referência visual', () => {
  it('contém OB-4492-XT (Velas de Ignição Iridium)', () => {
    const item = stockMockPage.find((i) => i.skuId === 'OB-4492-XT')
    expect(item).toBeDefined()
    expect(item?.name).toBe('Velas de Ignição Iridium')
    expect(item?.supplier).toBe('Global Auto Parts')
    expect(item?.unitPrice).toBe(42.9)
  })

  it('contém OB-9921-ZR (Amortecedor Dianteiro) em estado crítico', () => {
    const item = stockMockPage.find((i) => i.skuId === 'OB-9921-ZR')
    expect(item).toBeDefined()
    expect(item?.name).toBe('Amortecedor Dianteiro')
    expect(item?.stockQty).toBeLessThan(item!.stockThreshold)
  })

  it('contém OB-1022-NK (Filtro de Óleo Sintético)', () => {
    const item = stockMockPage.find((i) => i.skuId === 'OB-1022-NK')
    expect(item).toBeDefined()
    expect(item?.unitPrice).toBe(28.5)
  })

  it('contém OB-5561-LK (Pastilha de Freio Cerâmica)', () => {
    const item = stockMockPage.find((i) => i.skuId === 'OB-5561-LK')
    expect(item).toBeDefined()
    expect(item?.supplier).toBe('Distribuidora Continental')
    expect(item?.unitPrice).toBe(215.9)
  })
})

describe('stockMockPage — cobertura de estados de estoque', () => {
  it('tem ao menos 3 itens críticos (stockQty < stockThreshold)', () => {
    const critical = stockMockPage.filter((i) => i.stockQty < i.stockThreshold)
    expect(critical.length).toBeGreaterThanOrEqual(3)
  })

  it('tem itens em estado saudável (stockQty >= stockThreshold)', () => {
    const healthy = stockMockPage.filter((i) => i.stockQty >= i.stockThreshold)
    expect(healthy.length).toBeGreaterThan(0)
  })

  it('OB-9921-ZR está em estado crítico', () => {
    const item = stockMockPage.find((i) => i.skuId === 'OB-9921-ZR')!
    expect(item.stockQty).toBeLessThan(item.stockThreshold)
  })

  it('OB-4492-XT está em estado saudável', () => {
    const item = stockMockPage.find((i) => i.skuId === 'OB-4492-XT')!
    expect(item.stockQty).toBeGreaterThanOrEqual(item.stockThreshold)
  })
})

describe('stockMockPage — cobertura de categorias', () => {
  const ALL_CATEGORIES: Category[] = [
    'Motores',
    'Suspensão',
    'Filtros',
    'Freios',
    'Elétrica',
    'Outros',
  ]

  it('cobre todas as 6 categorias', () => {
    const presentCategories = new Set(stockMockPage.map((i) => i.category))
    ALL_CATEGORIES.forEach((cat) => {
      expect(presentCategories.has(cat)).toBe(true)
    })
  })
})

describe('stockKpiMock — valores para os cards KPI', () => {
  it('totalSkus é 14282', () => {
    expect(stockKpiMock.totalSkus).toBe(14_282)
  })

  it('criticalAlerts é 48', () => {
    expect(stockKpiMock.criticalAlerts).toBe(48)
  })

  it('inventoryValue é 2840150', () => {
    expect(stockKpiMock.inventoryValue).toBe(2_840_150)
  })

  it('trendTotalSkus é positivo (+2.4% MOM)', () => {
    expect(stockKpiMock.trendTotalSkus).toBe(2.4)
  })
})
