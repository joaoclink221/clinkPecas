import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Return } from './warranty.types'
import { ReturnsTable } from './ReturnsTable'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const analysing: Return = {
  id: 'RET-001',
  itemName: 'Disco de Freio Vent.',
  skuRef: 'ORD-98231-X',
  avatarIcon: 'brake',
  reason: 'Avaria no Transporte',
  date: '2023-10-12',
  status: 'analysing',
}

const approved: Return = {
  id: 'RET-002',
  itemName: 'Alternador 120A',
  skuRef: 'ORD-88122-Y',
  avatarIcon: 'alternator',
  reason: 'Incompatibilidade',
  date: '2023-10-10',
  status: 'approved',
}

const refunded: Return = {
  id: 'RET-003',
  itemName: 'Kit Filtros (4un)',
  skuRef: 'ORD-99100-A',
  avatarIcon: 'filter',
  reason: 'Erro de Pedido',
  date: '2023-10-05',
  status: 'refunded',
}

const allReturns: Return[] = [analysing, approved, refunded]

// ── 3.1 Estrutura das 4 colunas ───────────────────────────────────────────────

describe('ReturnsTable — 3.1 Estrutura', () => {
  it('renderiza a tabela sem erros com dados padrão', () => {
    expect(() => render(<ReturnsTable />)).not.toThrow()
  })

  it('renderiza sem erros com array vazio', () => {
    expect(() => render(<ReturnsTable returns={[]} />)).not.toThrow()
  })

  it('header exibe o título "Devoluções Recentes"', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(
      screen.getByRole('heading', { name: /devoluções recentes/i }),
    ).toBeInTheDocument()
  })

  it('botão "VER TUDO" está presente com aria-label acessível', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(
      screen.getByRole('button', { name: /ver todas as devoluções/i }),
    ).toBeInTheDocument()
  })

  it('exibe os 4 cabeçalhos de coluna corretos', () => {
    render(<ReturnsTable returns={allReturns} />)

    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent)
    expect(headers).toContain('ITEM / SKU')
    expect(headers).toContain('MOTIVO')
    expect(headers).toContain('DATA')
    expect(headers).toContain('STATUS')
  })

  it('renderiza exatamente 3 linhas de dados (+ 1 thead = 4 rows total)', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getAllByRole('row')).toHaveLength(4)
  })

  it('exibe nome do item em cada linha', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getByText('Disco de Freio Vent.')).toBeInTheDocument()
    expect(screen.getByText('Alternador 120A')).toBeInTheDocument()
    expect(screen.getByText('Kit Filtros (4un)')).toBeInTheDocument()
  })

  it('exibe o skuRef em cada linha como texto muted', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getByText('ORD-98231-X')).toBeInTheDocument()
    expect(screen.getByText('ORD-88122-Y')).toBeInTheDocument()
    expect(screen.getByText('ORD-99100-A')).toBeInTheDocument()
  })

  it('exibe o motivo de cada linha', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getByText('Avaria no Transporte')).toBeInTheDocument()
    expect(screen.getByText('Incompatibilidade')).toBeInTheDocument()
    expect(screen.getByText('Erro de Pedido')).toBeInTheDocument()
  })

  it('formata as datas no padrão "DD Mmm, YYYY"', () => {
    render(<ReturnsTable returns={[analysing]} />)

    expect(screen.getByText('12 Out, 2023')).toBeInTheDocument()
  })

  it('formata corretamente as 3 datas distintas', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getByText('12 Out, 2023')).toBeInTheDocument()
    expect(screen.getByText('10 Out, 2023')).toBeInTheDocument()
    expect(screen.getByText('05 Out, 2023')).toBeInTheDocument()
  })
})

// ── 3.2 Badges de status ──────────────────────────────────────────────────────

describe('ReturnsTable — 3.2 Badges de Status', () => {
  it('badge ANALYSING está presente na linha correta', () => {
    render(<ReturnsTable returns={[analysing]} />)

    expect(screen.getByText('ANALYSING')).toBeInTheDocument()
  })

  it('badge APPROVED está presente na linha correta', () => {
    render(<ReturnsTable returns={[approved]} />)

    expect(screen.getByText('APPROVED')).toBeInTheDocument()
  })

  it('badge REFUNDED está presente na linha correta', () => {
    render(<ReturnsTable returns={[refunded]} />)

    expect(screen.getByText('REFUNDED')).toBeInTheDocument()
  })

  it('badge analysing tem fundo roxo sólido (#7C3AED)', () => {
    render(<ReturnsTable returns={[analysing]} />)

    const badge = screen.getByText('ANALYSING')
    expect(badge).toHaveStyle({ background: '#7C3AED', color: '#ffffff' })
  })

  it('badge approved tem fundo teal (#10B981)', () => {
    render(<ReturnsTable returns={[approved]} />)

    const badge = screen.getByText('APPROVED')
    expect(badge).toHaveStyle({ background: '#10B981', color: '#ffffff' })
  })

  it('badge refunded tem fundo cinza muted', () => {
    render(<ReturnsTable returns={[refunded]} />)

    const badge = screen.getByText('REFUNDED')
    expect(badge).toHaveStyle({ color: '#9ca3af' })
  })

  it('renderiza os 3 badges distintos quando há um de cada status', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getByText('ANALYSING')).toBeInTheDocument()
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
    expect(screen.getByText('REFUNDED')).toBeInTheDocument()
  })
})

// ── 3.3 Ícones de item por categoria ─────────────────────────────────────────

describe('ReturnsTable — 3.3 Ícones de Item', () => {
  it('ícone de brake renderiza com aria-label "Ícone brake"', () => {
    render(<ReturnsTable returns={[analysing]} />)

    expect(screen.getByLabelText('Ícone brake')).toBeInTheDocument()
  })

  it('ícone de alternator renderiza com aria-label "Ícone alternator"', () => {
    render(<ReturnsTable returns={[approved]} />)

    expect(screen.getByLabelText('Ícone alternator')).toBeInTheDocument()
  })

  it('ícone de filter renderiza com aria-label "Ícone filter"', () => {
    render(<ReturnsTable returns={[refunded]} />)

    expect(screen.getByLabelText('Ícone filter')).toBeInTheDocument()
  })

  it('renderiza os 3 ícones distintos para os 3 registros', () => {
    render(<ReturnsTable returns={allReturns} />)

    expect(screen.getByLabelText('Ícone brake')).toBeInTheDocument()
    expect(screen.getByLabelText('Ícone alternator')).toBeInTheDocument()
    expect(screen.getByLabelText('Ícone filter')).toBeInTheDocument()
  })
})

// ── Integridade geral ─────────────────────────────────────────────────────────

describe('ReturnsTable — Integridade', () => {
  it('com array vazio exibe apenas o thead (1 row)', () => {
    render(<ReturnsTable returns={[]} />)

    expect(screen.getAllByRole('row')).toHaveLength(1)
  })

  it('renderiza sem erros com dados padrão (returnsMock)', () => {
    expect(() => render(<ReturnsTable />)).not.toThrow()
  })
})
