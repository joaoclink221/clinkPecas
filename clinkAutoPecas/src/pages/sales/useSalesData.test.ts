import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { salesMockPage } from './mock-data'
import { useSalesData } from './useSalesData'

const BASE_PARAMS = {
  page: 1,
  pageSize: 10,
  search: '',
  dateFrom: '2024-01-01',
  dateTo: '2024-03-31',
  status: 'all' as const,
}

describe('useSalesData — modo mock (sem VITE_API_BASE)', () => {
  it('retorna sales e total para o intervalo completo', () => {
    const { result } = renderHook(() => useSalesData(BASE_PARAMS))

    expect(result.current.sales).toHaveLength(10)
    expect(result.current.total).toBe(45)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('filtra por nome do cliente (case-insensitive)', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, search: 'apex' }),
    )

    result.current.sales.forEach((s) =>
      expect(s.customerName.toLowerCase()).toContain('apex'),
    )
  })

  it('filtra por ID do pedido', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, search: 'VD-001' }),
    )

    expect(result.current.sales).toHaveLength(1)
    expect(result.current.sales[0].id).toBe('VD-001')
  })

  it('filtra por status completed', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, status: 'completed' }),
    )

    result.current.sales.forEach((s) => expect(s.status).toBe('completed'))
  })

  it('restringe por dateFrom/dateTo', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, dateFrom: '2024-01-01', dateTo: '2024-01-31' }),
    )

    expect(result.current.total).toBe(3)
    result.current.sales.forEach((s) => {
      expect(s.date >= '2024-01-01').toBe(true)
      expect(s.date <= '2024-01-31').toBe(true)
    })
  })

  it('pagina corretamente: página 2 traz os registros 11-20', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, page: 2, pageSize: 10 }),
    )

    expect(result.current.sales).toHaveLength(10)
    expect(result.current.total).toBe(45)
  })

  it('última página traz apenas os registros restantes', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, page: 5, pageSize: 10 }),
    )

    // 45 records → page 5 has 5 records
    expect(result.current.sales).toHaveLength(5)
  })

  it('retorna vazio quando busca não tem correspondência', () => {
    const { result } = renderHook(() =>
      useSalesData({ ...BASE_PARAMS, search: 'xyzxyzxyz_inexistente' }),
    )

    expect(result.current.sales).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  it('prepend adiciona vendas extras no início do resultado', () => {
    const extraSale = { ...salesMockPage[0], id: 'VD-EXTRA' }

    const { result } = renderHook(() =>
      useSalesData(
        { ...BASE_PARAMS, pageSize: 20 },
        { prepend: [extraSale] },
      ),
    )

    expect(result.current.sales[0].id).toBe('VD-EXTRA')
    expect(result.current.total).toBe(46)
  })
})
