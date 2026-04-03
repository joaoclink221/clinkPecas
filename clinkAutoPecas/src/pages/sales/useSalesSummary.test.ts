import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { salesKpiMock } from './mock-data'
import type { Sale } from './sales.types'
import { useSalesSummary } from './useSalesSummary'

const pendingSale: Sale = {
  id: 'VD-NEW-1',
  customerName: 'Cliente Novo',
  customerDoc: '000.000.000-00',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'Pix',
  discount: 0,
  totalValue: 500,
  status: 'pending',
}

const completedSale: Sale = {
  ...pendingSale,
  id: 'VD-NEW-2',
  status: 'completed',
  totalValue: 1200,
}

describe('useSalesSummary — modo mock', () => {
  it('retorna os valores base de salesKpiMock quando não há extras', () => {
    const { result } = renderHook(() => useSalesSummary())

    expect(result.current.summary).toEqual(salesKpiMock)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('incrementa pendingOrders quando venda pendente é adicionada', () => {
    const { result } = renderHook(() => useSalesSummary([pendingSale]))

    expect(result.current.summary.pendingOrders).toBe(salesKpiMock.pendingOrders + 1)
  })

  it('incrementa monthlyRevenue quando venda completed é adicionada', () => {
    const { result } = renderHook(() => useSalesSummary([completedSale]))

    expect(result.current.summary.monthlyRevenue).toBe(
      salesKpiMock.monthlyRevenue + completedSale.totalValue,
    )
  })

  it('venda pending NÃO altera monthlyRevenue', () => {
    const { result } = renderHook(() => useSalesSummary([pendingSale]))

    expect(result.current.summary.monthlyRevenue).toBe(salesKpiMock.monthlyRevenue)
  })

  it('trends permanecem estáticos independente dos extras', () => {
    const { result } = renderHook(() =>
      useSalesSummary([pendingSale, completedSale]),
    )

    expect(result.current.summary.trends).toEqual(salesKpiMock.trends)
  })

  it('acumula múltiplas vendas extras corretamente', () => {
    const sales = [pendingSale, pendingSale, completedSale]
    const { result } = renderHook(() => useSalesSummary(sales))

    expect(result.current.summary.pendingOrders).toBe(salesKpiMock.pendingOrders + 2)
    expect(result.current.summary.monthlyRevenue).toBe(
      salesKpiMock.monthlyRevenue + completedSale.totalValue,
    )
  })

  it('exposé refetch como função', () => {
    const { result } = renderHook(() => useSalesSummary())

    expect(typeof result.current.refetch).toBe('function')
  })
})
