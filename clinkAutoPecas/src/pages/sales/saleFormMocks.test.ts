import { describe, expect, it } from 'vitest'

import {
  INITIAL_SALE_ITEMS,
  SELLER,
  clientsMock,
  computeSubtotal,
  computeTotal,
  productsMock,
} from './saleFormMocks'

// ── 2.1 — Interfaces e Mocks ──────────────────────────────────────────────────

describe('saleFormMocks 2.1 — productsMock', () => {
  it('contém ao menos 6 produtos', () => {
    expect(productsMock.length).toBeGreaterThanOrEqual(6)
  })

  it('cada produto tem sku, name e unitPrice > 0', () => {
    for (const p of productsMock) {
      expect(typeof p.sku).toBe('string')
      expect(p.sku.trim().length).toBeGreaterThan(0)
      expect(typeof p.name).toBe('string')
      expect(p.name.trim().length).toBeGreaterThan(0)
      expect(p.unitPrice).toBeGreaterThan(0)
    }
  })

  it('contém o Turbo Compressor T3 Titanium (OG-TB-001, R$ 4.500)', () => {
    const turbo = productsMock.find((p) => p.sku === 'OG-TB-001')

    expect(turbo).toBeDefined()
    expect(turbo!.name).toMatch(/turbo compressor/i)
    expect(turbo!.unitPrice).toBe(4500)
  })

  it('contém o Kit Injeção Eletrônica RaceSpec (OG-IJ-992, R$ 3.450)', () => {
    const kit = productsMock.find((p) => p.sku === 'OG-IJ-992')

    expect(kit).toBeDefined()
    expect(kit!.name).toMatch(/injeção eletrônica/i)
    expect(kit!.unitPrice).toBe(3450)
  })

  it('SKUs são únicos no catálogo', () => {
    const skus = productsMock.map((p) => p.sku)
    const unique = new Set(skus)
    expect(unique.size).toBe(skus.length)
  })
})

describe('saleFormMocks 2.1 — clientsMock', () => {
  it('contém exatamente 5 clientes', () => {
    expect(clientsMock).toHaveLength(5)
  })

  it('cada cliente tem id e name não vazios', () => {
    for (const c of clientsMock) {
      expect(typeof c.id).toBe('string')
      expect(c.id.trim().length).toBeGreaterThan(0)
      expect(typeof c.name).toBe('string')
      expect(c.name.trim().length).toBeGreaterThan(0)
    }
  })

  it('IDs são únicos', () => {
    const ids = clientsMock.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('saleFormMocks 2.1 — SELLER', () => {
  it('vendedor hardcoded é "Carlos Alberto (ID: 442)"', () => {
    expect(SELLER).toBe('Carlos Alberto (ID: 442)')
  })
})

describe('saleFormMocks 2.1 — computeSubtotal', () => {
  it('retorna unitPrice × quantity corretamente', () => {
    const item = { product: { sku: 'X', name: 'X', unitPrice: 100 }, quantity: 3 }
    expect(computeSubtotal(item)).toBe(300)
  })

  it('subtotal é zero quando quantity é zero', () => {
    const item = { product: { sku: 'X', name: 'X', unitPrice: 500 }, quantity: 0 }
    expect(computeSubtotal(item)).toBe(0)
  })

  it('subtotal com preço fracionário é preciso', () => {
    const item = { product: { sku: 'X', name: 'X', unitPrice: 4500 }, quantity: 2 }
    expect(computeSubtotal(item)).toBe(9000)
  })
})

describe('saleFormMocks 2.1 — computeTotal', () => {
  it('aplica desconto percentual corretamente', () => {
    const items = [{ product: { sku: 'A', name: 'A', unitPrice: 1000 }, quantity: 1 }]
    // 10 % de desconto → 900
    expect(computeTotal(items, 0.10)).toBeCloseTo(900)
  })

  it('discountRate 0 retorna o gross total sem alteração', () => {
    const items = [{ product: { sku: 'A', name: 'A', unitPrice: 200 }, quantity: 5 }]
    expect(computeTotal(items, 0)).toBe(1000)
  })

  it('clampeia discountRate acima de 1 para zero (total = 0)', () => {
    const items = [{ product: { sku: 'A', name: 'A', unitPrice: 500 }, quantity: 2 }]
    // discountRate > 1 é tratado como 1 → total = 0
    expect(computeTotal(items, 1.5)).toBe(0)
  })

  it('clampeia discountRate negativo para 0 (sem desconto)', () => {
    const items = [{ product: { sku: 'A', name: 'A', unitPrice: 300 }, quantity: 1 }]
    expect(computeTotal(items, -0.5)).toBe(300)
  })

  it('lista vazia retorna zero independente do discountRate', () => {
    expect(computeTotal([], 0.10)).toBe(0)
  })
})

// ── 2.2 — Estado inicial ──────────────────────────────────────────────────────

describe('saleFormMocks 2.2 — INITIAL_SALE_ITEMS', () => {
  it('inicia com exatamente 2 itens (os da imagem)', () => {
    expect(INITIAL_SALE_ITEMS).toHaveLength(2)
  })

  it('1º item é o Turbo Compressor T3 Titanium com quantidade 2', () => {
    const item = INITIAL_SALE_ITEMS[0]
    expect(item.product.sku).toBe('OG-TB-001')
    expect(item.quantity).toBe(2)
  })

  it('2º item é o Kit Injeção Eletrônica RaceSpec com quantidade 1', () => {
    const item = INITIAL_SALE_ITEMS[1]
    expect(item.product.sku).toBe('OG-IJ-992')
    expect(item.quantity).toBe(1)
  })

  it('subtotal do 1º item é R$ 9.000 (4.500 × 2)', () => {
    expect(computeSubtotal(INITIAL_SALE_ITEMS[0])).toBe(9000)
  })

  it('subtotal do 2º item é R$ 3.450 (3.450 × 1)', () => {
    expect(computeSubtotal(INITIAL_SALE_ITEMS[1])).toBe(3450)
  })

  it('gross subtotal dos 2 itens é R$ 12.450', () => {
    const gross = INITIAL_SALE_ITEMS.reduce((acc, i) => acc + computeSubtotal(i), 0)
    expect(gross).toBe(12450)
  })

  it('total líquido com 10 % de desconto é R$ 11.205 (igual à imagem)', () => {
    // 12.450 × 0.90 = 11.205
    expect(computeTotal(INITIAL_SALE_ITEMS, 0.10)).toBeCloseTo(11205)
  })
})
