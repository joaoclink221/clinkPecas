import { describe, expect, it } from 'vitest'

import { mockUserProfile } from './employee-profile.mock'
import { DEPARTMENTS, type Department, type UserProfile } from './employee-profile.types'

// ── 2.1 Interface TypeScript ───────────────────────────────────────────────────

describe('employee-profile.types — 2.1 Interface UserProfile', () => {
  it('DEPARTMENTS contém os 6 departamentos esperados', () => {
    expect(DEPARTMENTS).toHaveLength(6)
    expect(DEPARTMENTS).toContain('Logística')
    expect(DEPARTMENTS).toContain('Vendas')
    expect(DEPARTMENTS).toContain('Estoque')
    expect(DEPARTMENTS).toContain('Financeiro')
    expect(DEPARTMENTS).toContain('RH')
    expect(DEPARTMENTS).toContain('Compras')
  })

  it('DEPARTMENTS é readonly (as const) — referência estável, conteúdo fixo', () => {
    // "as const" garante readonly em TypeScript (compile-time).
    // Em runtime, o array é imutável por convenção — verificamos que a referência
    // e os valores permanecem os esperados após importação.
    const snapshot = [...DEPARTMENTS]
    expect(snapshot).toEqual(['Logística', 'Vendas', 'Estoque', 'Financeiro', 'RH', 'Compras'])
  })

  it('objeto compliant com UserProfile compila e mantém estrutura correta', () => {
    const profile: UserProfile = {
      fullName:   'Test User',
      email:      'test@example.com',
      department: 'Vendas',
      role:       'Sales Manager',
      avatarUrl:  null,
      preferences: {
        highContrast:      true,
        pushNotifications: false,
      },
    }

    expect(profile.preferences).toEqual({ highContrast: true, pushNotifications: false })
    expect(profile.avatarUrl).toBeNull()
  })

  it('Department aceita qualquer valor do enum DEPARTMENTS', () => {
    const deps: Department[] = [...DEPARTMENTS]
    expect(deps).toHaveLength(DEPARTMENTS.length)
  })

  it('preferences é um objeto aninhado com dois booleans', () => {
    const profile: UserProfile = mockUserProfile
    expect(typeof profile.preferences.highContrast).toBe('boolean')
    expect(typeof profile.preferences.pushNotifications).toBe('boolean')
  })
})

// ── 2.2 Mock inicial ───────────────────────────────────────────────────────────

describe('employee-profile.mock — 2.2 mockUserProfile', () => {
  it('fullName é "Ricardo Oliveira"', () => {
    expect(mockUserProfile.fullName).toBe('Ricardo Oliveira')
  })

  it('email é "ricardo.o@obsidiangear.com"', () => {
    expect(mockUserProfile.email).toBe('ricardo.o@obsidiangear.com')
  })

  it('department é "Logística"', () => {
    expect(mockUserProfile.department).toBe('Logística')
  })

  it('role é "Fleet Coordinator"', () => {
    expect(mockUserProfile.role).toBe('Fleet Coordinator')
  })

  it('avatarUrl é null', () => {
    expect(mockUserProfile.avatarUrl).toBeNull()
  })

  it('highContrast é false', () => {
    expect(mockUserProfile.preferences.highContrast).toBe(false)
  })

  it('pushNotifications é true', () => {
    expect(mockUserProfile.preferences.pushNotifications).toBe(true)
  })

  it('department pertence ao enum DEPARTMENTS', () => {
    expect(DEPARTMENTS).toContain(mockUserProfile.department)
  })
})
