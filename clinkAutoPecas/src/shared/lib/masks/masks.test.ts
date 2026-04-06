import { describe, expect, it } from 'vitest'

import { applyMask, maskCnpj, maskCpf, maskMoeda, maskTelefone, unmask } from './index'

// ── maskCpf ───────────────────────────────────────────────────────────────────

describe('maskCpf', () => {
  it('string vazia retorna vazia', () => {
    expect(maskCpf('')).toBe('')
  })

  it('formata progressivamente conforme dígitos são inseridos', () => {
    expect(maskCpf('1')).toBe('1')
    expect(maskCpf('123')).toBe('123')
    expect(maskCpf('1234')).toBe('123.4')
    expect(maskCpf('123456')).toBe('123.456')
    expect(maskCpf('1234567')).toBe('123.456.7')
    expect(maskCpf('123456789')).toBe('123.456.789')
    expect(maskCpf('1234567890')).toBe('123.456.789-0')
    expect(maskCpf('12345678901')).toBe('123.456.789-01')
  })

  it('já formatado retorna o mesmo valor', () => {
    expect(maskCpf('123.456.789-01')).toBe('123.456.789-01')
  })

  it('descarta dígitos além de 11', () => {
    expect(maskCpf('123456789012345')).toBe('123.456.789-01')
  })

  it('ignora caracteres não numéricos na entrada', () => {
    expect(maskCpf('abc123def456ghi789-01')).toBe('123.456.789-01')
  })
})

// ── maskCnpj ──────────────────────────────────────────────────────────────────

describe('maskCnpj', () => {
  it('string vazia retorna vazia', () => {
    expect(maskCnpj('')).toBe('')
  })

  it('formata progressivamente conforme dígitos são inseridos', () => {
    expect(maskCnpj('12')).toBe('12')
    expect(maskCnpj('123')).toBe('12.3')
    expect(maskCnpj('12345')).toBe('12.345')
    expect(maskCnpj('123456')).toBe('12.345.6')
    expect(maskCnpj('12345678')).toBe('12.345.678')
    expect(maskCnpj('123456789')).toBe('12.345.678/9')
    expect(maskCnpj('12345678000195')).toBe('12.345.678/0001-95')
  })

  it('já formatado retorna o mesmo valor', () => {
    expect(maskCnpj('12.345.678/0001-95')).toBe('12.345.678/0001-95')
  })

  it('descarta dígitos além de 14', () => {
    expect(maskCnpj('123456780001959999')).toBe('12.345.678/0001-95')
  })
})

// ── maskTelefone ──────────────────────────────────────────────────────────────

describe('maskTelefone', () => {
  it('string vazia retorna vazia', () => {
    expect(maskTelefone('')).toBe('')
  })

  it('formata fixo (10 dígitos): (00) 0000-0000', () => {
    expect(maskTelefone('1133334444')).toBe('(11) 3333-4444')
  })

  it('formata celular (11 dígitos): (00) 00000-0000', () => {
    expect(maskTelefone('11987654321')).toBe('(11) 98765-4321')
  })

  it('formata progressivamente', () => {
    expect(maskTelefone('1')).toBe('(1')
    expect(maskTelefone('11')).toBe('(11')
    expect(maskTelefone('119')).toBe('(11) 9')
    expect(maskTelefone('11987')).toBe('(11) 987')
    expect(maskTelefone('119876')).toBe('(11) 9876')
    expect(maskTelefone('1198765')).toBe('(11) 9876-5')
  })

  it('já formatado retorna o mesmo valor', () => {
    expect(maskTelefone('(11) 98765-4321')).toBe('(11) 98765-4321')
  })

  it('descarta dígitos além de 11', () => {
    expect(maskTelefone('11987654321999')).toBe('(11) 98765-4321')
  })
})

// ── maskMoeda ─────────────────────────────────────────────────────────────────

describe('maskMoeda', () => {
  it('string vazia retorna vazia', () => {
    expect(maskMoeda('')).toBe('')
  })

  it('string sem dígitos retorna vazia', () => {
    expect(maskMoeda('R$ ,-')).toBe('')
  })

  it('interpreta últimos dois dígitos como centavos', () => {
    // 100 → R$ 1,00
    expect(maskMoeda('100')).toBe('R$\u00a01,00')
  })

  it('formata valor com milhar', () => {
    // 1234567 → R$ 12.345,67
    expect(maskMoeda('1234567')).toBe('R$\u00a012.345,67')
  })

  it('já formatado (contém R$) retorna o mesmo valor formatado', () => {
    // "R$ 1,00" → dígitos = "100" → R$ 1,00
    expect(maskMoeda('R$ 1,00')).toBe('R$\u00a01,00')
  })
})

// ── applyMask ─────────────────────────────────────────────────────────────────

describe('applyMask', () => {
  it('cpf delega para maskCpf', () => {
    expect(applyMask('cpf', '12345678901')).toBe(maskCpf('12345678901'))
  })

  it('cnpj delega para maskCnpj', () => {
    expect(applyMask('cnpj', '12345678000195')).toBe(maskCnpj('12345678000195'))
  })

  it('telefone delega para maskTelefone', () => {
    expect(applyMask('telefone', '11987654321')).toBe(maskTelefone('11987654321'))
  })

  it('moeda delega para maskMoeda', () => {
    expect(applyMask('moeda', '100')).toBe(maskMoeda('100'))
  })
})

// ── unmask ────────────────────────────────────────────────────────────────────

describe('unmask', () => {
  it('CPF formatado → somente dígitos', () => {
    expect(unmask('123.456.789-01')).toBe('12345678901')
  })

  it('CNPJ formatado → somente dígitos', () => {
    expect(unmask('12.345.678/0001-95')).toBe('12345678000195')
  })

  it('telefone formatado → somente dígitos', () => {
    expect(unmask('(11) 98765-4321')).toBe('11987654321')
  })

  it('moeda formatada → somente dígitos (centavos concatenados)', () => {
    expect(unmask('R$ 1.234,56')).toBe('123456')
  })

  it('string vazia retorna vazia', () => {
    expect(unmask('')).toBe('')
  })
})
