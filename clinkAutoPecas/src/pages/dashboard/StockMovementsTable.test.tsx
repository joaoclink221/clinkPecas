import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StockMovementsTable } from './StockMovementsTable'

describe('StockMovementsTable', () => {
  it('renderiza o título e link "Sync Logs"', () => {
    render(<StockMovementsTable />)

    expect(screen.getByText(/stock movements/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sync logs/i })).toHaveAttribute('href', '#')
  })

  it('exibe as 3 colunas do cabeçalho', () => {
    render(<StockMovementsTable />)

    expect(screen.getByRole('columnheader', { name: /part/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /qty/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument()
  })

  it('renderiza 5 linhas de dados mockados', () => {
    render(<StockMovementsTable />)

    const rows = screen.getAllByRole('row')
    // 1 header + 5 data rows
    expect(rows).toHaveLength(6)
  })

  it('exibe o nome da peça de uma linha', () => {
    render(<StockMovementsTable />)

    expect(screen.getByText('V8 Cylinder Block')).toBeInTheDocument()
    expect(screen.getByText('Brake Disc Ventilated')).toBeInTheDocument()
  })

  it('formata quantidade positiva com prefixo "+"', () => {
    render(<StockMovementsTable />)

    expect(screen.getByText('+4')).toBeInTheDocument()
    expect(screen.getByText('+50')).toBeInTheDocument()
  })

  it('exibe quantidade negativa sem prefixo extra', () => {
    render(<StockMovementsTable />)

    expect(screen.getByText('-12')).toBeInTheDocument()
    expect(screen.getByText('-3')).toBeInTheDocument()
  })

  it('renderiza badge "IN" para action in', () => {
    render(<StockMovementsTable />)

    const badges = screen.getAllByText('IN')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza badge "OUT" para action out', () => {
    render(<StockMovementsTable />)

    const badges = screen.getAllByText('OUT')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza badge "ADJ" para action adjustment', () => {
    render(<StockMovementsTable />)

    expect(screen.getByText('ADJ')).toBeInTheDocument()
  })

  it('a tabela tem rótulo acessível', () => {
    render(<StockMovementsTable />)

    expect(screen.getByRole('table', { name: /stock movements/i })).toBeInTheDocument()
  })

  it('peça e quantidade estão na mesma row', () => {
    render(<StockMovementsTable />)

    const table = screen.getByRole('table', { name: /stock movements/i })
    const rows = within(table).getAllByRole('row')

    const firstDataRow = rows[1]
    expect(within(firstDataRow).getByText('V8 Cylinder Block')).toBeInTheDocument()
    expect(within(firstDataRow).getByText('+4')).toBeInTheDocument()
    expect(within(firstDataRow).getByText('IN')).toBeInTheDocument()
  })
})
