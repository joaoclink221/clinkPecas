import { useEffect, useMemo, useState } from 'react'

import { purchasesMockPage } from './mock-data'
import type { PurchaseOrder, PurchaseStatus } from './purchases.types'

// ── Tipos exportados ──────────────────────────────────────────────────────────

export type PurchaseStatusFilter = PurchaseStatus | 'all'

export type UsePurchasesFiltersReturn = {
  /** Texto atual do campo de busca (valor imediato, sem debounce). */
  searchQuery: string
  setSearchQuery: (value: string) => void

  /** Filtro de status selecionado. */
  statusFilter: PurchaseStatusFilter
  setStatusFilter: (value: PurchaseStatusFilter) => void

  /** Data inicial do intervalo (ISO "YYYY-MM-DD" ou string vazia). */
  dateFrom: string
  setDateFrom: (value: string) => void

  /** Data final do intervalo (ISO "YYYY-MM-DD" ou string vazia). */
  dateTo: string
  setDateTo: (value: string) => void

  /** Se o painel de filtros está aberto. */
  isFiltersOpen: boolean
  toggleFilters: () => void
  closeFilters: () => void

  /** Array de ordens após aplicar todos os filtros ativos. */
  filteredOrders: PurchaseOrder[]

  /**
   * Número de filtros ativos (excluindo a busca textual).
   * Usado para exibir badge no botão "Filtros".
   */
  activeFilterCount: number

  /** Reseta status, datas e fecha o painel. Não limpa a busca textual. */
  clearFilters: () => void

  // ── 5.1 Paginação ──────────────────────────────────────────────────────

  /** Página atual (1-indexed). Reseta para 1 ao mudar qualquer filtro. */
  currentPage: number
  setCurrentPage: (page: number) => void

  /** Número de itens por página (fixo em 5). */
  pageSize: number

  /** Slice de filteredOrders correspondente à página atual. */
  paginatedOrders: PurchaseOrder[]

  /** Total de páginas dado filteredOrders.length e pageSize. */
  totalPages: number

  /** Total de registros no array filtrado (para exibir no contador). */
  totalFilteredCount: number
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 300
const PAGE_SIZE = 5

export function usePurchasesFilters(): UsePurchasesFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PurchaseStatusFilter>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce: atualiza debouncedSearch 300ms após última mudança; reseta página junto (5.1)
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [searchQuery])

  const filteredOrders = useMemo(() => {
    let result = purchasesMockPage

    // Filtro textual — busca em id e supplier (case-insensitive)
    if (debouncedSearch.trim() !== '') {
      const term = debouncedSearch.trim().toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          o.supplier.toLowerCase().includes(term),
      )
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter)
    }

    // Filtro de data inicial — issueDate >= dateFrom
    if (dateFrom !== '') {
      result = result.filter((o) => o.issueDate >= dateFrom)
    }

    // Filtro de data final — issueDate <= dateTo
    if (dateTo !== '') {
      result = result.filter((o) => o.issueDate <= dateTo)
    }

    return result
  }, [debouncedSearch, statusFilter, dateFrom, dateTo])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE)),
    [filteredOrders.length],
  )

  const paginatedOrders = useMemo(
    () => filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredOrders, currentPage],
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (statusFilter !== 'all') count += 1
    if (dateFrom !== '') count += 1
    if (dateTo !== '') count += 1
    return count
  }, [statusFilter, dateFrom, dateTo])

  // Wrappers de setters de filtro que resetam a página para 1 (5.1)
  function handleSetStatusFilter(value: PurchaseStatusFilter) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function handleSetDateFrom(value: string) {
    setDateFrom(value)
    setCurrentPage(1)
  }

  function handleSetDateTo(value: string) {
    setDateTo(value)
    setCurrentPage(1)
  }

  function toggleFilters() {
    setIsFiltersOpen((prev) => !prev)
  }

  function closeFilters() {
    setIsFiltersOpen(false)
  }

  function clearFilters() {
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
    setIsFiltersOpen(false)
  }

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    dateFrom,
    setDateFrom: handleSetDateFrom,
    dateTo,
    setDateTo: handleSetDateTo,
    isFiltersOpen,
    toggleFilters,
    closeFilters,
    filteredOrders,
    activeFilterCount,
    clearFilters,
    currentPage,
    setCurrentPage,
    pageSize: PAGE_SIZE,
    paginatedOrders,
    totalPages,
    totalFilteredCount: filteredOrders.length,
  }
}
