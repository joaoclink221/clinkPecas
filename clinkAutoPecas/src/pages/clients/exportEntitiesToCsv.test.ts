import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Entity } from './clients.types'
import {
  buildEntitiesCsvFilename,
  exportEntitiesToCsv,
  serializeEntitiesToCsv,
} from './exportEntitiesToCsv'
import { entitiesMock } from './mock-data'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseEntity: Entity = {
  id: 'ENT-001',
  entityKind: 'cliente',
  name: 'Turbo Dynamics Inc.',
  subtitle: 'Large Fleet Enterprise',
  avatarIcon: 'enterprise',
  taxId: '12.345.678/0001-90',
  email: 'contact@turbodynamics.com',
  phone: '+55 11 91234-5678',
  creditLimit: 50000,
  outstandingBalance: 0,
  financialStatus: 'ok',
  status: 'active',
}

const entityWithNullLimit: Entity = {
  ...baseEntity,
  id: 'ENT-002',
  creditLimit: null,
  financialStatus: 'prepaid',
}

const entityWithCommaInName: Entity = {
  ...baseEntity,
  id: 'ENT-003',
  name: 'Souza, Pereira & Cia.',
}

const entityWithQuotesInName: Entity = {
  ...baseEntity,
  id: 'ENT-004',
  name: 'Auto "Premium" Parts',
}

// ── serializeEntitiesToCsv — cabeçalho ────────────────────────────────────────

describe('serializeEntitiesToCsv — cabeçalho', () => {
  it('retorna somente o cabeçalho quando o array é vazio', () => {
    const result = serializeEntitiesToCsv([])

    expect(result).toBe(
      'Nome,Tipo,CNPJ/CPF,Email,Telefone,Limite de Crédito,Saldo Devedor,Status Financeiro,Status',
    )
  })

  it('cabeçalho tem as 9 colunas na ordem correta', () => {
    const [header] = serializeEntitiesToCsv([]).split('\n')
    const cols = header.split(',')

    expect(cols).toEqual([
      'Nome',
      'Tipo',
      'CNPJ/CPF',
      'Email',
      'Telefone',
      'Limite de Crédito',
      'Saldo Devedor',
      'Status Financeiro',
      'Status',
    ])
  })
})

// ── serializeEntitiesToCsv — dados ────────────────────────────────────────────

describe('serializeEntitiesToCsv — dados', () => {
  it('serializa um único registro corretamente', () => {
    const result = serializeEntitiesToCsv([baseEntity])
    const lines = result.split('\n')

    expect(lines).toHaveLength(2) // header + 1 linha
    expect(lines[1]).toBe(
      'Turbo Dynamics Inc.,cliente,12.345.678/0001-90,contact@turbodynamics.com,+55 11 91234-5678,50000,0,ok,active',
    )
  })

  it('creditLimit null é serializado como string vazia', () => {
    const result = serializeEntitiesToCsv([entityWithNullLimit])
    const [, dataLine] = result.split('\n')
    const fields = dataLine.split(',')

    // Índice 5 = Limite de Crédito
    expect(fields[5]).toBe('')
  })

  it('linha de dados tem 9 campos separados por vírgula', () => {
    const result = serializeEntitiesToCsv([baseEntity])
    const [, dataLine] = result.split('\n')
    const fields = dataLine.split(',')

    expect(fields).toHaveLength(9)
  })

  it('serializa todos os registros do mock (header + N linhas)', () => {
    const result = serializeEntitiesToCsv(entitiesMock)
    const lines = result.split('\n')

    expect(lines).toHaveLength(entitiesMock.length + 1)
  })

  it('inclui nome, taxId, email e status para cada entidade do mock', () => {
    const result = serializeEntitiesToCsv(entitiesMock)

    for (const entity of entitiesMock) {
      expect(result).toContain(entity.name)
      expect(result).toContain(entity.taxId)
      expect(result).toContain(entity.email)
      expect(result).toContain(entity.status)
    }
  })
})

// ── serializeEntitiesToCsv — escaping RFC 4180 ───────────────────────────────

describe('serializeEntitiesToCsv — escaping RFC 4180', () => {
  it('envolve em aspas duplas campo que contém vírgula', () => {
    const result = serializeEntitiesToCsv([entityWithCommaInName])
    const [, dataLine] = result.split('\n')

    expect(dataLine).toContain('"Souza, Pereira & Cia."')
  })

  it('duplica aspas internas conforme RFC 4180', () => {
    const result = serializeEntitiesToCsv([entityWithQuotesInName])
    const [, dataLine] = result.split('\n')

    expect(dataLine).toContain('"Auto ""Premium"" Parts"')
  })

  it('campo sem caracteres especiais não é envolvido em aspas', () => {
    const result = serializeEntitiesToCsv([baseEntity])
    const [, dataLine] = result.split('\n')

    expect(dataLine).toContain('Turbo Dynamics Inc.')
    expect(dataLine).not.toContain('"Turbo Dynamics Inc."')
  })
})

// ── serializeEntitiesToCsv — respeita filtro ativo ───────────────────────────

describe('serializeEntitiesToCsv — 6.1 Respeita filtro ativo', () => {
  it('"Balance Due" ativo: CSV contém somente entidades com financialStatus "due"', () => {
    // Simula o filteredEntities que o hook entregaria com BALANCE = "Balance Due"
    const dueEntities = entitiesMock.filter((e) => e.financialStatus === 'due')
    const result = serializeEntitiesToCsv(dueEntities)
    const lines = result.split('\n')

    expect(lines).toHaveLength(dueEntities.length + 1)
    // Nenhuma entidade com outro status financeiro aparece
    const nonDue = entitiesMock.filter((e) => e.financialStatus !== 'due')
    for (const entity of nonDue) {
      expect(result).not.toContain(entity.taxId)
    }
  })

  it('filtro "Active Only" + "Balance Due": CSV contém somente ativas em atraso', () => {
    const filtered = entitiesMock.filter(
      (e) => e.status === 'active' && e.financialStatus === 'due',
    )
    const result = serializeEntitiesToCsv(filtered)

    for (const entity of filtered) {
      expect(result).toContain(entity.name)
    }
    // Entidades inativas ou sem due não aparecem
    const excluded = entitiesMock.filter(
      (e) => e.status !== 'active' || e.financialStatus !== 'due',
    )
    for (const entity of excluded) {
      expect(result).not.toContain(entity.taxId)
    }
  })

  it('exportar array vazio (filtro sem resultados) retorna só o cabeçalho', () => {
    const result = serializeEntitiesToCsv([])
    const lines = result.split('\n')

    expect(lines).toHaveLength(1)
  })
})

// ── buildEntitiesCsvFilename ──────────────────────────────────────────────────

describe('buildEntitiesCsvFilename — nome do arquivo', () => {
  it('retorna "entidades-YYYY-MM-DD.csv" com a data fornecida', () => {
    const date = new Date('2024-06-15')

    expect(buildEntitiesCsvFilename(date)).toBe('entidades-2024-06-15.csv')
  })

  it('formata mês e dia com zero à esquerda', () => {
    const date = new Date('2024-01-05')

    expect(buildEntitiesCsvFilename(date)).toBe('entidades-2024-01-05.csv')
  })

  it('sem argumento usa a data atual com formato correto', () => {
    const filename = buildEntitiesCsvFilename()

    expect(filename).toMatch(/^entidades-\d{4}-\d{2}-\d{2}\.csv$/)
  })

  it('prefixo correto é "entidades-" (não "ordens-compra-")', () => {
    const filename = buildEntitiesCsvFilename(new Date('2024-03-20'))

    expect(filename).toMatch(/^entidades-/)
  })
})

// ── exportEntitiesToCsv — DOM side-effects ────────────────────────────────────

describe('exportEntitiesToCsv — download', () => {
  let anchorClickMock: ReturnType<typeof vi.fn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let createObjectURLMock: ReturnType<typeof vi.fn>
  let revokeObjectURLMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
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
    exportEntitiesToCsv([baseEntity], 'test.csv')

    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob))
  })

  it('define o atributo download com o filename fornecido', () => {
    const anchor = { href: '', download: '', style: { display: '' }, click: vi.fn() }
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement)

    exportEntitiesToCsv([baseEntity], 'entidades-2024-01-01.csv')

    expect(anchor.download).toBe('entidades-2024-01-01.csv')
  })

  it('chama anchor.click() para forçar o download', () => {
    exportEntitiesToCsv([baseEntity], 'test.csv')

    expect(anchorClickMock).toHaveBeenCalledOnce()
  })

  it('revoga a URL temporária após o download', () => {
    exportEntitiesToCsv([baseEntity], 'test.csv')

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url')
  })

  it('adiciona e remove o anchor do body', () => {
    exportEntitiesToCsv([baseEntity], 'test.csv')

    expect(appendChildSpy).toHaveBeenCalledOnce()
    expect(removeChildSpy).toHaveBeenCalledOnce()
  })

  it('retorna o número de registros exportados', () => {
    const count = exportEntitiesToCsv(entitiesMock, 'test.csv')

    expect(count).toBe(entitiesMock.length)
  })

  it('retorna 0 para array vazio', () => {
    const count = exportEntitiesToCsv([], 'test.csv')

    expect(count).toBe(0)
  })
})
