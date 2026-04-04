import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InventorySearchBar } from './InventorySearchBar'

function renderBar(overrides?: Partial<Parameters<typeof InventorySearchBar>[0]>) {
  const onSearchChange = vi.fn()
  const onFiltersToggle = vi.fn()
  const onExport = vi.fn()

  render(
    <InventorySearchBar
      searchQuery={overrides?.searchQuery ?? ''}
      onSearchChange={overrides?.onSearchChange ?? onSearchChange}
      filtersOpen={overrides?.filtersOpen ?? false}
      onFiltersToggle={overrides?.onFiltersToggle ?? onFiltersToggle}
      onExport={overrides?.onExport ?? onExport}
    />,
  )

  return { onSearchChange, onFiltersToggle, onExport }
}

describe('InventorySearchBar — 3.1 Input de busca', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renderiza o input com placeholder correto', () => {
    renderBar()

    expect(
      screen.getByPlaceholderText(/buscar por peça, sku ou categoria/i),
    ).toBeInTheDocument()
  })

  it('input tem role searchbox e aria-label acessível', () => {
    renderBar()

    expect(
      screen.getByRole('searchbox', { name: /buscar por peça, sku ou categoria/i }),
    ).toBeInTheDocument()
  })

  it('exibe o valor controlado vindo da prop searchQuery', () => {
    renderBar({ searchQuery: 'OB-99' })

    expect(screen.getByRole('searchbox')).toHaveValue('OB-99')
  })

  it('chama onSearchChange ao digitar', () => {
    const { onSearchChange } = renderBar()

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'OB-99' } })

    expect(onSearchChange).toHaveBeenCalledWith('OB-99')
  })

  it('chama onSearchChange a cada keystroke (debounce é responsabilidade do consumidor)', () => {
    const { onSearchChange } = renderBar()
    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'O' } })
    fireEvent.change(input, { target: { value: 'OB' } })
    fireEvent.change(input, { target: { value: 'OB-' } })

    expect(onSearchChange).toHaveBeenCalledTimes(3)
  })
})

describe('InventorySearchBar — 3.2 Botão Filtros', () => {
  it('renderiza o botão "Filtros"', () => {
    renderBar()

    expect(screen.getByRole('button', { name: /abrir filtros/i })).toBeInTheDocument()
  })

  it('botão Filtros exibe o label visível "Filtros"', () => {
    renderBar()

    expect(screen.getByRole('button', { name: /abrir filtros/i })).toHaveTextContent('Filtros')
  })

  it('botão Filtros chama onFiltersToggle ao clicar', () => {
    const { onFiltersToggle } = renderBar()

    fireEvent.click(screen.getByRole('button', { name: /abrir filtros/i }))

    expect(onFiltersToggle).toHaveBeenCalledOnce()
  })

  it('clicar em Filtros múltiplas vezes não causa crash', () => {
    const { onFiltersToggle } = renderBar()
    const btn = screen.getByRole('button', { name: /abrir filtros/i })

    fireEvent.click(btn)
    fireEvent.click(btn)
    fireEvent.click(btn)

    expect(onFiltersToggle).toHaveBeenCalledTimes(3)
  })
})

describe('InventorySearchBar — 3.3 Botão Exportar', () => {
  it('renderiza o botão "Exportar"', () => {
    renderBar()

    expect(screen.getByRole('button', { name: /exportar dados/i })).toBeInTheDocument()
  })

  it('botão Exportar exibe o label visível "Exportar"', () => {
    renderBar()

    expect(screen.getByRole('button', { name: /exportar dados/i })).toHaveTextContent('Exportar')
  })

  it('botão Exportar chama onExport ao clicar', () => {
    const { onExport } = renderBar()

    fireEvent.click(screen.getByRole('button', { name: /exportar dados/i }))

    expect(onExport).toHaveBeenCalledOnce()
  })

  it('botões Filtros e Exportar coexistem sem conflito', () => {
    renderBar()

    expect(screen.getByRole('button', { name: /abrir filtros/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /exportar dados/i })).toBeInTheDocument()
  })
})
