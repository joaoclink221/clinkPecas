import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { purchasesMockPage } from './mock-data'
import { usePurchasesFilters } from './usePurchasesFilters'

// ── Estado inicial ────────────────────────────────────────────────────────────

describe('usePurchasesFilters — estado inicial', () => {
  it('retorna todos os 15 registros do mock sem filtros', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.filteredOrders).toHaveLength(purchasesMockPage.length)
  })

  it('searchQuery começa vazia', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.searchQuery).toBe('')
  })

  it('statusFilter começa como "all"', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.statusFilter).toBe('all')
  })

  it('dateFrom e dateTo começam vazios', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.dateFrom).toBe('')
    expect(result.current.dateTo).toBe('')
  })

  it('isFiltersOpen começa false', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.isFiltersOpen).toBe(false)
  })

  it('activeFilterCount começa em 0', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.activeFilterCount).toBe(0)
  })
})

// ── 4.1 Busca textual com debounce ────────────────────────────────────────────

describe('usePurchasesFilters — 4.1 Busca textual', () => {
  it('digitar "Bosch Global" exibe só PUR-8821 após debounce', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('Bosch Global') })
    // Antes do debounce: ainda mostra todos
    expect(result.current.filteredOrders).toHaveLength(purchasesMockPage.length)

    // Avança 300ms (debounce)
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(result.current.filteredOrders).toHaveLength(1)
    expect(result.current.filteredOrders[0].id).toBe('PUR-8821')

    vi.useRealTimers()
  })

  it('busca por "Bosch" bate em 2 fornecedores (PUR-8821 e PUR-8810)', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('Bosch') })
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(result.current.filteredOrders).toHaveLength(2)
    const ids = result.current.filteredOrders.map((o) => o.id)
    expect(ids).toContain('PUR-8821')
    expect(ids).toContain('PUR-8810')

    vi.useRealTimers()
  })

  it('busca por ID "PUR-8851" retorna exatamente 1 resultado', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('PUR-8851') })
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(result.current.filteredOrders).toHaveLength(1)
    expect(result.current.filteredOrders[0].id).toBe('PUR-8851')

    vi.useRealTimers()
  })

  it('busca case-insensitive: "bosch" e "BOSCH" retornam o mesmo resultado', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('bosch') })
    await act(async () => { vi.advanceTimersByTime(300) })
    const lowercase = result.current.filteredOrders.length

    act(() => { result.current.setSearchQuery('BOSCH') })
    await act(async () => { vi.advanceTimersByTime(300) })
    const uppercase = result.current.filteredOrders.length

    expect(lowercase).toBe(uppercase)

    vi.useRealTimers()
  })

  it('busca por termo inexistente retorna array vazio', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('xyz-inexistente-999') })
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(result.current.filteredOrders).toHaveLength(0)

    vi.useRealTimers()
  })

  it('limpar a busca restaura todos os registros', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('Bosch Global') })
    await act(async () => { vi.advanceTimersByTime(300) })
    expect(result.current.filteredOrders).toHaveLength(1)

    act(() => { result.current.setSearchQuery('') })
    await act(async () => { vi.advanceTimersByTime(300) })
    expect(result.current.filteredOrders).toHaveLength(purchasesMockPage.length)

    vi.useRealTimers()
  })

  it('debounce: filtro NÃO aplica antes de 300ms', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('Bosch') })
    // Avança só 299ms — não deve ter filtrado ainda
    await act(async () => { vi.advanceTimersByTime(299) })

    expect(result.current.filteredOrders).toHaveLength(purchasesMockPage.length)

    vi.useRealTimers()
  })
})

// ── 4.2 Filtro de status ──────────────────────────────────────────────────────

describe('usePurchasesFilters — 4.2 Filtro de status', () => {
  it('selecionar "pending" exibe PUR-8845 e PUR-8851 (entre os 5 de referência)', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('pending') })

    const pendingIds = result.current.filteredOrders.map((o) => o.id)
    expect(pendingIds).toContain('PUR-8845')
    expect(pendingIds).toContain('PUR-8851')
    expect(result.current.filteredOrders.every((o) => o.status === 'pending')).toBe(true)
  })

  it('selecionar "received" mostra só ordens received', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('received') })

    expect(result.current.filteredOrders.every((o) => o.status === 'received')).toBe(true)
    expect(result.current.filteredOrders.length).toBeGreaterThan(0)
  })

  it('selecionar "cancelled" mostra só ordens cancelled', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('cancelled') })

    expect(result.current.filteredOrders.every((o) => o.status === 'cancelled')).toBe(true)
    expect(result.current.filteredOrders.length).toBeGreaterThan(0)
  })

  it('selecionar "all" restaura todos os registros', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('pending') })
    act(() => { result.current.setStatusFilter('all') })

    expect(result.current.filteredOrders).toHaveLength(purchasesMockPage.length)
  })

  it('activeFilterCount é 1 quando status != "all"', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('pending') })

    expect(result.current.activeFilterCount).toBe(1)
  })
})

// ── 4.2 Filtro de intervalo de datas ─────────────────────────────────────────

describe('usePurchasesFilters — 4.2 Filtro de datas', () => {
  it('dateFrom filtra ordens com issueDate >= data inicial', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setDateFrom('2023-10-15') })

    for (const order of result.current.filteredOrders) {
      expect(order.issueDate >= '2023-10-15').toBe(true)
    }
  })

  it('dateTo filtra ordens com issueDate <= data final', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setDateTo('2023-10-10') })

    for (const order of result.current.filteredOrders) {
      expect(order.issueDate <= '2023-10-10').toBe(true)
    }
  })

  it('intervalo fechado retorna somente ordens dentro do intervalo', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => {
      result.current.setDateFrom('2023-10-12')
      result.current.setDateTo('2023-10-14')
    })

    for (const order of result.current.filteredOrders) {
      expect(order.issueDate >= '2023-10-12').toBe(true)
      expect(order.issueDate <= '2023-10-14').toBe(true)
    }
    // PUR-8821 (12), PUR-8845 (14) devem estar incluídos
    const ids = result.current.filteredOrders.map((o) => o.id)
    expect(ids).toContain('PUR-8821')
    expect(ids).toContain('PUR-8845')
  })

  it('activeFilterCount acumula status + dateFrom + dateTo', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => {
      result.current.setStatusFilter('pending')
      result.current.setDateFrom('2023-10-01')
      result.current.setDateTo('2023-10-31')
    })

    expect(result.current.activeFilterCount).toBe(3)
  })
})

// ── Filtros combinados ────────────────────────────────────────────────────────

describe('usePurchasesFilters — filtros combinados', () => {
  it('busca "Continental" + status "pending" retorna só PUR-8845', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => {
      result.current.setSearchQuery('Continental')
      result.current.setStatusFilter('pending')
    })
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(result.current.filteredOrders).toHaveLength(1)
    expect(result.current.filteredOrders[0].id).toBe('PUR-8845')

    vi.useRealTimers()
  })
})

// ── 5.1 Paginação ─────────────────────────────────────────────────────────────

describe('usePurchasesFilters — 5.1 Paginação', () => {
  it('currentPage começa em 1', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.currentPage).toBe(1)
  })

  it('pageSize é 5', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.pageSize).toBe(5)
  })

  it('paginatedOrders na página 1 contém os 5 primeiros do mock (sem filtro)', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.paginatedOrders).toHaveLength(5)
    expect(result.current.paginatedOrders[0].id).toBe(purchasesMockPage[0].id)
    expect(result.current.paginatedOrders[4].id).toBe(purchasesMockPage[4].id)
  })

  it('página 2 exibe os próximos 5 registros do mock', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setCurrentPage(2) })

    expect(result.current.paginatedOrders).toHaveLength(5)
    expect(result.current.paginatedOrders[0].id).toBe(purchasesMockPage[5].id)
    expect(result.current.paginatedOrders[4].id).toBe(purchasesMockPage[9].id)
  })

  it('página 3 exibe os últimos 5 registros do mock (15 total)', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setCurrentPage(3) })

    expect(result.current.paginatedOrders).toHaveLength(5)
    expect(result.current.paginatedOrders[0].id).toBe(purchasesMockPage[10].id)
    expect(result.current.paginatedOrders[4].id).toBe(purchasesMockPage[14].id)
  })

  it('totalPages = 3 para 15 registros com pageSize = 5', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.totalPages).toBe(3)
  })

  it('totalFilteredCount = 15 sem filtros ativos', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    expect(result.current.totalFilteredCount).toBe(purchasesMockPage.length)
  })

  it('totalFilteredCount reflete o número de ordens após filtro de status', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('received') })

    const receivedCount = purchasesMockPage.filter((o) => o.status === 'received').length
    expect(result.current.totalFilteredCount).toBe(receivedCount)
  })

  it('totalPages = 1 quando totalFilteredCount <= 5', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setStatusFilter('cancelled') })

    expect(result.current.totalPages).toBe(1)
  })

  it('selecionar status reseta currentPage para 1', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setCurrentPage(2) })
    expect(result.current.currentPage).toBe(2)

    act(() => { result.current.setStatusFilter('pending') })
    expect(result.current.currentPage).toBe(1)
  })

  it('setDateFrom reseta currentPage para 1', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setCurrentPage(2) })
    act(() => { result.current.setDateFrom('2023-10-01') })

    expect(result.current.currentPage).toBe(1)
  })

  it('setDateTo reseta currentPage para 1', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setCurrentPage(2) })
    act(() => { result.current.setDateTo('2023-10-31') })

    expect(result.current.currentPage).toBe(1)
  })

  it('clearFilters reseta currentPage para 1', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => {
      result.current.setStatusFilter('pending')
      result.current.setCurrentPage(2)
    })
    // Avança para garantir que setCurrentPage foi para 2 antes de clearFilters
    act(() => { result.current.clearFilters() })

    expect(result.current.currentPage).toBe(1)
  })

  it('busca textual (debounce) reseta currentPage para 1', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setCurrentPage(2) })
    expect(result.current.currentPage).toBe(2)

    act(() => { result.current.setSearchQuery('Bosch') })
    await act(async () => { vi.advanceTimersByTime(300) })

    expect(result.current.currentPage).toBe(1)

    vi.useRealTimers()
  })
})

// ── toggleFilters / closeFilters ──────────────────────────────────────────────

describe('usePurchasesFilters — painel de filtros', () => {
  it('toggleFilters alterna isFiltersOpen', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.toggleFilters() })
    expect(result.current.isFiltersOpen).toBe(true)

    act(() => { result.current.toggleFilters() })
    expect(result.current.isFiltersOpen).toBe(false)
  })

  it('closeFilters fecha o painel independente do estado', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.toggleFilters() })
    expect(result.current.isFiltersOpen).toBe(true)

    act(() => { result.current.closeFilters() })
    expect(result.current.isFiltersOpen).toBe(false)
  })

  it('clearFilters reseta status, datas e fecha o painel', () => {
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => {
      result.current.setStatusFilter('pending')
      result.current.setDateFrom('2023-10-01')
      result.current.setDateTo('2023-10-31')
      result.current.toggleFilters()
    })

    act(() => { result.current.clearFilters() })

    expect(result.current.statusFilter).toBe('all')
    expect(result.current.dateFrom).toBe('')
    expect(result.current.dateTo).toBe('')
    expect(result.current.isFiltersOpen).toBe(false)
    expect(result.current.activeFilterCount).toBe(0)
  })

  it('clearFilters não limpa a busca textual', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePurchasesFilters())

    act(() => { result.current.setSearchQuery('Bosch') })
    await act(async () => { vi.advanceTimersByTime(300) })

    act(() => { result.current.clearFilters() })

    expect(result.current.searchQuery).toBe('Bosch')

    vi.useRealTimers()
  })
})
