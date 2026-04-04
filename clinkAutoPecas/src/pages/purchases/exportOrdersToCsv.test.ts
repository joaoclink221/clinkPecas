import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildCsvFilename,
  exportOrdersToCsv,
  serializeOrdersToCsv,
} from './exportOrdersToCsv'
import { purchasesMockPage } from './mock-data'
import type { PurchaseOrder } from './purchases.types'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const singleOrder: PurchaseOrder = {
  id: 'PUR-0001',
  supplier: 'Test Supplier',
  issueDate: '2024-01-15',
  totalValue: 1500.0,
  status: 'received',
  supplierTag: 'PREMIUM VENDOR',
}

const orderWithComma: PurchaseOrder = {
  id: 'PUR-0002',
  supplier: 'Supplier, Ltd.',
  issueDate: '2024-02-01',
  totalValue: 200.0,
  status: 'pending',
  supplierTag: 'LOGISTICS PENDING',
}

const orderWithQuotes: PurchaseOrder = {
  id: 'PUR-0003',
  supplier: 'Supplier "Special"',
  issueDate: '2024-03-01',
  totalValue: 300.0,
  status: 'cancelled',
  supplierTag: 'CREDIT HOLD',
}

// ── serializeOrdersToCsv ──────────────────────────────────────────────────────

describe('serializeOrdersToCsv — 6.1 Serialização', () => {
  it('retorna somente o cabeçalho quando o array é vazio', () => {
    const result = serializeOrdersToCsv([])

    expect(result).toBe('ID Pedido,Fornecedor,Data Emissão,Valor Total,Status')
  })

  it('cabeçalho tem as 5 colunas na ordem correta', () => {
    const result = serializeOrdersToCsv([])
    const [header] = result.split('\n')

    expect(header).toBe('ID Pedido,Fornecedor,Data Emissão,Valor Total,Status')
  })

  it('serializa um único registro corretamente', () => {
    const result = serializeOrdersToCsv([singleOrder])
    const lines = result.split('\n')

    expect(lines).toHaveLength(2) // header + 1 linha
    expect(lines[1]).toBe('PUR-0001,Test Supplier,2024-01-15,1500,received')
  })

  it('serializa todos os 15 registros do mock', () => {
    const result = serializeOrdersToCsv(purchasesMockPage)
    const lines = result.split('\n')

    expect(lines).toHaveLength(16) // header + 15 linhas
  })

  it('campos separados por vírgula (RFC 4180)', () => {
    const result = serializeOrdersToCsv([singleOrder])
    const [, dataLine] = result.split('\n')
    const fields = dataLine.split(',')

    expect(fields).toHaveLength(5)
    expect(fields[0]).toBe('PUR-0001')
    expect(fields[1]).toBe('Test Supplier')
    expect(fields[2]).toBe('2024-01-15')
    expect(fields[3]).toBe('1500')
    expect(fields[4]).toBe('received')
  })

  it('escapa campo com vírgula envolvendo em aspas duplas', () => {
    const result = serializeOrdersToCsv([orderWithComma])
    const [, dataLine] = result.split('\n')

    expect(dataLine).toContain('"Supplier, Ltd."')
  })

  it('escapa campo com aspas duplicando-as (RFC 4180)', () => {
    const result = serializeOrdersToCsv([orderWithQuotes])
    const [, dataLine] = result.split('\n')

    expect(dataLine).toContain('"Supplier ""Special"""')
  })

  it('inclui id, supplier, issueDate, totalValue e status para cada ordem do mock', () => {
    const result = serializeOrdersToCsv(purchasesMockPage)

    for (const order of purchasesMockPage) {
      expect(result).toContain(order.id)
      expect(result).toContain(order.supplier)
      expect(result).toContain(order.issueDate)
      expect(result).toContain(order.status)
    }
  })
})

// ── serializeOrdersToCsv respeitando filtros ──────────────────────────────────

describe('serializeOrdersToCsv — 6.2 Respeita filtro ativo', () => {
  it('CSV com apenas pendentes contém somente ordens com status "pending"', () => {
    const pending = purchasesMockPage.filter((o) => o.status === 'pending')
    const result = serializeOrdersToCsv(pending)
    const lines = result.split('\n')

    // header + número de ordens pendentes
    expect(lines).toHaveLength(pending.length + 1)
    // Não contém IDs de ordens não-pendentes
    expect(result).not.toContain('PUR-8821') // received
    expect(result).not.toContain('PUR-8799') // cancelled
  })

  it('CSV filtrado por status "received" não contém ordens "pending" ou "cancelled"', () => {
    const received = purchasesMockPage.filter((o) => o.status === 'received')
    const result = serializeOrdersToCsv(received)

    for (const order of purchasesMockPage.filter((o) => o.status !== 'received')) {
      expect(result).not.toContain(order.id)
    }
  })

  it('CSV de busca textual contém somente registros correspondentes', () => {
    const filtered = purchasesMockPage.filter((o) =>
      o.supplier.toLowerCase().includes('bosch'),
    )
    const result = serializeOrdersToCsv(filtered)

    expect(result).toContain('PUR-8821') // Bosch Global Parts
    expect(result).toContain('PUR-8810') // Bosch Filtros
    expect(result).not.toContain('PUR-8845') // Continental
  })
})

// ── buildCsvFilename ──────────────────────────────────────────────────────────

describe('buildCsvFilename — 6.1 Nome do arquivo', () => {
  it('retorna "ordens-compra-YYYY-MM-DD.csv" com a data fornecida', () => {
    const date = new Date('2024-06-15')
    expect(buildCsvFilename(date)).toBe('ordens-compra-2024-06-15.csv')
  })

  it('formata mês e dia com zero à esquerda', () => {
    const date = new Date('2024-01-05')
    expect(buildCsvFilename(date)).toBe('ordens-compra-2024-01-05.csv')
  })

  it('sem argumento usa a data atual (formato correto)', () => {
    const filename = buildCsvFilename()
    expect(filename).toMatch(/^ordens-compra-\d{4}-\d{2}-\d{2}\.csv$/)
  })
})

// ── exportOrdersToCsv (DOM side-effects) ─────────────────────────────────────

describe('exportOrdersToCsv — 6.1 Download', () => {
  let anchorClickMock: ReturnType<typeof vi.fn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let createObjectURLMock: ReturnType<typeof vi.fn>
  let revokeObjectURLMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Mock do <a> criado dinamicamente
    anchorClickMock = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          style: { display: '' },
          click: anchorClickMock,
        } as unknown as HTMLAnchorElement
      }
      return document.createElement(tag)
    })

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

    createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url')
    revokeObjectURLMock = vi.fn()
    URL.createObjectURL = createObjectURLMock as unknown as typeof URL.createObjectURL
    URL.revokeObjectURL = revokeObjectURLMock as unknown as typeof URL.revokeObjectURL
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('chama URL.createObjectURL com um Blob', () => {
    exportOrdersToCsv([singleOrder], 'test.csv')

    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob))
  })

  it('define o atributo download com o filename fornecido', () => {
    const anchor = { href: '', download: '', style: { display: '' }, click: vi.fn() }
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement)

    exportOrdersToCsv([singleOrder], 'ordens-compra-2024-01-01.csv')

    expect(anchor.download).toBe('ordens-compra-2024-01-01.csv')
  })

  it('chama anchor.click() para forçar o download', () => {
    exportOrdersToCsv([singleOrder], 'test.csv')

    expect(anchorClickMock).toHaveBeenCalledOnce()
  })

  it('revoga a URL temporária após o download', () => {
    exportOrdersToCsv([singleOrder], 'test.csv')

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url')
  })

  it('retorna o número de registros exportados', () => {
    const count = exportOrdersToCsv(purchasesMockPage, 'test.csv')

    expect(count).toBe(purchasesMockPage.length)
  })

  it('retorna 0 para array vazio', () => {
    const count = exportOrdersToCsv([], 'test.csv')

    expect(count).toBe(0)
  })

  it('adiciona e remove o anchor do body', () => {
    exportOrdersToCsv([singleOrder], 'test.csv')

    expect(appendChildSpy).toHaveBeenCalledOnce()
    expect(removeChildSpy).toHaveBeenCalledOnce()
  })
})
