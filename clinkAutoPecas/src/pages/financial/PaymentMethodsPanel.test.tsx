import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { FinancialStatCard, PaymentMethodItem } from './financial.types'
import { PaymentMethodsPanel } from './PaymentMethodsPanel'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const customMethods: PaymentMethodItem[] = [
  { label: 'MÉTODO A', percent: 60, color: 'teal' },
  { label: 'MÉTODO B', percent: 25, color: 'purple' },
  { label: 'MÉTODO C', percent: 15, color: 'green' },
]

const customStats: FinancialStatCard[] = [
  { label: 'CONVERSÃO', value: '80.0%' },
  { label: 'TICKET', value: 'R$ 2k' },
]

// ── Cabeçalho ─────────────────────────────────────────────────────────────────

describe('PaymentMethodsPanel — Cabeçalho', () => {
  it('renderiza o título "Meios de Pagamento"', () => {
    render(<PaymentMethodsPanel />)

    expect(
      screen.getByRole('heading', { level: 2, name: /meios de pagamento/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o subtítulo "Distribuição por canal"', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText(/distribuição por canal/i)).toBeInTheDocument()
  })
})

// ── 4.1 Barras de progresso ───────────────────────────────────────────────────

describe('PaymentMethodsPanel — 4.1 Barras de progresso', () => {
  it('renderiza a lista de métodos com aria-label acessível', () => {
    render(<PaymentMethodsPanel />)

    expect(
      screen.getByRole('list', { name: /métodos de pagamento/i }),
    ).toBeInTheDocument()
  })

  it('renderiza 3 barras de progresso', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getAllByRole('progressbar')).toHaveLength(3)
  })

  it('barra PIX INSTANTÂNEO tem aria-valuenow=45', () => {
    render(<PaymentMethodsPanel />)

    const pix = screen.getByRole('progressbar', { name: /pix instantâneo/i })
    expect(pix).toHaveAttribute('aria-valuenow', '45')
  })

  it('barra BOLETO BANCÁRIO tem aria-valuenow=30', () => {
    render(<PaymentMethodsPanel />)

    const boleto = screen.getByRole('progressbar', { name: /boleto bancário/i })
    expect(boleto).toHaveAttribute('aria-valuenow', '30')
  })

  it('barra CARTÃO DE CRÉDITO tem aria-valuenow=25', () => {
    render(<PaymentMethodsPanel />)

    const cartao = screen.getByRole('progressbar', { name: /cartão de crédito/i })
    expect(cartao).toHaveAttribute('aria-valuenow', '25')
  })

  it('todas as barras têm aria-valuemin=0 e aria-valuemax=100', () => {
    render(<PaymentMethodsPanel />)

    for (const bar of screen.getAllByRole('progressbar')) {
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
    }
  })

  it('exibe os percentuais textuais corretos', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('exibe os labels dos métodos visíveis', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText(/pix instantâneo/i)).toBeInTheDocument()
    expect(screen.getByText(/boleto bancário/i)).toBeInTheDocument()
    expect(screen.getByText(/cartão de crédito/i)).toBeInTheDocument()
  })

  it('renderiza corretamente com dados customizados via prop', () => {
    render(<PaymentMethodsPanel methods={customMethods} />)

    expect(screen.getAllByRole('progressbar')).toHaveLength(3)
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('MÉTODO A')).toBeInTheDocument()
  })
})

// ── 4.2 Mini-cards ────────────────────────────────────────────────────────────

describe('PaymentMethodsPanel — 4.2 Mini-cards', () => {
  it('renderiza o grid de estatísticas com aria-label acessível', () => {
    render(<PaymentMethodsPanel />)

    expect(
      screen.getByLabelText(/estatísticas de pagamento/i),
    ).toBeInTheDocument()
  })

  it('exibe o label "TAXA DE CONVERSÃO"', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText(/taxa de conversão/i)).toBeInTheDocument()
  })

  it('exibe o valor "94.2%" da taxa de conversão', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText('94.2%')).toBeInTheDocument()
  })

  it('exibe o label "TICKET MÉDIO"', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText(/ticket médio/i)).toBeInTheDocument()
  })

  it('exibe o valor "R$ 1.4k" do ticket médio', () => {
    render(<PaymentMethodsPanel />)

    expect(screen.getByText('R$ 1.4k')).toBeInTheDocument()
  })

  it('renderiza exatamente 2 mini-cards', () => {
    render(<PaymentMethodsPanel />)

    // Cada mini-card contém um label + um valor; query via container
    expect(screen.getAllByText(/taxa de conversão|ticket médio/i)).toHaveLength(2)
  })

  it('renderiza corretamente com stats customizados via prop', () => {
    render(<PaymentMethodsPanel stats={customStats} />)

    expect(screen.getByText('CONVERSÃO')).toBeInTheDocument()
    expect(screen.getByText('80.0%')).toBeInTheDocument()
    expect(screen.getByText('R$ 2k')).toBeInTheDocument()
  })
})

// ── Renderização sem erros ────────────────────────────────────────────────────

describe('PaymentMethodsPanel — Integridade', () => {
  it('renderiza sem erros com dados padrão', () => {
    expect(() => render(<PaymentMethodsPanel />)).not.toThrow()
  })

  it('renderiza sem erros com props customizadas', () => {
    expect(() =>
      render(<PaymentMethodsPanel methods={customMethods} stats={customStats} />),
    ).not.toThrow()
  })
})
