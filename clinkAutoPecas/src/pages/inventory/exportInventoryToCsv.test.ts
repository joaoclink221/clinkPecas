import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { StockItem } from './inventory.types'
import {
  buildInventoryCsvFilename,
  exportInventoryToCsv,
  serializeInventoryToCsv,
} from './exportInventoryToCsv'

// ── Dados de apoio ────────────────────────────────────────────────────────────

const ITEM_A: StockItem = {
  skuId: 'OB-4492-XT',
  name: 'Velas de Ignição Iridium',
  subtitle: 'NGK Premium Series',
  category: 'Motores',
  stockQty: 45,
  stockMax: 200,
  stockThreshold: 20,
  supplier: 'NGK Spark Plugs',
  unitPrice: 89.9,
}

const ITEM_B: StockItem = {
  skuId: 'FR-0021-BK',
  name: 'Pastilha de Freio Cerâmica',
  subtitle: 'Bosch QuietCast',
  category: 'Freios',
  stockQty: 8,
  stockMax: 100,
  stockThreshold: 15,
  supplier: 'Bosch Global Parts',
  unitPrice: 124.5,
}

const ITEM_COMMA: StockItem = {
  skuId: 'XX-0001',
  name: 'Peça, especial',
  subtitle: 'Sub',
  category: 'Outros',
  stockQty: 1,
  stockMax: 10,
  stockThreshold: 2,
  supplier: 'Fornecedor "Top"',
  unitPrice: 9.99,
}

// ── serializeInventoryToCsv ───────────────────────────────────────────────────

describe('serializeInventoryToCsv — formato CSV', () => {
  it('primeira linha é o cabeçalho correto', () => {
    const csv = serializeInventoryToCsv([ITEM_A])
    const firstLine = csv.split('\n')[0]

    expect(firstLine).toBe(
      'SKU ID,Nome,Categoria,Estoque Atual,Estoque Máx,Limiar Crítico,Fornecedor,Preço Unitário',
    )
  })

  it('array vazio retorna apenas o cabeçalho (sem linhas de dados)', () => {
    const csv = serializeInventoryToCsv([])
    const lines = csv.split('\n')

    expect(lines).toHaveLength(1)
    expect(lines[0]).toContain('SKU ID')
  })

  it('array com 2 itens gera 3 linhas (cabeçalho + 2 dados)', () => {
    const csv = serializeInventoryToCsv([ITEM_A, ITEM_B])
    const lines = csv.split('\n')

    expect(lines).toHaveLength(3)
  })

  it('separador é vírgula', () => {
    const csv = serializeInventoryToCsv([ITEM_A])
    const dataLine = csv.split('\n')[1]

    expect(dataLine.split(',').length).toBeGreaterThanOrEqual(8)
  })

  it('linha de dados contém o skuId correto', () => {
    const csv = serializeInventoryToCsv([ITEM_A])

    expect(csv).toContain('OB-4492-XT')
  })

  it('linha de dados contém o nome correto', () => {
    const csv = serializeInventoryToCsv([ITEM_A])

    expect(csv).toContain('Velas de Ignição Iridium')
  })

  it('linha de dados contém a categoria', () => {
    const csv = serializeInventoryToCsv([ITEM_A])

    expect(csv).toContain('Motores')
  })

  it('linha de dados contém stockQty, stockMax e stockThreshold', () => {
    const csv = serializeInventoryToCsv([ITEM_A])

    expect(csv).toContain('45')
    expect(csv).toContain('200')
    expect(csv).toContain('20')
  })

  it('linha de dados contém o fornecedor', () => {
    const csv = serializeInventoryToCsv([ITEM_A])

    expect(csv).toContain('NGK Spark Plugs')
  })

  it('linha de dados contém o unitPrice', () => {
    const csv = serializeInventoryToCsv([ITEM_A])

    expect(csv).toContain('89.9')
  })

  it('campo com vírgula é envolvido em aspas duplas', () => {
    const csv = serializeInventoryToCsv([ITEM_COMMA])

    expect(csv).toContain('"Peça, especial"')
  })

  it('campo com aspas internas é escapado (duplicação RFC 4180)', () => {
    const csv = serializeInventoryToCsv([ITEM_COMMA])

    expect(csv).toContain('"Fornecedor ""Top"""')
  })

  it('respeita filtro: exporta só os itens recebidos (não o array completo)', () => {
    const criticalItems = [ITEM_A, ITEM_B].filter(
      (item) => item.stockQty < item.stockThreshold,
    )
    const csv = serializeInventoryToCsv(criticalItems)
    const lines = csv.split('\n')

    // Apenas ITEM_B é crítico (8 < 15)
    expect(lines).toHaveLength(2)
    expect(csv).toContain('FR-0021-BK')
    expect(csv).not.toContain('OB-4492-XT')
  })
})

// ── buildInventoryCsvFilename ─────────────────────────────────────────────────

describe('buildInventoryCsvFilename — nome do arquivo', () => {
  it('retorna "inventario-YYYY-MM-DD.csv" com a data fornecida', () => {
    const date = new Date('2024-06-15')

    expect(buildInventoryCsvFilename(date)).toBe('inventario-2024-06-15.csv')
  })

  it('formata mês e dia com zero à esquerda', () => {
    const date = new Date('2024-01-05')

    expect(buildInventoryCsvFilename(date)).toBe('inventario-2024-01-05.csv')
  })

  it('retorna string com extensão .csv', () => {
    expect(buildInventoryCsvFilename(new Date('2025-03-20'))).toMatch(/\.csv$/)
  })

  it('inclui prefixo "inventario-"', () => {
    expect(buildInventoryCsvFilename(new Date('2025-03-20'))).toMatch(/^inventario-/)
  })
})

// ── exportInventoryToCsv — efeitos colaterais DOM ────────────────────────────

describe('exportInventoryToCsv — download DOM', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>
  let revokeObjectURLMock: ReturnType<typeof vi.fn>
  let anchorClickMock: ReturnType<typeof vi.fn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let createElementSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url')
    revokeObjectURLMock = vi.fn()
    URL.createObjectURL = createObjectURLMock as unknown as typeof URL.createObjectURL
    URL.revokeObjectURL = revokeObjectURLMock as unknown as typeof URL.revokeObjectURL

    anchorClickMock = vi.fn()
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(
      function (tag: string) {
        if (tag === 'a') {
          return {
            href: '',
            download: '',
            style: { display: '' },
            click: anchorClickMock,
          } as unknown as HTMLAnchorElement
        }
        return HTMLDocument.prototype.createElement.call(document, tag)
      } as typeof document.createElement,
    )
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna o número de itens exportados', () => {
    expect(exportInventoryToCsv([ITEM_A, ITEM_B], 'test.csv')).toBe(2)
  })

  it('retorna 0 para array vazio', () => {
    expect(exportInventoryToCsv([], 'test.csv')).toBe(0)
  })

  it('chama URL.createObjectURL com um Blob', () => {
    exportInventoryToCsv([ITEM_A], 'test.csv')

    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob))
  })

  it('chama URL.revokeObjectURL após o download', () => {
    exportInventoryToCsv([ITEM_A], 'test.csv')

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url')
  })

  it('cria um elemento <a>', () => {
    exportInventoryToCsv([ITEM_A], 'inventario-2024-01-01.csv')

    expect(createElementSpy).toHaveBeenCalledWith('a')
  })

  it('adiciona e remove o anchor do document.body', () => {
    exportInventoryToCsv([ITEM_A], 'test.csv')

    expect(appendChildSpy).toHaveBeenCalledOnce()
    expect(removeChildSpy).toHaveBeenCalledOnce()
  })

  it('chama .click() no anchor', () => {
    exportInventoryToCsv([ITEM_A], 'test.csv')

    expect(anchorClickMock).toHaveBeenCalledOnce()
  })

  it('define download com o filename fornecido', () => {
    let capturedAnchor: { href: string; download: string; style: { display: string }; click: () => void } = { href: '', download: '', style: { display: '' }, click: vi.fn() as unknown as () => void }
    createElementSpy.mockImplementation(function (tag: string) {
      if (tag === 'a') {
        capturedAnchor = { href: '', download: '', style: { display: '' }, click: anchorClickMock as unknown as () => void }
        return capturedAnchor as unknown as HTMLAnchorElement
      }
      return HTMLDocument.prototype.createElement.call(document, tag)
    } as typeof document.createElement)

    exportInventoryToCsv([ITEM_A], 'inventario-2025-06-01.csv')

    expect(capturedAnchor.download).toBe('inventario-2025-06-01.csv')
  })
})
