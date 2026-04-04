import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { purchasesMockPage } from './mock-data'
import { PurchasesTable } from './PurchasesTable'
import type { FilterPanelProps } from './PurchasesTable'

// ── Dados de apoio ────────────────────────────────────────────────────────────

const REFERENCE_ORDERS = purchasesMockPage.slice(0, 5)

/** Stub de filterPanel com painel fechado e sem filtros ativos. */
const defaultFilterPanel: FilterPanelProps = {
  isOpen: false,
  onToggle: vi.fn(),
  status: 'all',
  onStatusChange: vi.fn(),
  dateFrom: '',
  onDateFromChange: vi.fn(),
  dateTo: '',
  onDateToChange: vi.fn(),
  onClear: vi.fn(),
  activeCount: 0,
}

// ── 3.4 Header do card ────────────────────────────────────────────────────────

describe('PurchasesTable — 3.4 Header do card', () => {
  it('renderiza label "LISTAGEM DE ORDENS" (case-insensitive)', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText(/listagem de ordens/i)).toBeInTheDocument()
  })

  it('renderiza botão "Filtros" com aria-label acessível', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('button', { name: /abrir filtros/i })).toBeInTheDocument()
  })

  it('renderiza botão "Exportar CSV" com aria-label acessível', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('button', { name: /exportar csv/i })).toBeInTheDocument()
  })

  it('seção tem aria-label "Listagem de ordens de compra"', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(
      screen.getByRole('region', { name: /listagem de ordens de compra/i }),
    ).toBeInTheDocument()
  })
})

// ── 3.1 Estrutura da tabela ───────────────────────────────────────────────────

describe('PurchasesTable — 3.1 Estrutura da tabela', () => {
  it('renderiza tabela com aria-label correto', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(
      screen.getByRole('table', { name: /tabela de ordens de compra/i }),
    ).toBeInTheDocument()
  })

  it('renderiza exatamente 6 cabeçalhos de coluna', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const table = screen.getByRole('table', { name: /tabela de ordens de compra/i })
    const headers = within(table).getAllByRole('columnheader')
    expect(headers).toHaveLength(6)
  })

  it('cabeçalho "ID Pedido" está presente', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('columnheader', { name: /id pedido/i })).toBeInTheDocument()
  })

  it('cabeçalho "Fornecedor" está presente', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('columnheader', { name: /fornecedor/i })).toBeInTheDocument()
  })

  it('cabeçalho "Data Emissão" está presente', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('columnheader', { name: /data emissão/i })).toBeInTheDocument()
  })

  it('cabeçalho "Valor Total" está presente', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('columnheader', { name: /valor total/i })).toBeInTheDocument()
  })

  it('cabeçalho "Status" está presente', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
  })

  it('renderiza exatamente 5 linhas de dados quando recebe 5 ordens', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const table = screen.getByRole('table', { name: /tabela de ordens de compra/i })
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(6) // 1 header + 5 data
  })

  it('renderiza o número correto de linhas para um mock completo (15 ordens)', () => {
    render(<PurchasesTable orders={purchasesMockPage} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const table = screen.getByRole('table', { name: /tabela de ordens de compra/i })
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(purchasesMockPage.length + 1)
  })
})

// ── 3.1 Dados dos 5 registros exatos da imagem de referência ─────────────────

describe('PurchasesTable — 3.1 Dados dos registros de referência', () => {
  it('exibe ID "#PUR-8821" em destaque', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('#PUR-8821')).toBeInTheDocument()
  })

  it('exibe fornecedor "Bosch Global Parts" em bold', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('Bosch Global Parts')).toBeInTheDocument()
  })

  it('exibe supplierTag "PREMIUM VENDOR" abaixo do nome do fornecedor', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('PREMIUM VENDOR')).toBeInTheDocument()
  })

  it('exibe valor de PUR-8821 como BRL formatado', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    // 12450 → R$ 12.450,00 — regex evita dependência do separador unicode
    expect(screen.getByText(/12\.450,00/)).toBeInTheDocument()
  })

  it('exibe ID "#PUR-8845" (Continental Tyres — pending)', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('#PUR-8845')).toBeInTheDocument()
    expect(screen.getByText('Continental Tyres Br')).toBeInTheDocument()
  })

  it('exibe ID "#PUR-8851" (Magneti Marelli — pending)', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('#PUR-8851')).toBeInTheDocument()
    expect(screen.getByText('Magneti Marelli Tech')).toBeInTheDocument()
  })

  it('exibe ID "#PUR-8799" (Z-Parts — cancelled)', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('#PUR-8799')).toBeInTheDocument()
    expect(screen.getByText('Z-Parts Distribuitor')).toBeInTheDocument()
  })

  it('exibe ID "#PUR-8855" (NGK Spark Plugs — received)', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getByText('#PUR-8855')).toBeInTheDocument()
    expect(screen.getByText('NGK Spark Plugs')).toBeInTheDocument()
  })

  it('exibe data de PUR-8821 formatada em pt-BR', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    // "2023-10-12" → contém "out" (outubro em pt-BR) e "2023"
    const rows = screen.getAllByRole('row')
    const purRow = rows.find((r) => within(r).queryByText('#PUR-8821'))
    expect(purRow).toBeDefined()
    expect(within(purRow!).getByText(/out/i)).toBeInTheDocument()
  })
})

// ── 3.2 Badges de status ──────────────────────────────────────────────────────

describe('PurchasesTable — 3.2 Badges de status', () => {
  it('renderiza pelo menos um badge "Received" para o mock de referência', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getAllByText('Received').length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza pelo menos um badge "Pending" para o mock de referência', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    // String exata evita bater em supplierTag "LOGISTICS PENDING"
    expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza pelo menos um badge "Cancelled" para o mock de referência', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.getAllByText('Cancelled').length).toBeGreaterThanOrEqual(1)
  })

  it('badge tem aria-label descritivo para acessibilidade', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    // getAllByLabelText pois pode haver múltiplos badges do mesmo status
    expect(screen.getAllByLabelText(/status: received/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByLabelText(/status: pending/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByLabelText(/status: cancelled/i).length).toBeGreaterThanOrEqual(1)
  })

  it('count de badges "Received" corresponde ao número de recebidos no mock', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const receivedCount = REFERENCE_ORDERS.filter((o) => o.status === 'received').length
    expect(screen.getAllByText('Received')).toHaveLength(receivedCount)
  })

  it('count de badges "Pending" corresponde ao número de pendentes no mock', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    // String exata evita match em supplierTag "LOGISTICS PENDING"
    const pendingCount = REFERENCE_ORDERS.filter((o) => o.status === 'pending').length
    expect(screen.getAllByText('Pending')).toHaveLength(pendingCount)
  })

  it('count de badges "Cancelled" corresponde ao número de cancelados no mock', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const cancelledCount = REFERENCE_ORDERS.filter((o) => o.status === 'cancelled').length
    expect(screen.getAllByText('Cancelled')).toHaveLength(cancelledCount)
  })
})

// ── 3.3 Menu kebab ────────────────────────────────────────────────────────────

describe('PurchasesTable — 3.3 Menu kebab', () => {
  it('renderiza um botão de ações por linha de dados', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const kebabBtns = screen.getAllByRole('button', { name: /mais ações para/i })
    expect(kebabBtns).toHaveLength(REFERENCE_ORDERS.length)
  })

  it('dropdown não está visível antes do clique', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar no kebab de PUR-8821 abre o dropdown com as 3 opções', async () => {
    const user = userEvent.setup()
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8821/i }))

    const menu = screen.getByRole('menu')
    expect(within(menu).getByRole('menuitem', { name: /ver detalhes/i })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /editar ordem/i })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('botão kebab tem aria-expanded=true quando o menu está aberto', async () => {
    const user = userEvent.setup()
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const btn = screen.getByRole('button', { name: /mais ações para PUR-8821/i })
    await user.click(btn)

    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('botão kebab tem aria-expanded=false quando o menu está fechado', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    const btn = screen.getByRole('button', { name: /mais ações para PUR-8821/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('clicar numa opção do menu fecha o dropdown', async () => {
    const user = userEvent.setup()
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8821/i }))
    await user.click(screen.getByRole('menuitem', { name: /ver detalhes/i }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar fora do dropdown fecha o menu', async () => {
    const user = userEvent.setup()
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8821/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Clicar fora — no heading da tabela
    await user.click(screen.getByRole('columnheader', { name: /id pedido/i }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar no kebab de uma linha diferente fecha o menu anterior e abre o novo', async () => {
    const user = userEvent.setup()
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8821/i }))
    expect(screen.getByRole('menu', { name: /PUR-8821/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8845/i }))
    expect(screen.queryByRole('menu', { name: /PUR-8821/i })).not.toBeInTheDocument()
    expect(screen.getByRole('menu', { name: /PUR-8845/i })).toBeInTheDocument()
  })

  it('apenas um menu está aberto por vez', async () => {
    const user = userEvent.setup()
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8821/i }))
    await user.click(screen.getByRole('button', { name: /mais ações para PUR-8845/i }))

    expect(screen.getAllByRole('menu')).toHaveLength(1)
  })
})

// ── 4.2 Painel de filtros ─────────────────────────────────────────────────────

describe('PurchasesTable — 4.2 Painel de filtros', () => {
  it('painel não renderiza quando isOpen=false', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.queryByRole('region', { name: /painel de filtros/i })).not.toBeInTheDocument()
  })

  it('painel renderiza quando isOpen=true', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true }}
        onExportCsv={vi.fn()}
      />,
    )

    expect(screen.getByRole('region', { name: /painel de filtros/i })).toBeInTheDocument()
  })

  it('seletor de status com 4 opções (Todos, Received, Pending, Cancelled) está presente', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true }}
        onExportCsv={vi.fn()}
      />,
    )

    const select = screen.getByRole('combobox', { name: /filtrar por status/i })
    expect(select).toBeInTheDocument()
    expect(within(select as HTMLSelectElement).getAllByRole('option')).toHaveLength(4)
  })

  it('input "Data inicial" está presente no painel', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true }}
        onExportCsv={vi.fn()}
      />,
    )

    expect(screen.getByLabelText(/data inicial/i)).toBeInTheDocument()
  })

  it('input "Data final" está presente no painel', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true }}
        onExportCsv={vi.fn()}
      />,
    )

    expect(screen.getByLabelText(/data final/i)).toBeInTheDocument()
  })

  it('botão "Limpar filtros" está presente no painel', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true }}
        onExportCsv={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument()
  })

  it('clicar "Limpar filtros" chama onClear', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true, onClear }}
        onExportCsv={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(onClear).toHaveBeenCalledOnce()
  })

  it('clicar no botão "Filtros" chama onToggle', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, onToggle }}
        onExportCsv={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('botão "Filtros" tem aria-expanded=true quando isOpen=true', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true }}
        onExportCsv={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: /abrir filtros/i }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('badge de activeCount aparece quando activeCount > 0', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, activeCount: 2 }}
        onExportCsv={vi.fn()}
      />,
    )

    expect(screen.getByLabelText(/2 filtros ativos/i)).toBeInTheDocument()
  })

  it('badge de activeCount não aparece quando activeCount = 0', () => {
    render(<PurchasesTable orders={REFERENCE_ORDERS} filterPanel={defaultFilterPanel} onExportCsv={vi.fn()} />)

    expect(screen.queryByLabelText(/filtros ativos/i)).not.toBeInTheDocument()
  })

  it('alterar o select de status chama onStatusChange com o valor correto', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={{ ...defaultFilterPanel, isOpen: true, onStatusChange }}
        onExportCsv={vi.fn()}
      />,
    )

    await user.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'pending',
    )

    expect(onStatusChange).toHaveBeenCalledWith('pending')
  })
})

// ── 6.1/6.2 Exportar CSV ────────────────────────────────────────────────

describe('PurchasesTable — 6.1/6.2 Exportar CSV', () => {
  it('botão "Exportar CSV" chama onExportCsv ao clicar', async () => {
    const user = userEvent.setup()
    const onExportCsv = vi.fn().mockReturnValue(15)
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={defaultFilterPanel}
        onExportCsv={onExportCsv}
      />,
    )

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(onExportCsv).toHaveBeenCalledOnce()
  })

  it('exibe toast "15 ordens exportadas" após clicar em exportar', async () => {
    const user = userEvent.setup()
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={defaultFilterPanel}
        onExportCsv={vi.fn().mockReturnValue(15)}
      />,
    )

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(screen.getByRole('status')).toHaveTextContent('15 ordens exportadas')
  })

  it('toast exibe singular "1 ordem exportada" quando count = 1', async () => {
    const user = userEvent.setup()
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={defaultFilterPanel}
        onExportCsv={vi.fn().mockReturnValue(1)}
      />,
    )

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(screen.getByRole('status')).toHaveTextContent('1 ordem exportada')
  })

  it('toast tem aria-live="polite" para acessibilidade', async () => {
    const user = userEvent.setup()
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={defaultFilterPanel}
        onExportCsv={vi.fn().mockReturnValue(5)}
      />,
    )

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('toast não está visível antes de clicar em exportar', () => {
    render(
      <PurchasesTable
        orders={REFERENCE_ORDERS}
        filterPanel={defaultFilterPanel}
        onExportCsv={vi.fn().mockReturnValue(15)}
      />,
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
