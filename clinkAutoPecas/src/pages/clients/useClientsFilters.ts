import { useEffect, useMemo, useState } from 'react'

import type {
  ActiveTab,
  BalanceFilter,
  Entity,
  EntityStatusFilter,
  EntityTypeFilter,
} from './clients.types'

// ── Constantes ────────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 300
const PAGE_SIZE = 10

// ── Tipo de retorno ───────────────────────────────────────────────────────────

export interface UseClientsFiltersReturn {
  // Estado de busca
  searchQuery: string
  setSearchQuery: (value: string) => void

  // Toggle de aba
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void

  // Dropdowns de filtro
  typeFilter: EntityTypeFilter
  setTypeFilter: (value: EntityTypeFilter) => void

  statusFilter: EntityStatusFilter
  setStatusFilter: (value: EntityStatusFilter) => void

  balanceFilter: BalanceFilter
  setBalanceFilter: (value: BalanceFilter) => void

  // Paginação
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  pageSize: number

  // Resultados derivados
  /** Todas as entidades após filtragem (antes de paginar) */
  filteredEntities: Entity[]
  /** Entidades da página atual */
  pagedEntities: Entity[]
  /** Total de registros filtrados — usado no contador do header */
  filteredCount: number
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Centraliza toda a lógica de filtragem e paginação do módulo de Clientes.
 *
 * Filtragem é cumulativa: todos os filtros ativos se aplicam ao mesmo tempo.
 * Qualquer mudança de filtro reseta `currentPage` para 1.
 *
 * @param entities - Array base de entidades (geralmente `entitiesMock`)
 */
export function useClientsFilters(entities: Entity[]): UseClientsFiltersReturn {
  const [searchQuery, setSearchQueryRaw] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTabRaw] = useState<ActiveTab>('clientes')
  const [typeFilter, setTypeFilterRaw] = useState<EntityTypeFilter>('All Entities')
  const [statusFilter, setStatusFilterRaw] = useState<EntityStatusFilter>('Active Only')
  const [balanceFilter, setBalanceFilterRaw] = useState<BalanceFilter>('Any')
  const [currentPage, setCurrentPage] = useState(1)

  // ── Debounce da busca ──────────────────────────────────────────────────────

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [searchQuery])

  // ── Setters com reset de página ────────────────────────────────────────────

  function setSearchQuery(value: string) {
    setSearchQueryRaw(value)
    // currentPage resets via debounce effect
  }

  function setActiveTab(tab: ActiveTab) {
    setActiveTabRaw(tab)
    setCurrentPage(1)
  }

  function setTypeFilter(value: EntityTypeFilter) {
    setTypeFilterRaw(value)
    setCurrentPage(1)
  }

  function setStatusFilter(value: EntityStatusFilter) {
    setStatusFilterRaw(value)
    setCurrentPage(1)
  }

  function setBalanceFilter(value: BalanceFilter) {
    setBalanceFilterRaw(value)
    setCurrentPage(1)
  }

  // ── Pipeline de filtragem cumulativa ──────────────────────────────────────

  const filteredEntities = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim()

    return entities.filter((entity) => {
      // 1. Busca textual (name, taxId, email)
      if (q !== '') {
        const matchesSearch =
          entity.name.toLowerCase().includes(q) ||
          entity.taxId.toLowerCase().includes(q) ||
          entity.email.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }

      // 2. Toggle de aba (activeTab → entityKind)
      if (activeTab === 'clientes' && entity.entityKind !== 'cliente') return false
      if (activeTab === 'fornecedores' && entity.entityKind !== 'fornecedor') return false

      // 3. Dropdown TYPE (cumulativo com activeTab)
      if (typeFilter === 'Cliente' && entity.entityKind !== 'cliente') return false
      if (typeFilter === 'Fornecedor' && entity.entityKind !== 'fornecedor') return false

      // 4. Dropdown STATUS
      if (statusFilter === 'Active Only' && entity.status !== 'active') return false
      if (statusFilter === 'Inactive' && entity.status !== 'inactive') return false

      // 5. Dropdown BALANCE → financialStatus
      if (balanceFilter === 'Credit OK' && entity.financialStatus !== 'credit_ok') return false
      if (balanceFilter === 'Balance Due' && entity.financialStatus !== 'due') return false
      if (balanceFilter === 'Prepaid' && entity.financialStatus !== 'prepaid') return false

      return true
    })
  }, [entities, debouncedSearch, activeTab, typeFilter, statusFilter, balanceFilter])

  // ── Paginação ─────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredEntities.length / PAGE_SIZE))

  const pagedEntities = useMemo(
    () => filteredEntities.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredEntities, currentPage],
  )

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    balanceFilter,
    setBalanceFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize: PAGE_SIZE,
    filteredEntities,
    pagedEntities,
    filteredCount: filteredEntities.length,
  }
}
