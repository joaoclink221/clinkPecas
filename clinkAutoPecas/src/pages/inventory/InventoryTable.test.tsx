import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { stockMockPage } from './mock-data'
import { InventoryTable } from './InventoryTable'
import type { StockItem } from './inventory.types'

const ITEM_OB4492: StockItem = stockMockPage.find((i) => i.skuId === 'OB-4492-XT')!
const ITEM_OB9921: StockItem = stockMockPage.find((i) => i.skuId === 'OB-9921-ZR')!
const ITEM_OB1022: StockItem = stockMockPage.find((i) => i.skuId === 'OB-1022-NK')!
const ITEM_OB5561: StockItem = stockMockPage.find((i) => i.skuId === 'OB-5561-LK')!

describe('InventoryTable — 4.1 Estrutura das colunas', () => {
  it('renderiza a tabela com aria-label correto', () => {
    render(<InventoryTable items={stockMockPage} />)

    expect(screen.getByRole('table', { name: /tabela de estoque/i })).toBeInTheDocument()
  })

  it('renderiza os 7 cabeçalhos corretos', () => {
    render(<InventoryTable items={stockMockPage} />)

    expect(screen.getByRole('columnheader', { name: /sku id/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /nome da peça/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /categoria/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /nível de estoque/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /fornecedor/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /preço unit/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /ações/i })).toBeInTheDocument()
  })

  it('renderiza uma linha por item recebido', () => {
    render(<InventoryTable items={stockMockPage} />)

    expect(screen.getAllByRole('row')).toHaveLength(stockMockPage.length + 1) // +1 para thead
  })

  it('exibe o SKU ID em fonte mono com texto correto', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.getByText('OB-4492-XT')).toBeInTheDocument()
  })

  it('exibe nome e subtítulo do item', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.getByText('Velas de Ignição Iridium')).toBeInTheDocument()
    expect(screen.getByText('NGK Premium Series')).toBeInTheDocument()
  })

  it('exibe o fornecedor corretamente', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.getByText('Global Auto Parts')).toBeInTheDocument()
  })

  it('exibe o preço unitário formatado em BRL', () => {
    render(<InventoryTable items={[ITEM_OB9921]} />)

    expect(screen.getByText(/580/)).toBeInTheDocument()
  })

  it('exibe botões de ação (histórico e mais ações) por item', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.getByRole('button', { name: /histórico de OB-4492-XT/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mais ações para OB-4492-XT/i })).toBeInTheDocument()
  })

  it('exibe estado vazio quando array é vazio', () => {
    render(<InventoryTable items={[]} />)

    expect(screen.getByRole('status')).toHaveTextContent(/nenhum item encontrado/i)
  })
})

describe('InventoryTable — 4.2 Badges de categoria', () => {
  it('renderiza badge "Motores" para OB-4492-XT', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.getByText('Motores')).toBeInTheDocument()
  })

  it('renderiza badge "Suspensão" para OB-9921-ZR', () => {
    render(<InventoryTable items={[ITEM_OB9921]} />)

    expect(screen.getByText('Suspensão')).toBeInTheDocument()
  })

  it('renderiza badge "Filtros" para OB-1022-NK', () => {
    render(<InventoryTable items={[ITEM_OB1022]} />)

    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('renderiza badge "Freios" para OB-5561-LK', () => {
    render(<InventoryTable items={[ITEM_OB5561]} />)

    expect(screen.getByText('Freios')).toBeInTheDocument()
  })

  it('badges de categorias distintas aparecem sem colisão', () => {
    const mixed = [ITEM_OB4492, ITEM_OB9921, ITEM_OB1022, ITEM_OB5561]
    render(<InventoryTable items={mixed} />)

    expect(screen.getByText('Motores')).toBeInTheDocument()
    expect(screen.getByText('Suspensão')).toBeInTheDocument()
    expect(screen.getByText('Filtros')).toBeInTheDocument()
    expect(screen.getByText('Freios')).toBeInTheDocument()
  })
})

describe('InventoryTable — 4.3 Barra de nível de estoque', () => {
  it('exibe a quantidade de estoque com "un." para OB-4492-XT', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.getByText('850 un.')).toBeInTheDocument()
  })

  it('exibe a quantidade de estoque com "un." para OB-9921-ZR', () => {
    render(<InventoryTable items={[ITEM_OB9921]} />)

    expect(screen.getByText('12 un.')).toBeInTheDocument()
  })

  it('exibe a quantidade de estoque para OB-1022-NK (214 un.)', () => {
    render(<InventoryTable items={[ITEM_OB1022]} />)

    expect(screen.getByText('214 un.')).toBeInTheDocument()
  })
})

describe('InventoryTable — 6.1 Toast de histórico', () => {
  it('clicar em Histórico exibe toast "Histórico em breve"', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    fireEvent.click(screen.getByRole('button', { name: /histórico de OB-4492-XT/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/histórico em breve/i)
  })

  it('toast tem aria-live="polite" para leitores de tela', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    fireEvent.click(screen.getByRole('button', { name: /histórico de OB-4492-XT/i }))

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('toast não é exibido antes do clique', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('InventoryTable — 6.1 Dropdown kebab', () => {
  it('dropdown fechado por padrão (menu não renderizado)', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar no kebão abre dropdown com 3 opções', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    fireEvent.click(screen.getByRole('button', { name: /mais ações para OB-4492-XT/i }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /editar/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /ajustar estoque/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /desativar sku/i })).toBeInTheDocument()
  })

  it('clicar no kebão novamente fecha o dropdown', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    fireEvent.click(screen.getByRole('button', { name: /mais ações para OB-4492-XT/i }))
    fireEvent.click(screen.getByRole('button', { name: /mais ações para OB-4492-XT/i }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar em uma opção fecha o dropdown', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    fireEvent.click(screen.getByRole('button', { name: /mais ações para OB-4492-XT/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /editar/i }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('abrir kebão de uma linha não abre kebão de outra', () => {
    render(<InventoryTable items={[ITEM_OB4492, ITEM_OB9921]} />)

    fireEvent.click(screen.getByRole('button', { name: /mais ações para OB-4492-XT/i }))

    // só um menu abierto
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    expect(screen.getByRole('menu')).toHaveAttribute('aria-label', expect.stringContaining('OB-4492-XT'))
  })
})

describe('InventoryTable — 6.2 Highlight de linha crítica', () => {
  it('linha crítica (OB-9921-ZR) tem classe de destaque coral', () => {
    render(<InventoryTable items={[ITEM_OB9921]} />)

    const skuCell = screen.getByText('OB-9921-ZR')
    const row = skuCell.closest('tr')
    expect(row?.className).toContain('bg-[#fb923c]')
  })

  it('linha saudável (OB-4492-XT) não tem classe de destaque coral', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    const skuCell = screen.getByText('OB-4492-XT')
    const row = skuCell.closest('tr')
    expect(row?.className).not.toContain('bg-[#fb923c]')
  })
})

describe('InventoryTable — 4.4 Label "Reposição Urgente"', () => {
  it('OB-9921-ZR (12 < threshold 20) exibe "Reposição Urgente"', () => {
    render(<InventoryTable items={[ITEM_OB9921]} />)

    expect(screen.getByText(/reposição urgente/i)).toBeInTheDocument()
  })

  it('OB-4492-XT (850 >= threshold 50) NÃO exibe "Reposição Urgente"', () => {
    render(<InventoryTable items={[ITEM_OB4492]} />)

    expect(screen.queryByText(/reposição urgente/i)).not.toBeInTheDocument()
  })

  it('OB-1022-NK (214 >= threshold 30) NÃO exibe "Reposição Urgente"', () => {
    render(<InventoryTable items={[ITEM_OB1022]} />)

    expect(screen.queryByText(/reposição urgente/i)).not.toBeInTheDocument()
  })

  it('exibe múltiplos "Reposição Urgente" para itens críticos simultâneos', () => {
    const criticalItems = stockMockPage.filter((i) => i.stockQty < i.stockThreshold)
    render(<InventoryTable items={criticalItems} />)

    const labels = screen.getAllByText(/reposição urgente/i)
    expect(labels.length).toBe(criticalItems.length)
  })

  it('itens saudáveis não exibem "Reposição Urgente"', () => {
    const healthyItems = stockMockPage.filter((i) => i.stockQty >= i.stockThreshold)
    render(<InventoryTable items={healthyItems} />)

    expect(screen.queryByText(/reposição urgente/i)).not.toBeInTheDocument()
  })
})
