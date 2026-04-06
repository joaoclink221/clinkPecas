import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { WarrantyProtocol } from './warranty.types'
import { WarrantyTrackingPanel } from './WarrantyTrackingPanel'

// ── Fixtures ──────────────────────────────────────────────────────────────────

// Protocolo ativo com expiração já vencida (2024 < 2026)
const inProgressExpired: WarrantyProtocol = {
  protocolId: 'GAR-2290',
  itemName: 'Transmissão Hidráulica X-9',
  description: 'Ruído excessivo em marcha lenta. Testado em bancada com falha no conversor de torque.',
  openDate: '2023-09-01',
  expirationDate: '2024-09-01',
  linkedOrder: 'ORD-772',
  status: 'in_progress',
}

// Protocolo concluído com expiração também vencida
const completedExpired: WarrantyProtocol = {
  protocolId: 'GAR-2144',
  itemName: 'Módulo de Controle ECU',
  description: 'Falha de comunicação CAN-bus. Substituído por unidade nova revisada.',
  openDate: '2023-08-15',
  expirationDate: '2024-08-15',
  linkedOrder: 'ORD-551',
  status: 'completed',
}

// Protocolo futuro (não vencido) para testar ausência do indicador VENCIDA
const futureProtocol: WarrantyProtocol = {
  protocolId: 'GAR-9999',
  itemName: 'Peça de Teste',
  description: 'Garantia futura para teste.',
  openDate: '2025-01-01',
  expirationDate: '2099-12-31',
  linkedOrder: 'ORD-001',
  status: 'in_progress',
}

// ── 4.1 Cards verticais de protocolo ─────────────────────────────────────────

describe('WarrantyTrackingPanel — 4.1 Cards de Protocolo', () => {
  it('renderiza sem erros com dados padrão', () => {
    expect(() => render(<WarrantyTrackingPanel />)).not.toThrow()
  })

  it('renderiza sem erros com array vazio', () => {
    expect(() => render(<WarrantyTrackingPanel protocols={[]} />)).not.toThrow()
  })

  it('exibe o título "Tracking de Garantia" no header do painel', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(
      screen.getByRole('heading', { name: /tracking de garantia/i }),
    ).toBeInTheDocument()
  })

  it('botão de opções está acessível por aria-label', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(
      screen.getByRole('button', { name: /opções de tracking/i }),
    ).toBeInTheDocument()
  })

  it('renderiza exatamente 2 cards (articles) com os dados mock padrão', () => {
    render(<WarrantyTrackingPanel />)

    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('card GAR-2290 exibe o protocolo no header', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText(/protocolo #gar-2290/i)).toBeInTheDocument()
  })

  it('card GAR-2144 exibe o protocolo no header', () => {
    render(<WarrantyTrackingPanel protocols={[completedExpired]} />)

    expect(screen.getByText(/protocolo #gar-2144/i)).toBeInTheDocument()
  })

  it('exibe o nome da peça em bold em cada card', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired, completedExpired]} />)

    expect(screen.getByText('Transmissão Hidráulica X-9')).toBeInTheDocument()
    expect(screen.getByText('Módulo de Controle ECU')).toBeInTheDocument()
  })

  it('exibe o texto de descrição/diagnóstico de cada protocolo', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText(/conversor de torque/i)).toBeInTheDocument()
  })

  it('card in_progress tem borda esquerda teal via inline style', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    const card = screen.getByRole('article', { name: /gar-2290/i })
    expect(card).toHaveStyle({ borderLeft: '4px solid #10B981' })
  })

  it('card completed tem borda esquerda cinza via inline style', () => {
    render(<WarrantyTrackingPanel protocols={[completedExpired]} />)

    const card = screen.getByRole('article', { name: /gar-2144/i })
    expect(card).toHaveStyle({ borderLeft: '4px solid rgba(255,255,255,0.15)' })
  })
})

// ── 4.2 Badges de status ──────────────────────────────────────────────────────

describe('WarrantyTrackingPanel — 4.2 Badges de Status', () => {
  it('badge "IN PROGRESS" está presente no card GAR-2290', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
  })

  it('badge "COMPLETED" está presente no card GAR-2144', () => {
    render(<WarrantyTrackingPanel protocols={[completedExpired]} />)

    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('badge in_progress tem cor teal (#10B981)', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    const badge = screen.getByText('IN PROGRESS')
    expect(badge).toHaveStyle({ color: '#10B981' })
  })

  it('badge completed tem cor muted (#9ca3af)', () => {
    render(<WarrantyTrackingPanel protocols={[completedExpired]} />)

    const badge = screen.getByText('COMPLETED')
    expect(badge).toHaveStyle({ color: '#9ca3af' })
  })

  it('renderiza os 2 badges distintos com os dados padrão', () => {
    render(<WarrantyTrackingPanel />)

    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })
})

// ── 4.3 Metadados de expiração e ordem vinculada ──────────────────────────────

describe('WarrantyTrackingPanel — 4.3 Rodapé com Metadados', () => {
  it('exibe a data de abertura no formato DD/MM/YY', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText('01/09/23')).toBeInTheDocument()
  })

  it('exibe a data de expiração prefixada com "Exp:"', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText(/exp:\s*01\/09\/24/i)).toBeInTheDocument()
  })

  it('exibe a ordem vinculada ORD-772 do GAR-2290', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText('ORD-772')).toBeInTheDocument()
  })

  it('exibe a ordem vinculada ORD-551 do GAR-2144', () => {
    render(<WarrantyTrackingPanel protocols={[completedExpired]} />)

    expect(screen.getByText('ORD-551')).toBeInTheDocument()
  })

  it('exibe metadados nos 2 protocolos padrão', () => {
    render(<WarrantyTrackingPanel />)

    expect(screen.getByText('ORD-772')).toBeInTheDocument()
    expect(screen.getByText('ORD-551')).toBeInTheDocument()
  })
})

// ── 4.4 Indicador de garantia vencida ────────────────────────────────────────

describe('WarrantyTrackingPanel — 4.4 Indicador VENCIDA', () => {
  it('exibe label "VENCIDA" para protocolo com expiração passada', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.getByText('VENCIDA')).toBeInTheDocument()
  })

  it('NÃO exibe label "VENCIDA" para protocolo com expiração futura', () => {
    render(<WarrantyTrackingPanel protocols={[futureProtocol]} />)

    expect(screen.queryByText('VENCIDA')).not.toBeInTheDocument()
  })

  it('label "VENCIDA" tem cor coral (#FC7C78)', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    const label = screen.getByText('VENCIDA')
    expect(label).toHaveStyle({ color: '#FC7C78' })
  })

  it('com os 2 protocolos mock (ambos vencidos em 2026), exibe 2 labels VENCIDA', () => {
    render(<WarrantyTrackingPanel />)

    expect(screen.getAllByText('VENCIDA')).toHaveLength(2)
  })

  it('data de expiração tem cor coral quando vencida', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    // O span pai da data de expiração deve ter a cor coral aplicada
    const expLabel = screen.getByText('VENCIDA').closest('span')?.parentElement
    expect(expLabel).toHaveStyle({ color: '#FC7C78' })
  })
})

// ── 6.2 Kebab dropdown ────────────────────────────────────────────────────────

describe('WarrantyTrackingPanel — 6.2 Kebab Dropdown', () => {
  it('dropdown não está visível antes de clicar no kebab', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar no botão kebab abre o dropdown', async () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('dropdown exibe as 3 opções esperadas', async () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))

    expect(screen.getByRole('menuitem', { name: /ver todos os protocolos/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /exportar relatório/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /configurar alertas/i })).toBeInTheDocument()
  })

  it('clicar em uma opção fecha o dropdown', async () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))
    await userEvent.click(screen.getByRole('menuitem', { name: /exportar relatório/i }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar fora do dropdown fecha-o', async () => {
    render(
      <div>
        <span data-testid="outside">fora</span>
        <WarrantyTrackingPanel protocols={[inProgressExpired]} />
      </div>,
    )

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('botão kebab tem aria-expanded=false quando fechado', () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    expect(
      screen.getByRole('button', { name: /opções de tracking/i }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('botão kebab tem aria-expanded=true quando aberto', async () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))

    expect(
      screen.getByRole('button', { name: /opções de tracking/i }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('clicar no kebab novamente fecha o dropdown (toggle)', async () => {
    render(<WarrantyTrackingPanel protocols={[inProgressExpired]} />)

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /opções de tracking/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
