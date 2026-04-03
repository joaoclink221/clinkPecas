import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SalesFiltersBar } from './SalesFiltersBar'

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  onDateFromChange: vi.fn(),
  onDateToChange: vi.fn(),
  statusFilter: 'all' as const,
  onStatusChange: vi.fn(),
}

function renderBar(overrides = {}) {
  return render(<SalesFiltersBar {...defaultProps} {...overrides} />)
}

describe('SalesFiltersBar — renderização', () => {
  it('renderiza campo de busca com placeholder correto', () => {
    renderBar()

    expect(
      screen.getByPlaceholderText(/buscar por cliente, SKU ou ID do pedido/i),
    ).toBeInTheDocument()
  })

  it('campo de busca é acessível por aria-label', () => {
    renderBar()

    expect(screen.getByRole('searchbox', { name: /buscar vendas/i })).toBeInTheDocument()
  })

  it('renderiza inputs de data inicial e final', () => {
    renderBar()

    expect(screen.getByLabelText('Data inicial')).toBeInTheDocument()
    expect(screen.getByLabelText('Data final')).toBeInTheDocument()
  })

  it('renderiza dropdown de status com todas as opções', () => {
    renderBar()

    const select = screen.getByRole('combobox', { name: /filtrar por status/i })
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Todos Status' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Completed' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pending' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Cancelled' })).toBeInTheDocument()
  })

  it('renderiza botão de filtros avançados (visual only)', () => {
    renderBar()

    expect(screen.getByRole('button', { name: /filtros avançados/i })).toBeInTheDocument()
  })

  it('a barra tem role="search" acessível', () => {
    renderBar()

    expect(screen.getByRole('search', { name: /filtros de vendas/i })).toBeInTheDocument()
  })
})

describe('SalesFiltersBar — interações', () => {
  it('chama onSearchChange ao digitar no campo de busca', () => {
    const onSearchChange = vi.fn()
    renderBar({ onSearchChange })

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Apex' } })

    expect(onSearchChange).toHaveBeenCalledWith('Apex')
  })

  it('chama onStatusChange ao selecionar "Pending"', async () => {
    const onStatusChange = vi.fn()
    renderBar({ onStatusChange })

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'pending',
    )

    expect(onStatusChange).toHaveBeenCalledWith('pending')
  })

  it('chama onDateFromChange ao alterar data inicial', () => {
    const onDateFromChange = vi.fn()
    renderBar({ onDateFromChange })

    fireEvent.change(screen.getByLabelText('Data inicial'), { target: { value: '2024-03-01' } })

    expect(onDateFromChange).toHaveBeenCalledWith('2024-03-01')
  })

  it('reflete o valor de searchQuery recebido via prop', () => {
    renderBar({ searchQuery: 'Apex' })

    expect(screen.getByRole('searchbox')).toHaveValue('Apex')
  })

  it('reflete o statusFilter recebido via prop', () => {
    renderBar({ statusFilter: 'pending' as const })

    expect(screen.getByRole('combobox', { name: /filtrar por status/i })).toHaveValue('pending')
  })
})
