import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesKpiCard } from './SalesKpiCard'

describe('SalesKpiCard', () => {
  it('renderiza label e value', () => {
    render(<SalesKpiCard label="Receita Mensal" value="R$ 124.592" accentClass="border-l-primary" />)

    expect(screen.getByText('Receita Mensal')).toBeInTheDocument()
    expect(screen.getByText('R$ 124.592')).toBeInTheDocument()
  })

  it('tem role article com aria-label acessível', () => {
    render(<SalesKpiCard label="Ticket Médio" value="R$ 380" accentClass="border-l-[#60a5fa]" />)

    expect(screen.getByRole('article', { name: 'Ticket Médio' })).toBeInTheDocument()
  })

  it('aplica a accentClass na raiz do card', () => {
    render(<SalesKpiCard label="Cancelamentos" value="5" accentClass="border-l-on-error-container" />)

    const card = screen.getByRole('article', { name: 'Cancelamentos' })
    expect(card.className).toContain('border-l-on-error-container')
  })

  it('exibe badge quando fornecido', () => {
    render(
      <SalesKpiCard
        label="Pedidos Pendentes"
        value="12"
        badge="+8%"
        badgeVariant="positive"
        accentClass="border-l-secondary"
      />,
    )

    expect(screen.getByLabelText('Variação: +8%')).toBeInTheDocument()
  })

  it('não renderiza badge quando ausente', () => {
    render(<SalesKpiCard label="Ticket Médio" value="R$ 380" accentClass="border-l-[#60a5fa]" />)

    expect(screen.queryByLabelText(/Variação/i)).not.toBeInTheDocument()
  })

  it('aplica classe correta para badgeVariant critical', () => {
    render(
      <SalesKpiCard
        label="Cancelamentos"
        value="3"
        badge="3 hoje"
        badgeVariant="critical"
        accentClass="border-l-on-error-container"
      />,
    )

    const badge = screen.getByLabelText('Variação: 3 hoje')
    expect(badge.className).toContain('text-on-error-container')
  })

  it('renderiza subLabel quando fornecido', () => {
    render(
      <SalesKpiCard
        label="Pedidos Pendentes"
        value="42"
        subLabel="Aguardando liberação"
        accentClass="border-l-secondary"
      />,
    )

    expect(screen.getByText('Aguardando liberação')).toBeInTheDocument()
  })

  it('não renderiza subLabel quando ausente', () => {
    render(<SalesKpiCard label="Receita Mensal" value="R$ 142.850" accentClass="border-l-primary" />)

    expect(screen.queryByText(/Aguardando/i)).not.toBeInTheDocument()
  })

  it('renderiza ícone com aria-hidden quando fornecido', () => {
    const icon = <svg data-testid="icon-svg"><circle /></svg>
    render(
      <SalesKpiCard
        label="Receita Mensal"
        value="R$ 142.850"
        icon={icon}
        accentClass="border-l-primary"
      />,
    )

    const wrapper = screen.getByRole('article', { name: 'Receita Mensal' })
    const iconContainer = wrapper.querySelector('[aria-hidden]')
    expect(iconContainer).toBeInTheDocument()
  })
})
