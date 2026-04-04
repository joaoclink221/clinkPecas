import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { entitiesMock } from './mock-data'
import { useClientsFilters } from './useClientsFilters'

// ── Helpers ───────────────────────────────────────────────────────────────────

function setup() {
  return renderHook(() => useClientsFilters(entitiesMock))
}

// ── Estado inicial ────────────────────────────────────────────────────────────

describe('useClientsFilters — estado inicial', () => {
  it('activeTab padrão é "clientes"', () => {
    const { result } = setup()

    expect(result.current.activeTab).toBe('clientes')
  })

  it('searchQuery padrão é string vazia', () => {
    const { result } = setup()

    expect(result.current.searchQuery).toBe('')
  })

  it('statusFilter padrão é "Active Only"', () => {
    const { result } = setup()

    expect(result.current.statusFilter).toBe('Active Only')
  })

  it('balanceFilter padrão é "Any"', () => {
    const { result } = setup()

    expect(result.current.balanceFilter).toBe('Any')
  })

  it('typeFilter padrão é "All Entities"', () => {
    const { result } = setup()

    expect(result.current.typeFilter).toBe('All Entities')
  })

  it('currentPage padrão é 1', () => {
    const { result } = setup()

    expect(result.current.currentPage).toBe(1)
  })

  it('pageSize é 10', () => {
    const { result } = setup()

    expect(result.current.pageSize).toBe(10)
  })
})

// ── 4.2 Toggle de aba ─────────────────────────────────────────────────────────

describe('useClientsFilters — 4.2 Toggle de aba', () => {
  it('aba "clientes" retorna somente entityKind === "cliente"', () => {
    const { result } = setup()

    // activeTab já é 'clientes' por padrão + statusFilter 'Active Only' aplicado
    // Desativar statusFilter para testar só o toggle
    act(() => {
      result.current.setStatusFilter('All')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.entityKind).toBe('cliente')
    }
  })

  it('aba "fornecedores" retorna somente entityKind === "fornecedor"', () => {
    const { result } = setup()

    act(() => {
      result.current.setActiveTab('fornecedores')
      result.current.setStatusFilter('All')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.entityKind).toBe('fornecedor')
    }
  })

  it('trocar aba reseta currentPage para 1', () => {
    const { result } = setup()

    act(() => {
      result.current.setCurrentPage(2)
    })
    expect(result.current.currentPage).toBe(2)

    act(() => {
      result.current.setActiveTab('fornecedores')
    })
    expect(result.current.currentPage).toBe(1)
  })

  it('contador filteredCount muda ao trocar aba', () => {
    const { result } = setup()

    const clientesCount = result.current.filteredCount

    act(() => {
      result.current.setActiveTab('fornecedores')
    })

    const fornecedoresCount = result.current.filteredCount

    // clientes e fornecedores têm quantidades diferentes no mock
    expect(clientesCount).not.toBe(fornecedoresCount)
    expect(clientesCount + fornecedoresCount).toBeGreaterThan(0)
  })
})

// ── 4.1 Busca textual ─────────────────────────────────────────────────────────

describe('useClientsFilters — 4.1 Busca textual (após debounce)', () => {
  it('busca por "Turbo" retorna somente "Turbo Dynamics Inc."', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('Turbo')
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
    })

    // Avançar o debounce de 300ms
    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredEntities).toHaveLength(1)
    expect(result.current.filteredEntities[0].name).toBe('Turbo Dynamics Inc.')
  })

  it('filteredCount muda para 1 ao buscar "Turbo"', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('Turbo')
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredCount).toBe(1)
  })

  it('busca por taxId filtra corretamente', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('458.122.903-22')
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredEntities).toHaveLength(1)
    expect(result.current.filteredEntities[0].name).toBe('Juliana Mendes')
  })

  it('busca por email filtra corretamente', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('ops@globalhub')
      result.current.setStatusFilter('All')
      result.current.setActiveTab('fornecedores')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredEntities).toHaveLength(1)
    expect(result.current.filteredEntities[0].name).toBe('Global Logistics Hub')
  })

  it('busca case-insensitive ("turbo" encontra "Turbo Dynamics")', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('turbo')
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredEntities.length).toBeGreaterThan(0)
    expect(result.current.filteredEntities[0].name).toBe('Turbo Dynamics Inc.')
  })

  it('busca sem resultados retorna array vazio', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('xyzzy-não-existe-123')
      result.current.setStatusFilter('All')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredEntities).toHaveLength(0)
    expect(result.current.filteredCount).toBe(0)
  })

  it('digitar reseta currentPage para 1 após debounce', async () => {
    const { result } = setup()

    act(() => {
      result.current.setCurrentPage(2)
    })

    act(() => {
      result.current.setSearchQuery('Turbo')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.currentPage).toBe(1)
  })
})

// ── 4.3 Dropdown STATUS ───────────────────────────────────────────────────────

describe('useClientsFilters — 4.3 Dropdown STATUS', () => {
  it('"Active Only" retorna somente entidades ativas', () => {
    const { result } = setup()

    act(() => {
      result.current.setActiveTab('clientes')
      result.current.setStatusFilter('Active Only')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.status).toBe('active')
    }
  })

  it('"Inactive" retorna somente entidades inativas', () => {
    const { result } = setup()

    act(() => {
      result.current.setActiveTab('clientes')
      result.current.setStatusFilter('Inactive')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.status).toBe('inactive')
    }
  })

  it('"All" não filtra por status', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('Active Only')
      result.current.setActiveTab('clientes')
    })
    const activeCount = result.current.filteredCount

    act(() => {
      result.current.setStatusFilter('All')
    })
    const allCount = result.current.filteredCount

    // "All" inclui inativos, portanto count >= activeCount
    expect(allCount).toBeGreaterThanOrEqual(activeCount)
  })

  it('trocar statusFilter reseta currentPage para 1', () => {
    const { result } = setup()

    act(() => {
      result.current.setCurrentPage(2)
    })

    act(() => {
      result.current.setStatusFilter('Inactive')
    })

    expect(result.current.currentPage).toBe(1)
  })
})

// ── 4.3 Dropdown BALANCE ──────────────────────────────────────────────────────

describe('useClientsFilters — 4.3 Dropdown BALANCE', () => {
  it('"Credit OK" retorna somente financialStatus === "credit_ok"', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
      result.current.setBalanceFilter('Credit OK')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.financialStatus).toBe('credit_ok')
    }
  })

  it('"Balance Due" retorna somente financialStatus === "due"', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
      result.current.setBalanceFilter('Balance Due')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.financialStatus).toBe('due')
    }
  })

  it('"Prepaid" retorna somente financialStatus === "prepaid"', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
      result.current.setBalanceFilter('Prepaid')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.financialStatus).toBe('prepaid')
    }
  })

  it('trocar balanceFilter reseta currentPage para 1', () => {
    const { result } = setup()

    act(() => {
      result.current.setCurrentPage(2)
    })

    act(() => {
      result.current.setBalanceFilter('Balance Due')
    })

    expect(result.current.currentPage).toBe(1)
  })
})

// ── 4.3 Filtros cumulativos ───────────────────────────────────────────────────

describe('useClientsFilters — 4.3 Filtros cumulativos', () => {
  it('STATUS "Active Only" + BALANCE "Balance Due" exibe somente Juliana Mendes', () => {
    const { result } = setup()

    // Configurar: aba clientes + active + due
    act(() => {
      result.current.setActiveTab('clientes')
      result.current.setStatusFilter('Active Only')
      result.current.setBalanceFilter('Balance Due')
    })

    const names = result.current.filteredEntities.map((e) => e.name)
    expect(names).toContain('Juliana Mendes')
    // Não deve retornar entidades com outros statuses financeiros
    for (const entity of result.current.filteredEntities) {
      expect(entity.status).toBe('active')
      expect(entity.financialStatus).toBe('due')
      expect(entity.entityKind).toBe('cliente')
    }
  })

  it('STATUS "Inactive" + BALANCE "Any" retorna somente inativos', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
      result.current.setStatusFilter('Inactive')
      result.current.setActiveTab('clientes')
    })

    for (const entity of result.current.filteredEntities) {
      expect(entity.status).toBe('inactive')
    }
  })

  it('filtros e busca textual se combinam corretamente', async () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
      result.current.setActiveTab('clientes')
      result.current.setBalanceFilter('Balance Due')
      result.current.setSearchQuery('Juliana')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredEntities).toHaveLength(1)
    expect(result.current.filteredEntities[0].name).toBe('Juliana Mendes')
  })
})

// ── Paginação ─────────────────────────────────────────────────────────────────

describe('useClientsFilters — paginação', () => {
  it('pagedEntities tem no máximo pageSize itens', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
    })

    expect(result.current.pagedEntities.length).toBeLessThanOrEqual(result.current.pageSize)
  })

  it('totalPages é calculado corretamente', () => {
    const { result } = setup()

    act(() => {
      result.current.setStatusFilter('All')
    })

    const expected = Math.max(1, Math.ceil(result.current.filteredCount / result.current.pageSize))
    expect(result.current.totalPages).toBe(expected)
  })

  it('totalPages é no mínimo 1 quando não há resultados', async () => {
    const { result } = setup()

    act(() => {
      result.current.setSearchQuery('xyzzy-sem-resultado')
      result.current.setStatusFilter('All')
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 350))
    })

    expect(result.current.filteredCount).toBe(0)
    expect(result.current.totalPages).toBe(1)
  })
})
