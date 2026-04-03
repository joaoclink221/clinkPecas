import { useCallback, useEffect, useReducer, useMemo, useState } from 'react'

import { salesKpiMock } from './mock-data'
import type { Sale, SalesKpiMock } from './sales.types'

export type UseSalesSummaryResult = {
  summary: SalesKpiMock
  loading: boolean
  error: string | null
  refetch: () => void
}

type SummaryState = { summary: SalesKpiMock | null; loading: boolean; error: string | null }
type SummaryAction =
  | { type: 'start' }
  | { type: 'success'; summary: SalesKpiMock }
  | { type: 'error'; message: string }

function summaryReducer(state: SummaryState, action: SummaryAction): SummaryState {
  switch (action.type) {
    case 'start':
      return { ...state, loading: true, error: null }
    case 'success':
      return { summary: action.summary, loading: false, error: null }
    case 'error':
      return { ...state, loading: false, error: action.message }
  }
}

/** Recalcula os KPIs adicionando as vendas extras ao baseline de salesKpiMock. */
function computeWithExtras(extra: Sale[]): SalesKpiMock {
  if (extra.length === 0) return salesKpiMock

  const addedRevenue = extra
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.totalValue, 0)

  const addedPending = extra.filter((s) => s.status === 'pending').length

  return {
    ...salesKpiMock,
    monthlyRevenue: salesKpiMock.monthlyRevenue + addedRevenue,
    pendingOrders: salesKpiMock.pendingOrders + addedPending,
  }
}

/** Valor de VITE_API_BASE — undefined enquanto backend não está disponível. */
const API_BASE = import.meta.env.VITE_API_BASE as string | undefined

/**
 * Retorna o resumo de KPIs de vendas.
 * - Modo mock: recalcula a partir de salesKpiMock + extraSales (optimistic inserts).
 * - Modo API: busca de /api/sales/summary e invalida via refetch().
 */
export function useSalesSummary(extraSales: Sale[] = []): UseSalesSummaryResult {
  const [apiState, dispatch] = useReducer(summaryReducer, {
    summary: null,
    loading: false,
    error: null,
  })
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  // ── Modo mock: synchronous via useMemo ──────────────────────────────────
  const mockSummary = useMemo(() => {
    if (API_BASE) return null
    return computeWithExtras(extraSales)
  }, [extraSales])

  // ── Modo API: fetch assíncrono ───────────────────────────────────────────
  useEffect(() => {
    if (!API_BASE) return

    let cancelled = false
    dispatch({ type: 'start' })

    fetch(`${API_BASE}/api/sales/summary`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<SalesKpiMock>
      })
      .then((data) => {
        if (!cancelled) dispatch({ type: 'success', summary: data })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          dispatch({
            type: 'error',
            message: err instanceof Error ? err.message : 'Erro ao carregar resumo',
          })
      })

    return () => {
      cancelled = true
    }
  }, [tick])

  if (!API_BASE) {
    return {
      summary: mockSummary!,
      loading: false,
      error: null,
      refetch,
    }
  }

  return {
    summary: apiState.summary ?? salesKpiMock,
    loading: apiState.loading,
    error: apiState.error,
    refetch,
  }
}
