import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WarrantyPage } from './WarrantyPage'

// ── 1.1 Header: H1 bicolor, subtítulo, navbar, botão ─────────────────────────

describe('WarrantyPage — 1.1 Header', () => {
  it('renderiza o H1 com texto "Pós-Venda & Qualidade"', () => {
    render(<WarrantyPage />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Pós-Venda')
    expect(heading).toHaveTextContent('&')
    expect(heading).toHaveTextContent('Qualidade')
  })

  it('renderiza o subtítulo descritivo', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByText(/gerenciamento centralizado de protocolos de garantia/i),
    ).toBeInTheDocument()
  })

  it('renderiza a navbar de abas com aria-label acessível', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('tablist', { name: /seções do módulo de garantia/i }),
    ).toBeInTheDocument()
  })

  it('aba POST-SALES está presente e selecionada por padrão', () => {
    render(<WarrantyPage />)

    const postSalesTab = screen.getByRole('tab', { name: /post-sales/i })
    expect(postSalesTab).toBeInTheDocument()
    expect(postSalesTab).toHaveAttribute('aria-selected', 'true')
  })

  it('aba COMPLIANCE está presente e não selecionada', () => {
    render(<WarrantyPage />)

    const complianceTab = screen.getByRole('tab', { name: /compliance/i })
    expect(complianceTab).toBeInTheDocument()
    expect(complianceTab).toHaveAttribute('aria-selected', 'false')
  })

  it('botão "Abrir Chamado" está visível com aria-label acessível', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('button', { name: /abrir chamado de garantia/i }),
    ).toBeInTheDocument()
  })

  it('"&" no H1 tem cor teal via inline style', () => {
    render(<WarrantyPage />)

    const heading = screen.getByRole('heading', { level: 1 })
    const ampersand = Array.from(heading.querySelectorAll('span')).find(
      (el) => el.textContent?.trim() === '&',
    )
    expect(ampersand).toBeDefined()
    expect(ampersand).toHaveStyle({ color: '#10B981' })
  })
})

// ── 1.2 Grid dos 3 KPI cards ──────────────────────────────────────────────────

describe('WarrantyPage — 1.2 KPI Cards', () => {
  it('renderiza a section de indicadores com aria-label acessível', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('region', { name: /indicadores de garantia/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o card "GARANTIAS ATIVAS" com valor 142', () => {
    render(<WarrantyPage />)

    expect(screen.getByRole('article', { name: /garantias ativas/i })).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
  })

  it('renderiza o card "DEVOLUÇÕES PENDENTES" com valor 28', () => {
    render(<WarrantyPage />)

    expect(screen.getByRole('article', { name: /devoluções pendentes/i })).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
  })

  it('renderiza o card "TOTAL EM REEMBOLSOS" com valor R$ 14.2k', () => {
    render(<WarrantyPage />)

    expect(screen.getByRole('article', { name: /total em reembolsos/i })).toBeInTheDocument()
    expect(screen.getByText('R$ 14.2k')).toBeInTheDocument()
  })

  it('badge "+12% VS LAST MONTH" está visível no card Garantias Ativas', () => {
    render(<WarrantyPage />)

    expect(screen.getByText(/\+12% vs last month/i)).toBeInTheDocument()
  })

  it('badge "AWAITING LOGISTICS" está visível no card Devoluções Pendentes', () => {
    render(<WarrantyPage />)

    expect(screen.getByText(/awaiting logistics/i)).toBeInTheDocument()
  })

  it('badge "CURRENT CYCLE" está visível no card Total em Reembolsos', () => {
    render(<WarrantyPage />)

    expect(screen.getByText(/current cycle/i)).toBeInTheDocument()
  })

  it('exibe exatamente 3 KPI cards', () => {
    render(<WarrantyPage />)

    const kpiSection = screen.getByRole('region', { name: /indicadores de garantia/i })
    expect(kpiSection.querySelectorAll('article')).toHaveLength(3)
  })
})

// ── 1.3 Slots dos widgets ─────────────────────────────────────────────────────

describe('WarrantyPage — 1.3 Slots de Widgets', () => {
  it('slot "Devoluções Recentes" está presente', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('region', { name: /devoluções recentes/i }),
    ).toBeInTheDocument()
  })

  it('slot "Tracking de Garantia" está presente', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('region', { name: /tracking de garantia/i }),
    ).toBeInTheDocument()
  })

  it('slot "Inteligência Preditiva de Falhas" está presente', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('region', { name: /inteligência preditiva de falhas/i }),
    ).toBeInTheDocument()
  })

  it('slot "Guia de Políticas" está presente', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('region', { name: /guia de políticas/i }),
    ).toBeInTheDocument()
  })

  it('botão "VER TUDO" está presente no slot Devoluções Recentes', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('button', { name: /ver todas as devoluções/i }),
    ).toBeInTheDocument()
  })

  it('botão "DOWNLOAD PDF" está presente no slot Guia de Políticas', () => {
    render(<WarrantyPage />)

    expect(
      screen.getByRole('button', { name: /baixar pdf do guia de políticas/i }),
    ).toBeInTheDocument()
  })

  it('os 4 h2 de seção estão presentes', () => {
    render(<WarrantyPage />)

    const headings = screen.getAllByRole('heading', { level: 2 })
    const texts = headings.map((h) => h.textContent)

    expect(texts).toContain('Devoluções Recentes')
    expect(texts).toContain('Tracking de Garantia')
    expect(texts).toContain('Inteligência Preditiva de Falhas')
    expect(texts).toContain('Guia de Políticas')
  })
})

// ── Integridade geral ─────────────────────────────────────────────────────────

describe('WarrantyPage — Integridade', () => {
  it('renderiza sem erros', () => {
    expect(() => render(<WarrantyPage />)).not.toThrow()
  })

  it('o header contém um element <header>', () => {
    const { container } = render(<WarrantyPage />)

    expect(container.querySelector('header')).toBeInTheDocument()
  })
})
