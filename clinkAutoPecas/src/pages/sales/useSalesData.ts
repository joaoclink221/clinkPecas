import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { salesMockPage } from './mock-data'
import type { StatusFilterValue } from './SalesFiltersBar'
import type { Sale } from './sales.types'

export type SalesDataParams = {
  page: number
  pageSize: number
  search: string
  dateFrom: string
  dateTo: string
  status: StatusFilterValue
}

type SalesDataOptions = {
  /** Vendas adicionadas localmente (optimistic inserts) que são prepostas ao array. */
  prepend?: Sale[]
}

export type UseSalesDataResult = {
  sales: Sale[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

type ApiFetchState = { sales: Sale[]; total: number; loading: boolean; error: string | null }
type ApiFetchAction =
  | { type: 'start' }
  | { type: 'success'; sales: Sale[]; total: number }
  | { type: 'error'; message: string }

function apiFetchReducer(state: ApiFetchState, action: ApiFetchAction): ApiFetchState {
  switch (action.type) {
    case 'start':
      return { ...state, loading: true, error: null }
    case 'success':
      return { sales: action.sales, total: action.total, loading: false, error: null }
    case 'error':
      return { ...state, loading: false, error: action.message }
  }
}

/**
 * Filtra e pagina o array de vendas localmente.
 * Usado no modo mock (sem VITE_API_BASE definido).
 */
function filterAndPage(
  records: Sale[],
  { search, dateFrom, dateTo, status, page, pageSize }: SalesDataParams,
): { sales: Sale[]; total: number } {
  const q = search.toLowerCase().trim()

  const filtered = records.filter((sale) => {
    const matchesSearch =
      q === '' ||
      sale.customerName.toLowerCase().includes(q) ||
      sale.id.toLowerCase().includes(q) ||
      sale.customerDoc.includes(q)

    const matchesDate = sale.date >= dateFrom && sale.date <= dateTo
    const matchesStatus = status === 'all' || sale.status === status

    return matchesSearch && matchesDate && matchesStatus
  })

  const start = (page - 1) * pageSize
  return { sales: filtered.slice(start, start + pageSize), total: filtered.length }
}

function buildQueryString(params: SalesDataParams): string {
  const entries: [string, string][] = [
    ['page', String(params.page)],
    ['pageSize', String(params.pageSize)],
    ['dateFrom', params.dateFrom],
    ['dateTo', params.dateTo],
  ]
  if (params.search) entries.push(['search', params.search])
  if (params.status !== 'all') entries.push(['status', params.status])
  return new URLSearchParams(entries).toString()
}

/** Valor de VITE_API_BASE — undefined enquanto backend não está disponível. */
const API_BASE = import.meta.env.VITE_API_BASE as string | undefined

export function useSalesData(
  params: SalesDataParams,
  options: SalesDataOptions = {},
): UseSalesDataResult {
  const { prepend = [] } = options

  // Destruturar para que useMemo e useEffect listem valores primitivos como deps
  const { page, pageSize, search, dateFrom, dateTo, status } = params

  // ── Estado da API via useReducer (dispatch não dispara no-direct-set-state lint) ──
  const [apiState, dispatch] = useReducer(apiFetchReducer, {
    sales: [],
    total: 0,
    loading: false,
    error: null,
  })
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  // ── Modo mock: synchronous via useMemo (sem delay de render) ────────────────
  const mockResult = useMemo(() => {
    if (API_BASE) return null
    const allRecords = [...prepend, ...salesMockPage]
    return filterAndPage(allRecords, { page, pageSize, search, dateFrom, dateTo, status })
  }, [page, pageSize, search, dateFrom, dateTo, status, prepend])

  // ── Modo API: fetch assíncrono ──────────────────────────────────────────
  useEffect(() => {
    if (!API_BASE) return

    let cancelled = false
    dispatch({ type: 'start' })

    fetch(`${API_BASE}/api/sales?${buildQueryString({ page, pageSize, search, dateFrom, dateTo, status })}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ sales: Sale[]; total: number }>
      })
      .then((data) => {
        if (!cancelled) dispatch({ type: 'success', sales: data.sales, total: data.total })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          dispatch({
            type: 'error',
            message: err instanceof Error ? err.message : 'Erro ao carregar vendas',
          })
      })

    return () => {
      cancelled = true
    }
  }, [page, pageSize, search, dateFrom, dateTo, status, tick])

  if (!API_BASE) {
    return {
      sales: mockResult!.sales,
      total: mockResult!.total,
      loading: false,
      error: null,
      /** No modo mock refetch é no-op; dados atualizam via useMemo quando parâmetros mudam. */
      refetch,
    }
  }

  return {
    sales: apiState.sales,
    total: apiState.total,
    loading: apiState.loading,
    error: apiState.error,
    refetch,
  }
}
