import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RecentSalesTable } from './RecentSalesTable'

describe('RecentSalesTable', () => {
  it('renderiza o título e link "View All"', () => {
    render(<RecentSalesTable />)

    expect(screen.getByText(/recent sales/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '#')
  })

  it('exibe as 4 colunas do cabeçalho', () => {
    render(<RecentSalesTable />)

    expect(screen.getByRole('columnheader', { name: /^id$/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /customer/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /value/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
  })

  it('renderiza 5 linhas de dados mockados', () => {
    render(<RecentSalesTable />)

    const rows = screen.getAllByRole('row')
    // 1 header + 5 data rows
    expect(rows).toHaveLength(6)
  })

  it('exibe ID, customer e value de uma linha', () => {
    render(<RecentSalesTable />)

    expect(screen.getByText('#ORD-90212')).toBeInTheDocument()
    expect(screen.getByText('Apex Auto')).toBeInTheDocument()
    expect(screen.getByText('$4,290.00')).toBeInTheDocument()
  })

  it('renderiza badge "Concluído" para status completed', () => {
    render(<RecentSalesTable />)

    const badges = screen.getAllByText(/conclu/i)
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza badge "Pendente" para status pending', () => {
    render(<RecentSalesTable />)

    const badges = screen.getAllByText(/pendente/i)
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza badge "Cancelado" para status cancelled', () => {
    render(<RecentSalesTable />)

    expect(screen.getByText(/cancelado/i)).toBeInTheDocument()
  })

  it('a tabela tem rótulo acessível', () => {
    render(<RecentSalesTable />)

    expect(screen.getByRole('table', { name: /recent sales/i })).toBeInTheDocument()
  })

  it('todos os dados de uma linha estão na mesma row', () => {
    render(<RecentSalesTable />)

    const table = screen.getByRole('table', { name: /recent sales/i })
    const rows = within(table).getAllByRole('row')

    // A segunda linha (index 1) é a primeira de dados
    const firstDataRow = rows[1]
    expect(within(firstDataRow).getByText('#ORD-90212')).toBeInTheDocument()
    expect(within(firstDataRow).getByText('Apex Auto')).toBeInTheDocument()
    expect(within(firstDataRow).getByText('$4,290.00')).toBeInTheDocument()
  })
})
