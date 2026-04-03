import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InventoryMixChart } from './InventoryMixChart'

describe('InventoryMixChart', () => {
  it('renderiza o título do widget', () => {
    render(<InventoryMixChart />)

    expect(screen.getByText(/inventory mix/i)).toBeInTheDocument()
  })

  it('exibe as 4 categorias na legenda', () => {
    render(<InventoryMixChart />)

    expect(screen.getByText('Engines')).toBeInTheDocument()
    expect(screen.getByText('Tires')).toBeInTheDocument()
    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Others')).toBeInTheDocument()
  })

  it('exibe o total central "8.4k"', () => {
    render(<InventoryMixChart />)

    expect(screen.getByText('8.4k')).toBeInTheDocument()
  })

  it('a lista de categorias tem rótulo acessível', () => {
    render(<InventoryMixChart />)

    expect(screen.getByRole('list', { name: /categorias do inventário/i })).toBeInTheDocument()
  })

  it('renderiza 4 itens na legenda', () => {
    render(<InventoryMixChart />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(4)
  })
})
