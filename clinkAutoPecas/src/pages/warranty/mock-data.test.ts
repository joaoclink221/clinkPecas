import { describe, expect, it } from 'vitest'

import { returnsMock, warrantyProtocolsMock } from './mock-data'
import type { AvatarIcon, ReturnStatus, WarrantyProtocolStatus } from './warranty.types'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const AVATAR_ICONS: AvatarIcon[] = ['brake', 'alternator', 'filter', 'gear']
const RETURN_STATUSES: ReturnStatus[] = ['analysing', 'approved', 'refunded']
const PROTOCOL_STATUSES: WarrantyProtocolStatus[] = ['in_progress', 'completed']

// ── 2.1 / 2.3 returnsMock ────────────────────────────────────────────────────

describe('returnsMock — integridade', () => {
  it('contém exatamente 3 devoluções', () => {
    expect(returnsMock).toHaveLength(3)
  })

  it('todos os registros têm id único', () => {
    const ids = returnsMock.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todos os campos obrigatórios estão preenchidos', () => {
    for (const r of returnsMock) {
      expect(r.id).toBeTruthy()
      expect(r.itemName).toBeTruthy()
      expect(r.skuRef).toBeTruthy()
      expect(r.reason).toBeTruthy()
    }
  })

  it('datas estão no formato ISO 8601 (YYYY-MM-DD)', () => {
    for (const r of returnsMock) {
      expect(r.date).toMatch(ISO_DATE)
    }
  })

  it('avatarIcon é um valor válido do tipo AvatarIcon', () => {
    for (const r of returnsMock) {
      expect(AVATAR_ICONS).toContain(r.avatarIcon)
    }
  })

  it('status é um valor válido do tipo ReturnStatus', () => {
    for (const r of returnsMock) {
      expect(RETURN_STATUSES).toContain(r.status)
    }
  })

  it('cobre os 3 status distintos do badge de devolução', () => {
    const statuses = returnsMock.map((r) => r.status)
    expect(statuses).toContain('analysing')
    expect(statuses).toContain('approved')
    expect(statuses).toContain('refunded')
  })

  it('primeiro registro é Disco de Freio Vent. (ORD-98231-X, analysing)', () => {
    const r = returnsMock[0]
    expect(r.itemName).toBe('Disco de Freio Vent.')
    expect(r.skuRef).toBe('ORD-98231-X')
    expect(r.reason).toBe('Avaria no Transporte')
    expect(r.status).toBe('analysing')
    expect(r.avatarIcon).toBe('brake')
  })

  it('segundo registro é Alternador 120A (ORD-88122-Y, approved)', () => {
    const r = returnsMock[1]
    expect(r.itemName).toBe('Alternador 120A')
    expect(r.skuRef).toBe('ORD-88122-Y')
    expect(r.reason).toBe('Incompatibilidade')
    expect(r.status).toBe('approved')
    expect(r.avatarIcon).toBe('alternator')
  })

  it('terceiro registro é Kit Filtros (4un) (ORD-99100-A, refunded)', () => {
    const r = returnsMock[2]
    expect(r.itemName).toBe('Kit Filtros (4un)')
    expect(r.skuRef).toBe('ORD-99100-A')
    expect(r.reason).toBe('Erro de Pedido')
    expect(r.status).toBe('refunded')
    expect(r.avatarIcon).toBe('filter')
  })
})

// ── 2.2 / 2.3 warrantyProtocolsMock ──────────────────────────────────────────

describe('warrantyProtocolsMock — integridade', () => {
  it('contém exatamente 2 protocolos', () => {
    expect(warrantyProtocolsMock).toHaveLength(2)
  })

  it('todos os protocolId são únicos', () => {
    const ids = warrantyProtocolsMock.map((p) => p.protocolId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todos os campos obrigatórios estão preenchidos', () => {
    for (const p of warrantyProtocolsMock) {
      expect(p.protocolId).toBeTruthy()
      expect(p.itemName).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.linkedOrder).toBeTruthy()
    }
  })

  it('openDate e expirationDate estão no formato ISO 8601', () => {
    for (const p of warrantyProtocolsMock) {
      expect(p.openDate).toMatch(ISO_DATE)
      expect(p.expirationDate).toMatch(ISO_DATE)
    }
  })

  it('expirationDate é posterior ao openDate em todos os protocolos', () => {
    for (const p of warrantyProtocolsMock) {
      expect(new Date(p.expirationDate).getTime()).toBeGreaterThan(
        new Date(p.openDate).getTime(),
      )
    }
  })

  it('status é um valor válido do tipo WarrantyProtocolStatus', () => {
    for (const p of warrantyProtocolsMock) {
      expect(PROTOCOL_STATUSES).toContain(p.status)
    }
  })

  it('cobre os 2 status distintos do protocolo', () => {
    const statuses = warrantyProtocolsMock.map((p) => p.status)
    expect(statuses).toContain('in_progress')
    expect(statuses).toContain('completed')
  })

  it('primeiro protocolo é GAR-2290 (Transmissão Hidráulica X-9, in_progress)', () => {
    const p = warrantyProtocolsMock[0]
    expect(p.protocolId).toBe('GAR-2290')
    expect(p.itemName).toBe('Transmissão Hidráulica X-9')
    expect(p.linkedOrder).toBe('ORD-772')
    expect(p.status).toBe('in_progress')
    expect(p.openDate).toBe('2023-09-01')
    expect(p.expirationDate).toBe('2024-09-01')
  })

  it('segundo protocolo é GAR-2144 (Módulo de Controle ECU, completed)', () => {
    const p = warrantyProtocolsMock[1]
    expect(p.protocolId).toBe('GAR-2144')
    expect(p.itemName).toBe('Módulo de Controle ECU')
    expect(p.linkedOrder).toBe('ORD-551')
    expect(p.status).toBe('completed')
    expect(p.openDate).toBe('2023-08-15')
    expect(p.expirationDate).toBe('2024-08-15')
  })

  it('descrição do GAR-2290 menciona falha no conversor de torque', () => {
    const p = warrantyProtocolsMock[0]
    expect(p.description.toLowerCase()).toContain('conversor de torque')
  })

  it('descrição do GAR-2144 menciona CAN-bus', () => {
    const p = warrantyProtocolsMock[1]
    expect(p.description).toContain('CAN-bus')
  })
})
