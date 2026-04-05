import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FinancialPage } from './FinancialPage'

// ── 1.1 Estrutura da rota e cabeçalho ─────────────────────────────────────────

describe('FinancialPage — 1.1 Header', () => {
  it('renderiza o label "CONTROLADORIA DIGITAL" em uppercase', () => {
    render(<FinancialPage />)

    expect(screen.getByText(/controladoria digital/i)).toBeInTheDocument()
  })

  it('renderiza o h1 "Gestão Financeira"', () => {
    render(<FinancialPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /gestão financeira/i }),
    ).toBeInTheDocument()
  })

  it('renderiza a navbar secundária com as 3 abas', () => {
    render(<FinancialPage />)

    const tablist = screen.getByRole('tablist', { name: /seções do módulo financeiro/i })
    expect(tablist).toBeInTheDocument()

    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Relatórios' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Conciliação' })).toBeInTheDocument()
  })

  it('aba "Overview" está ativa por padrão (aria-selected=true)', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
  })

  it('abas "Relatórios" e "Conciliação" não estão ativas (aria-selected=false)', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('tab', { name: 'Relatórios' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    expect(screen.getByRole('tab', { name: 'Conciliação' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('renderiza os 3 controles de filtro global', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('button', { name: /últimos 30 dias/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /centro de custo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /filtros avançados/i })).toBeInTheDocument()
  })

  it('página carrega sem erros (sem throw)', () => {
    expect(() => render(<FinancialPage />)).not.toThrow()
  })
})

// ── 1.2 Grid dos 4 KPI cards ──────────────────────────────────────────────────

describe('FinancialPage — 1.2 KPI Cards', () => {
  it('renderiza a seção de indicadores financeiros', () => {
    render(<FinancialPage />)

    expect(
      screen.getByRole('region', { name: /indicadores financeiros/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o card Receita Total com valor correto', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('article', { name: /receita total/i })).toBeInTheDocument()
    expect(screen.getByText('R$ 1.240.500')).toBeInTheDocument()
    expect(screen.getByText('Expectativa: R$ 1.1M')).toBeInTheDocument()
  })

  it('card Receita Total exibe tendência +12.5%', () => {
    render(<FinancialPage />)

    expect(screen.getByText('+12.5%')).toBeInTheDocument()
  })

  it('renderiza o card Despesas com valor correto', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('article', { name: /despesas/i })).toBeInTheDocument()
    expect(screen.getByText('R$ 845.200')).toBeInTheDocument()
    expect(screen.getByText('Previsto: R$ 820K')).toBeInTheDocument()
  })

  it('card Despesas exibe tendência +4.2%', () => {
    render(<FinancialPage />)

    expect(screen.getByText('+4.2%')).toBeInTheDocument()
  })

  it('renderiza o card Fluxo de Caixa com badge "Estável"', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('article', { name: /fluxo de caixa/i })).toBeInTheDocument()
    expect(screen.getByText('R$ 395.300')).toBeInTheDocument()
    // Critério obrigatório: badge "Estável" visível
    expect(screen.getByText('Estável')).toBeInTheDocument()
    expect(screen.getByText('Saldo em conta corrente')).toBeInTheDocument()
  })

  it('renderiza o card Inadimplência com triângulo de alerta e 2.8%', () => {
    render(<FinancialPage />)

    expect(screen.getByRole('article', { name: /inadimplência/i })).toBeInTheDocument()
    expect(screen.getByText('R$ 34.700')).toBeInTheDocument()
    // Critério obrigatório: percentual de alerta visível
    expect(screen.getByText('2.8%')).toBeInTheDocument()
    expect(screen.getByText('Atrasos > 30 dias')).toBeInTheDocument()
  })

  it('exibe exatamente 4 cards KPI', () => {
    render(<FinancialPage />)

    expect(screen.getAllByRole('article')).toHaveLength(4)
  })
})

// ── 1.3 Slots dos dois widgets do meio ────────────────────────────────────────

describe('FinancialPage — 1.3 Slots de widgets', () => {
  it('renderiza o slot "Tendência Mensal"', () => {
    render(<FinancialPage />)

    expect(screen.getByText(/tendência mensal/i)).toBeInTheDocument()
  })

  it('renderiza o slot "Meios de Pagamento"', () => {
    render(<FinancialPage />)

    expect(screen.getByText(/meios de pagamento/i)).toBeInTheDocument()
  })

  it('slot "Tendência Mensal" é acessível via heading h2', () => {
    render(<FinancialPage />)

    // MonthlyTrendChart renderiza um <h2> próprio; não há aria-label redundante no wrapper
    expect(
      screen.getByRole('heading', { level: 2, name: /tendência mensal/i }),
    ).toBeInTheDocument()
  })

  it('slot "Meios de Pagamento" é acessível via heading h2', () => {
    render(<FinancialPage />)

    // PaymentMethodsPanel renderiza um <h2> próprio; não há aria-label redundante no wrapper
    expect(
      screen.getByRole('heading', { level: 2, name: /meios de pagamento/i }),
    ).toBeInTheDocument()
  })
})

// ── 1.4 Rodapé de segurança ───────────────────────────────────────────────────

describe('FinancialPage — 1.4 Rodapé', () => {
  it('renderiza o texto do rodapé de segurança', () => {
    render(<FinancialPage />)

    expect(
      screen.getByText(/OBSIDIAN GEAR SYSTEMS © 2024 \| SECURE FINTECH LAYER V2\.1\.0/i),
    ).toBeInTheDocument()
  })

  it('rodapé está contido em um elemento footer', () => {
    render(<FinancialPage />)

    const footer = document.querySelector('footer')
    expect(footer).not.toBeNull()
    expect(footer).toHaveTextContent(/OBSIDIAN GEAR SYSTEMS/i)
  })
})
