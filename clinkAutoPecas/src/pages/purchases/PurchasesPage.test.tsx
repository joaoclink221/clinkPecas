import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { purchasesKpiMock } from './mock-data'
import { PurchasesPage } from './PurchasesPage'


describe('PurchasesPage — 1.1 Header', () => {
  it('renderiza o h1 "Ordens de Compra"', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /ordens de compra/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o subtítulo de gerenciamento', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByText(/gerenciamento de suprimentos e relações com fornecedores/i),
    ).toBeInTheDocument()
  })

  it('renderiza o botão "Novo Pedido"', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /novo pedido/i })).toBeInTheDocument()
  })

  it('botão "Novo Pedido" é do tipo button', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /novo pedido/i })).toHaveAttribute('type', 'button')
  })
})

describe('PurchasesPage — 1.1 Busca global', () => {
  it('renderiza o campo de busca com placeholder correto', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('searchbox', { name: /buscar pedido ou fornecedor/i }),
    ).toBeInTheDocument()
  })

  it('campo de busca aceita digitação', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    const input = screen.getByRole('searchbox', { name: /buscar pedido ou fornecedor/i })
    await user.type(input, 'Bosch')

    expect(input).toHaveValue('Bosch')
  })

  it('campo de busca começa vazio', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('searchbox', { name: /buscar pedido ou fornecedor/i }),
    ).toHaveValue('')
  })
})

describe('PurchasesPage — 1.2 Cards KPI', () => {
  it('renderiza exatamente 4 cards KPI', () => {
    render(<PurchasesPage />)

    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('card "Total Mensal" está presente com valor do mock', () => {
    render(<PurchasesPage />)

    const card = screen.getByRole('article', { name: /total mensal/i })
    // Regex evita dependência do caráter de espaço que Intl.NumberFormat pode inserir (\u202F)
    expect(card).toHaveTextContent(/142\.850/)
  })

  it('card "Total Mensal" exibe badge de tendência do mock', () => {
    render(<PurchasesPage />)

    const trend = purchasesKpiMock.trendTotalMonthly
      .toLocaleString('pt-BR', { minimumFractionDigits: 1 })
    expect(screen.getByText(new RegExp(`\\+${trend}% vs mês anterior`, 'i'))).toBeInTheDocument()
  })

  it('card "Pedidos Pendentes" está presente com valor do mock', () => {
    render(<PurchasesPage />)

    const card = screen.getByRole('article', { name: /pedidos pendentes/i })
    // valor é padStart(2, '0'): ex. 24 → "24"
    expect(card).toHaveTextContent(String(purchasesKpiMock.pendingOrders).padStart(2, '0'))
  })

  it('card "Pedidos Pendentes" exibe subLabel "Aguardando confirmação"', () => {
    render(<PurchasesPage />)

    expect(screen.getByText('Aguardando confirmação')).toBeInTheDocument()
  })

  it('card "Recebidos (30d)" está presente com valor do mock', () => {
    render(<PurchasesPage />)

    const card = screen.getByRole('article', { name: /recebidos/i })
    expect(card).toHaveTextContent(String(purchasesKpiMock.receivedLast30d))
  })

  it('card "Recebidos (30d)" exibe eficiência de entrega do mock', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByText(new RegExp(`eficiência de entrega: ${purchasesKpiMock.deliveryEfficiency}%`, 'i')),
    ).toBeInTheDocument()
  })

  it('card "Cancelados" está presente com valor do mock (padStart)', () => {
    render(<PurchasesPage />)

    const card = screen.getByRole('article', { name: /cancelados/i })
    expect(card).toHaveTextContent(String(purchasesKpiMock.cancelledOrders).padStart(2, '0'))
  })

  it('card "Cancelados" exibe subLabel de falha no fornecimento', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/falha no fornecimento/i)).toBeInTheDocument()
  })

  it('section de KPIs tem aria-label acessível', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('region', { name: /indicadores de compras/i }),
    ).toBeInTheDocument()
  })
})

describe('PurchasesPage — 1.3 Rodapé de métricas', () => {
  it('renderiza o rodapé com aria-label de métricas', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('contentinfo', { name: /métricas de suprimentos/i }),
    ).toBeInTheDocument()
  })

  it('exibe "Investimento Total Out" no rodapé', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/investimento total out/i)).toBeInTheDocument()
  })

  it('exibe valor do investimento total do mock', () => {
    render(<PurchasesPage />)

    // Regex evita dependência do caráter de espaço entre R$ e o número (Intl pode usar \u202F)
    expect(screen.getByText(/1\.244\.500,00/)).toBeInTheDocument()
  })

  it('exibe "Ticket Médio Pedido" no rodapé', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/ticket médio pedido/i)).toBeInTheDocument()
  })

  it('exibe valor do ticket médio do mock', () => {
    render(<PurchasesPage />)

    // Regex evita dependência do caráter de espaço entre R$ e o número (Intl pode usar \u202F)
    expect(screen.getByText(/5\.120,00/)).toBeInTheDocument()
  })

  it('exibe "Prazo Médio Pagamento" no rodapé', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/prazo médio pagamento/i)).toBeInTheDocument()
  })

  it('exibe valor do prazo médio em dias do mock', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(`${purchasesKpiMock.avgPaymentDays} Dias`)).toBeInTheDocument()
  })

  it('badge "Sync Active" está presente', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/sync active/i)).toBeInTheDocument()
  })

  it('badge Sync Active tem aria-label de status de sincronização', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByLabelText(/status de sincronização: ativo/i),
    ).toBeInTheDocument()
  })

  it('exibe o copyright "Obsidian Gear"', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/obsidian gear/i)).toBeInTheDocument()
  })
})

describe('PurchasesPage — 4.x Busca e filtros integrados', () => {
  it('4.1 — campo de busca está presente com placeholder correto', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByPlaceholderText(/buscar pedido ou fornecedor/i),
    ).toBeInTheDocument()
  })

  it('4.1 — digitar "Bosch Global" filtra para PUR-8821 após debounce', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.type(
      screen.getByRole('searchbox', { name: /buscar pedido ou fornecedor/i }),
      'Bosch Global',
    )

    // waitFor aguarda o debounce de 300ms completar sem fake timers
    await waitFor(() => {
      expect(screen.getByText('#PUR-8821')).toBeInTheDocument()
      expect(screen.queryByText('#PUR-8845')).not.toBeInTheDocument()
      expect(screen.queryByText('#PUR-8851')).not.toBeInTheDocument()
      expect(screen.queryByText('#PUR-8799')).not.toBeInTheDocument()
      expect(screen.queryByText('#PUR-8855')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('4.2 — clicar em "Filtros" abre o painel de filtros', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    expect(screen.queryByRole('region', { name: /painel de filtros/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))

    expect(screen.getByRole('region', { name: /painel de filtros/i })).toBeInTheDocument()
  })

  it('4.2 — selecionar "Pending" exibe PUR-8845 e PUR-8851 e oculta os demais de referência', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'pending',
    )

    expect(screen.getByText('#PUR-8845')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8851')).toBeInTheDocument()
    expect(screen.queryByText('#PUR-8821')).not.toBeInTheDocument()
    expect(screen.queryByText('#PUR-8799')).not.toBeInTheDocument()
    expect(screen.queryByText('#PUR-8855')).not.toBeInTheDocument()
  })

  it('4.2 — "Limpar filtros" restaura todos os registros', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'pending',
    )
    // Filtro aplicado — alguns IDs invisíveis
    expect(screen.queryByText('#PUR-8821')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /limpar filtros/i }))

    // Painel fechado e dados restaurados
    expect(screen.queryByRole('region', { name: /painel de filtros/i })).not.toBeInTheDocument()
    expect(screen.getByText('#PUR-8821')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8845')).toBeInTheDocument()
  })

  it('4.2 — badge de filtros ativos aparece ao selecionar status', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'cancelled',
    )

    expect(screen.getByLabelText(/1 filtros ativos/i)).toBeInTheDocument()
  })
})

describe('PurchasesPage — 5.x Paginação integrada', () => {
  it('5.1 — contador "Mostrando X de Y resultados" está presente', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/mostrando/i)).toBeInTheDocument()
    expect(screen.getByText(/resultados/i)).toBeInTheDocument()
  })

  it('5.1 — contador exibe "5 de 15" na página 1 sem filtros', () => {
    render(<PurchasesPage />)

    // Verifica presença dos valores numéricos no contador (spans individuais)
    const counter = screen.getByText(/mostrando/i).closest('p')
    expect(counter).toHaveTextContent('5')
    expect(counter).toHaveTextContent('15')
  })

  it('5.1 — contador tem aria-live="polite" para acessibilidade', () => {
    render(<PurchasesPage />)

    const counter = screen.getByText(/mostrando/i).closest('p')
    expect(counter).toHaveAttribute('aria-live', 'polite')
  })

  it('5.2 — nav de paginação está presente com aria-label correto', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('navigation', { name: /paginação de ordens de compra/i }),
    ).toBeInTheDocument()
  })

  it('5.2 — página 1 está destacada (aria-current="page") por padrão', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /^página 1$/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('5.2 — botão "Página anterior" está desabilitado na página 1', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('5.2 — exibe 3 botões de página para 15 registros com pageSize=5', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /^página 1$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^página 2$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^página 3$/i })).toBeInTheDocument()
  })

  it('5.2 — clicar na página 2 exibe os próximos 5 registros', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await new Promise((r) => setTimeout(r, 350))
    await user.click(screen.getByRole('button', { name: /^página 2$/i }))

    // Página 1: PUR-8821, PUR-8845, PUR-8851, PUR-8799, PUR-8855
    // Página 2: PUR-8760, PUR-8765, PUR-8770, PUR-8775, PUR-8780
    expect(screen.queryByText('#PUR-8821')).not.toBeInTheDocument()
    expect(screen.getByText('#PUR-8760')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8765')).toBeInTheDocument()
  })

  it('5.2 — página 2 tem aria-current="page" após navegação', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await new Promise((r) => setTimeout(r, 350))
    await user.click(screen.getByRole('button', { name: /^página 2$/i }))

    // userEvent.click envolve act() — DOM está atualizado após await
    expect(screen.getByRole('button', { name: /^página 2$/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('5.2 — filtrar por status reseta para página 1', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    // Aguarda o useEffect de debounce do mount inicial (DEBOUNCE_MS = 300ms) disparar,
    // garantindo que setCurrentPage(1) não seja chamado APÓS a navegação para página 2.
    await new Promise((r) => setTimeout(r, 350))

    // Navegar para página 2 (total: 15 registros, 3 páginas)
    await user.click(screen.getByRole('button', { name: /^página 2$/i }))
    expect(screen.getByRole('button', { name: /^página 2$/i })).toHaveAttribute('aria-current', 'page')

    // Abrir filtros e selecionar 'received' (8 resultados → 2 páginas, nav permanece visível)
    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'received',
    )

    // Deve voltar para página 1
    expect(screen.getByRole('button', { name: /^página 1$/i })).toHaveAttribute('aria-current', 'page')
  })
})

describe('PurchasesPage — 3.x Tabela de ordens integrada', () => {
  it('renderiza a seção "Listagem de ordens de compra"', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('region', { name: /listagem de ordens de compra/i }),
    ).toBeInTheDocument()
  })

  it('tabela de ordens está presente na página', () => {
    render(<PurchasesPage />)

    expect(
      screen.getByRole('table', { name: /tabela de ordens de compra/i }),
    ).toBeInTheDocument()
  })

  it('os 5 IDs de referência aparecem na tabela dentro da página', () => {
    render(<PurchasesPage />)

    expect(screen.getByText('#PUR-8821')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8845')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8851')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8799')).toBeInTheDocument()
    expect(screen.getByText('#PUR-8855')).toBeInTheDocument()
  })

  it('botões "Filtros" e "Exportar CSV" estão presentes na página', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /abrir filtros/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /exportar csv/i })).toBeInTheDocument()
  })

  it('label "LISTAGEM DE ORDENS" está presente na página', () => {
    render(<PurchasesPage />)

    expect(screen.getByText(/listagem de ordens/i)).toBeInTheDocument()
  })
})

// ── 6.x Exportar CSV ─────────────────────────────────────────────────────────

describe('PurchasesPage — 6.x Exportar CSV integrado', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url') as unknown as typeof URL.createObjectURL
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('6.1 — botão "Exportar CSV" está presente e clicável', () => {
    render(<PurchasesPage />)

    expect(screen.getByRole('button', { name: /exportar csv/i })).toBeInTheDocument()
  })

  it('6.1 — clicar em "Exportar CSV" exibe toast de confirmação', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('status').textContent).toMatch(/ordens? exportadas?/i)
  })

  it('6.1 — toast exibe "15 ordens exportadas" sem filtro ativo', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(screen.getByRole('status')).toHaveTextContent('15 ordens exportadas')
  })

  it('6.2 — exportar com filtro "received" ativo exibe contagem correta no toast', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /abrir filtros/i }))
    await user.selectOptions(
      screen.getByRole('combobox', { name: /filtrar por status/i }),
      'received',
    )

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    // 8 ordens com status "received" no mock
    expect(screen.getByRole('status')).toHaveTextContent('8 ordens exportadas')
  })

  it('6.2 — URL.createObjectURL é chamado ao exportar (confirma geração de Blob)', async () => {
    const user = userEvent.setup()
    render(<PurchasesPage />)

    await user.click(screen.getByRole('button', { name: /exportar csv/i }))

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  })
})
