import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PredictiveInsightsCard } from './PredictiveInsightsCard'

// ── 5.1 Card "Inteligência Preditiva de Falhas" ───────────────────────────────

describe('PredictiveInsightsCard — 5.1', () => {
  it('renderiza sem erros', () => {
    expect(() => render(<PredictiveInsightsCard />)).not.toThrow()
  })

  it('exibe o título correto', () => {
    render(<PredictiveInsightsCard />)

    expect(
      screen.getByRole('heading', { name: /inteligência preditiva de falhas/i }),
    ).toBeInTheDocument()
  })

  it('exibe o parágrafo com texto sobre aumento de falhas de compressores', () => {
    render(<PredictiveInsightsCard />)

    expect(screen.getByText(/15%/)).toBeInTheDocument()
    expect(screen.getByText(/compressores da série/i)).toBeInTheDocument()
  })

  it('exibe o texto completo do parágrafo hardcoded', () => {
    render(<PredictiveInsightsCard />)

    expect(
      screen.getByText(/baseado nos últimos 30 dias/i),
    ).toBeInTheDocument()
  })

  it('botão "VER RELATÓRIO ANALÍTICO" está presente', () => {
    render(<PredictiveInsightsCard />)

    expect(
      screen.getByRole('button', { name: /ver relatório analítico/i }),
    ).toBeInTheDocument()
  })

  it('botão tem aria-label acessível', () => {
    render(<PredictiveInsightsCard />)

    expect(
      screen.getByRole('button', { name: /ver relatório analítico de falhas preditivas/i }),
    ).toBeInTheDocument()
  })

  it('thumbnail do gráfico está presente com aria-label acessível', () => {
    render(<PredictiveInsightsCard />)

    expect(
      screen.getByLabelText(/miniatura do gráfico analítico/i),
    ).toBeInTheDocument()
  })

  it('thumbnail contém o SVG de barras (pelo menos 1 rect)', () => {
    const { container } = render(<PredictiveInsightsCard />)

    expect(container.querySelector('rect')).toBeInTheDocument()
  })

  it('botão não causa erro ao ser renderizado', () => {
    const { getByRole } = render(<PredictiveInsightsCard />)

    expect(() => getByRole('button', { name: /ver relatório analítico/i })).not.toThrow()
  })
})
