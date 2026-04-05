import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { MonthlyTrendData } from './financial.types'
import { MonthlyTrendChart } from './MonthlyTrendChart'

// ── Fixture ───────────────────────────────────────────────────────────────────

const customData: MonthlyTrendData = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  realizado: [100000, 120000, 140000, 160000, 180000, 200000],
  projetado: [110000, 130000, 150000, 170000, 190000, 210000],
}

// ── 3.2 Cabeçalho ─────────────────────────────────────────────────────────────

describe('MonthlyTrendChart — 3.2 Cabeçalho', () => {
  it('renderiza o título "Tendência Mensal"', () => {
    render(<MonthlyTrendChart />)

    expect(
      screen.getByRole('heading', { level: 2, name: /tendência mensal/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o subtítulo com texto correto', () => {
    render(<MonthlyTrendChart />)

    expect(
      screen.getByText(/comparativo de faturamento vs meta anual/i),
    ).toBeInTheDocument()
  })
})

// ── 3.2 Legenda ───────────────────────────────────────────────────────────────

describe('MonthlyTrendChart — 3.2 Legenda', () => {
  it('renderiza a legenda com aria-label acessível', () => {
    render(<MonthlyTrendChart />)

    expect(
      screen.getByRole('list', { name: /legenda do gráfico/i }),
    ).toBeInTheDocument()
  })

  it('legenda contém item "REALIZADO"', () => {
    render(<MonthlyTrendChart />)

    expect(screen.getByText(/realizado/i)).toBeInTheDocument()
  })

  it('legenda contém item "PROJETADO"', () => {
    render(<MonthlyTrendChart />)

    expect(screen.getByText(/projetado/i)).toBeInTheDocument()
  })

  it('legenda exibe exatamente 2 itens', () => {
    render(<MonthlyTrendChart />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
  })
})

// ── 3.1 Renderização do gráfico ───────────────────────────────────────────────

describe('MonthlyTrendChart — 3.1 Gráfico', () => {
  it('renderiza sem erros com dados padrão (trendMock)', () => {
    expect(() => render(<MonthlyTrendChart />)).not.toThrow()
  })

  it('renderiza sem erros com dados customizados via prop', () => {
    expect(() => render(<MonthlyTrendChart data={customData} />)).not.toThrow()
  })

  it('container do gráfico está presente no DOM', () => {
    const { container } = render(<MonthlyTrendChart />)

    // ResponsiveContainer renderiza com width=0 no JSDOM; verificamos apenas a presença
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('container renderiza corretamente com dados customizados', () => {
    const { container } = render(<MonthlyTrendChart data={customData} />)

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })
})
