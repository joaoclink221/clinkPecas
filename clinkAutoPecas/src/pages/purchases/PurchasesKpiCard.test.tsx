import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PurchasesKpiCard } from './PurchasesKpiCard'

describe('PurchasesKpiCard — renderização base', () => {
  it('renderiza o label informado', () => {
    render(<PurchasesKpiCard label="Total Mensal" value="R$ 142.850" variant="success" />)

    expect(screen.getByText('Total Mensal')).toBeInTheDocument()
  })

  it('renderiza o valor informado', () => {
    render(<PurchasesKpiCard label="Total Mensal" value="R$ 142.850" variant="success" />)

    expect(screen.getByText('R$ 142.850')).toBeInTheDocument()
  })

  it('tem role article com aria-label igual ao label', () => {
    render(<PurchasesKpiCard label="Pedidos Pendentes" value="24" variant="purple" />)

    expect(screen.getByRole('article', { name: /pedidos pendentes/i })).toBeInTheDocument()
  })
})

describe('PurchasesKpiCard — subLabel', () => {
  it('renderiza subLabel quando fornecido', () => {
    render(
      <PurchasesKpiCard
        label="Pedidos Pendentes"
        value="24"
        subLabel="Aguardando confirmação"
        variant="purple"
      />,
    )

    expect(screen.getByText('Aguardando confirmação')).toBeInTheDocument()
  })

  it('não renderiza subLabel quando ausente', () => {
    render(<PurchasesKpiCard label="Total Mensal" value="R$ 142.850" variant="success" />)

    // nenhum texto de subLabel presente
    expect(screen.queryByText(/aguardando/i)).not.toBeInTheDocument()
  })
})

describe('PurchasesKpiCard — badge de tendência', () => {
  it('renderiza o badge quando fornecido', () => {
    render(
      <PurchasesKpiCard
        label="Total Mensal"
        value="R$ 142.850"
        badge="↑ +12,5% vs mês anterior"
        variant="success"
      />,
    )

    expect(screen.getByText('↑ +12,5% vs mês anterior')).toBeInTheDocument()
  })

  it('badge tem aria-label descritivo', () => {
    render(
      <PurchasesKpiCard
        label="Total Mensal"
        value="R$ 142.850"
        badge="↑ +12,5% vs mês anterior"
        variant="success"
      />,
    )

    expect(screen.getByLabelText(/indicador: ↑ \+12,5% vs mês anterior/i)).toBeInTheDocument()
  })

  it('não renderiza badge quando ausente', () => {
    render(<PurchasesKpiCard label="Cancelados" value="03" variant="danger" />)

    expect(screen.queryByLabelText(/indicador:/i)).not.toBeInTheDocument()
  })
})

describe('PurchasesKpiCard — variantes de cor (border class)', () => {
  it('variante success aplica classe de borda verde', () => {
    render(<PurchasesKpiCard label="Total Mensal" value="R$ 142.850" variant="success" />)

    const card = screen.getByRole('article', { name: /total mensal/i })
    expect(card.className).toContain('border-l-[#10b981]')
  })

  it('variante purple aplica classe de borda roxa', () => {
    render(<PurchasesKpiCard label="Pedidos Pendentes" value="24" variant="purple" />)

    const card = screen.getByRole('article', { name: /pedidos pendentes/i })
    expect(card.className).toContain('border-l-[#a855f7]')
  })

  it('variante info aplica classe de borda cyan', () => {
    render(<PurchasesKpiCard label="Recebidos (30d)" value="118" variant="info" />)

    const card = screen.getByRole('article', { name: /recebidos/i })
    expect(card.className).toContain('border-l-[#06b6d4]')
  })

  it('variante danger aplica classe de borda coral', () => {
    render(<PurchasesKpiCard label="Cancelados" value="03" variant="danger" />)

    const card = screen.getByRole('article', { name: /cancelados/i })
    expect(card.className).toContain('border-l-[#f87171]')
  })
})

describe('PurchasesKpiCard — ícone', () => {
  it('renderiza o ícone quando fornecido', () => {
    const TestIcon = () => <svg data-testid="test-icon" />
    render(
      <PurchasesKpiCard
        label="Total Mensal"
        value="R$ 142.850"
        variant="success"
        icon={<TestIcon />}
      />,
    )

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('não renderiza container de ícone quando ausente', () => {
    render(<PurchasesKpiCard label="Total Mensal" value="R$ 142.850" variant="success" />)

    // o container do ícone tem aria-hidden=true, portanto invisível a AT
    // verificamos pela ausência do elemento span com aria-hidden
    const card = screen.getByRole('article', { name: /total mensal/i })
    const iconSpan = card.querySelector('span[aria-hidden]')
    expect(iconSpan).not.toBeInTheDocument()
  })
})
