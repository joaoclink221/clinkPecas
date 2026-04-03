import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SummaryCard } from './SummaryCard'

describe('SummaryCard', () => {
  it('mostra título e valor formatado', () => {
    render(<SummaryCard title="Receita mensal" value="R$ 128.400" />)

    expect(screen.getByText(/receita mensal/i)).toBeInTheDocument()
    expect(screen.getByText('R$ 128.400')).toBeInTheDocument()
  })

  it('mostra indicador de tendência quando fornecido', () => {
    render(
      <SummaryCard
        title="Pedidos"
        value="42"
        trend={{ direction: 'up', label: '+8% vs semana anterior' }}
      />,
    )

    expect(screen.getByText(/\+8% vs semana anterior/i)).toBeInTheDocument()
  })

  it('não renderiza linha de tendência quando trend é omitido', () => {
    render(<SummaryCard title="Total" value="0" />)

    expect(screen.queryByText(/vs/i)).not.toBeInTheDocument()
  })
})
