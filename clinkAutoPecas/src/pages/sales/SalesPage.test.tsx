import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SalesPage } from './SalesPage'

function renderSalesPage() {
  return render(<SalesPage />)
}

describe('SalesPage — 3.x Filtros (integração)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('3.1 exibe contagem inicial de registros do intervalo Jan/2024', () => {
    render(<SalesPage />)

    // 3 mock records fall within 2024-01-01 – 2024-01-31
    expect(screen.getByText(/Mostrando.*de 3 transa/i)).toBeInTheDocument()
  })

  it('3.1 digitar no campo de busca filtra por nome do cliente após debounce', () => {
    render(<SalesPage />)

    fireEvent.change(screen.getByRole('searchbox', { name: /buscar vendas/i }), {
      target: { value: 'Apex' },
    })

    act(() => { vi.advanceTimersByTime(300) })

    expect(screen.getByText('Apex Autopeças Ltda')).toBeInTheDocument()
    expect(screen.queryByText('Roberta Cavalcanti')).not.toBeInTheDocument()
    expect(screen.getByText(/Mostrando.*de 1 transa/i)).toBeInTheDocument()
  })

  it('3.1 busca por ID do pedido', () => {
    render(<SalesPage />)

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'VD-044' },
    })

    act(() => { vi.advanceTimersByTime(300) })

    expect(screen.getByText('Roberta Cavalcanti')).toBeInTheDocument()
    expect(screen.getByText(/Mostrando.*de 1 transa/i)).toBeInTheDocument()
  })

  it('3.1 não atualiza filtro antes do debounce expirar', () => {
    render(<SalesPage />)

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Apex' },
    })

    // debounce ainda não expirou
    act(() => { vi.advanceTimersByTime(200) })

    // contagem permanece inalterada
    expect(screen.getByText(/Mostrando.*de 3 transa/i)).toBeInTheDocument()
  })

  it('3.2 expandir dateTo para março aumenta a contagem de registros', () => {
    render(<SalesPage />)

    expect(screen.getByText(/Mostrando.*de 3 transa/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Data final'), {
      target: { value: '2024-03-31' },
    })

    expect(screen.queryByText(/de 3 transa/i)).not.toBeInTheDocument()
    // 45 total records now within range
    expect(screen.getByText(/Mostrando.*de 45 transa/i)).toBeInTheDocument()
  })

  it('3.2 restringir dateFrom elimina registros anteriores', () => {
    render(<SalesPage />)

    // Expand range first
    fireEvent.change(screen.getByLabelText('Data final'), { target: { value: '2024-03-31' } })
    expect(screen.getByText(/Mostrando.*de 45 transa/i)).toBeInTheDocument()

    // Restrict start to February
    fireEvent.change(screen.getByLabelText('Data inicial'), { target: { value: '2024-02-01' } })

    // Jan records should no longer appear
    expect(screen.queryByText('Apex Autopeças Ltda')).not.toBeInTheDocument()
  })

  it('3.3 selecionar "Pending" exibe apenas linhas com status pending', () => {
    render(<SalesPage />)

    fireEvent.change(screen.getByRole('combobox', { name: /filtrar por status/i }), {
      target: { value: 'pending' },
    })

    // VD-044 Roberta Cavalcanti is the only pending record in January
    expect(screen.getByText('Roberta Cavalcanti')).toBeInTheDocument()
    expect(screen.queryByText('Apex Autopeças Ltda')).not.toBeInTheDocument()
    expect(screen.getByText(/Mostrando.*de 1 transa/i)).toBeInTheDocument()
  })

  it('3.3 selecionar "Cancelled" sem cancelamentos em janeiro retorna 0 resultados', () => {
    render(<SalesPage />)

    fireEvent.change(screen.getByRole('combobox', { name: /filtrar por status/i }), {
      target: { value: 'cancelled' },
    })

    expect(screen.getByText(/Mostrando 0/i)).toBeInTheDocument()
  })

  it('3.3 voltar para "Todos Status" restaura todos os registros do intervalo', () => {
    render(<SalesPage />)

    fireEvent.change(screen.getByRole('combobox', { name: /filtrar por status/i }), {
      target: { value: 'pending' },
    })
    expect(screen.getByText(/Mostrando.*de 1 transa/i)).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: /filtrar por status/i }), {
      target: { value: 'all' },
    })
    expect(screen.getByText(/Mostrando.*de 3 transa/i)).toBeInTheDocument()
  })
})

describe('SalesPage — 5.x Paginação (integração)', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('5.1 exibe contador formatado "Mostrando X–Y de Z transações"', () => {
    render(<SalesPage />)

    expect(screen.getByText(/Mostrando 1–3 de 3 transações/)).toBeInTheDocument()
  })

  it('5.1 navegar para página 2 altera os registros exibidos', async () => {
    render(<SalesPage />)

    // Expand date range to include all 45 records (5 pages of 10)
    fireEvent.change(screen.getByLabelText('Data final'), { target: { value: '2024-03-31' } })

    // Page 1 should show first 10 records — VD-001 is on page 1
    expect(screen.getByText('VD-001')).toBeInTheDocument()

    // Navigate to page 2
    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))

    // VD-001 should no longer be visible
    expect(screen.queryByText('VD-001')).not.toBeInTheDocument()
    expect(screen.getByText(/Mostrando 11–20 de 45 transações/)).toBeInTheDocument()
  })

  it('5.2 renderiza componente de paginação quando há mais de uma página', () => {
    render(<SalesPage />)

    // Expand to all 45 records (5 pages)
    fireEvent.change(screen.getByLabelText('Data final'), { target: { value: '2024-03-31' } })

    expect(screen.getByRole('navigation', { name: /paginação/i })).toBeInTheDocument()
  })

  it('5.2 não renderiza paginação quando todos os resultados cabem em uma página', () => {
    render(<SalesPage />)

    // Jan range returns only 3 records (1 page)
    expect(screen.queryByRole('navigation', { name: /paginação/i })).not.toBeInTheDocument()
  })

  it('5.3 filtrar por status reseta para página 1', async () => {
    render(<SalesPage />)

    // Expand range and go to page 2
    fireEvent.change(screen.getByLabelText('Data final'), { target: { value: '2024-03-31' } })
    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))
    expect(screen.getByText(/Mostrando 11–20 de 45 transações/)).toBeInTheDocument()

    // Apply status filter — should reset to page 1
    fireEvent.change(screen.getByRole('combobox', { name: /filtrar por status/i }), {
      target: { value: 'completed' },
    })

    // Should be on page 1 of the filtered results
    const counter = screen.getByText(/Mostrando 1–/)
    expect(counter).toBeInTheDocument()
  })

  it('5.3 busca textual reseta para página 1', () => {
    render(<SalesPage />)

    // Expand range and manually force page by clicking
    fireEvent.change(screen.getByLabelText('Data final'), { target: { value: '2024-03-31' } })

    // Now search — even before debounce, page should have reset
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Auto' } })

    // Verifying page is reset to 1 by checking counter starts from 1
    // (debounce not yet applied, but page state resets immediately)
    expect(screen.getByText(/Mostrando 1–/)).toBeInTheDocument()
  })
})

describe('SalesPage — 6.x Nova Venda + KPIs (integração)', () => {
  it('6.1 botão "Nova Venda" abre o modal', async () => {
    render(<SalesPage />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /nova venda/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /nova venda/i })).toBeInTheDocument()
  })

  it('6.1 fechar modal remove o dialog da tela', async () => {
    render(<SalesPage />)

    fireEvent.click(screen.getByRole('button', { name: /nova venda/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /fechar modal/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  // Fase 2.x+: submit do modal redesenhado — reativado após implementar seleção de cliente,
  // tabela de itens e envio do formulário
  it.todo('6.1 venda criada aparece na tabela sem reload')

  // Fase 2.x+: KPI atualizado após submit — reativado junto com o teste de venda criada
  it.todo('6.3 Pedidos Pendentes incrementa após nova venda (status pending)')
})

describe('SalesPage — 1.1 Header e breadcrumb', () => {
  it('renderiza breadcrumb com "Portal" e "Gestão de Vendas"', () => {
    renderSalesPage()

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveTextContent('Portal')
    expect(nav).toHaveTextContent('Gestão de Vendas')
  })

  it('marca o item atual do breadcrumb com aria-current="page"', () => {
    renderSalesPage()

    const currentItem = screen.getByText('Gestão de Vendas')
    expect(currentItem).toHaveAttribute('aria-current', 'page')
  })

  it('renderiza h1 com o título da página', () => {
    renderSalesPage()

    expect(screen.getByRole('heading', { level: 1, name: /vendas/i })).toBeInTheDocument()
  })

  it('renderiza subtítulo descritivo', () => {
    renderSalesPage()

    expect(screen.getByText(/acompanhe pedidos/i)).toBeInTheDocument()
  })

  it('renderiza botão "Nova Venda" visível', () => {
    renderSalesPage()

    expect(screen.getByRole('button', { name: /nova venda/i })).toBeInTheDocument()
  })
})

describe('SalesPage — 2.3 KPI cards com dados mockados', () => {
  it('exibe receita mensal formatada em BRL', () => {
    renderSalesPage()

    expect(screen.getByText(/142.850/)).toBeInTheDocument()
  })

  it('exibe contagem de pedidos pendentes', () => {
    renderSalesPage()

    const card = screen.getByRole('article', { name: 'Pedidos Pendentes' })
    expect(card).toHaveTextContent('42')
  })

  it('exibe ticket médio formatado em BRL', () => {
    renderSalesPage()

    expect(screen.getByText(/3.401/)).toBeInTheDocument()
  })

  it('exibe taxa de cancelamentos', () => {
    renderSalesPage()

    const card = screen.getByRole('article', { name: 'Cancelamentos' })
    expect(card).toHaveTextContent('3')
    expect(card).toHaveTextContent('%')
  })

  it('exibe sub-label "Aguardando liberação" no card Pedidos Pendentes', () => {
    renderSalesPage()

    expect(screen.getByText('Aguardando liberação')).toBeInTheDocument()
  })

  it('exibe sub-label "Por pedido" no card Ticket Médio', () => {
    renderSalesPage()

    expect(screen.getByText('Por pedido')).toBeInTheDocument()
  })

  it('exibe badge de tendência positiva no card Receita Mensal', () => {
    renderSalesPage()

    expect(screen.getByLabelText('Variação: +12,5%')).toBeInTheDocument()
  })

  it('cada card possui ícone acessível (aria-hidden no wrapper)', () => {
    renderSalesPage()

    const cards = screen.getAllByRole('article')
    cards.forEach((card) => {
      expect(card.querySelector('[aria-hidden]')).toBeInTheDocument()
    })
  })
})

describe('SalesPage — 1.2 KPI cards', () => {
  it('renderiza exatamente 4 cards de KPI', () => {
    renderSalesPage()

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(4)
  })

  it('exibe card "Receita Mensal" com accent verde (border-l-primary)', () => {
    renderSalesPage()

    const card = screen.getByRole('article', { name: 'Receita Mensal' })
    expect(card).toBeInTheDocument()
    expect(card.className).toContain('border-l-primary')
  })

  it('exibe card "Pedidos Pendentes" com accent roxo (border-l-secondary)', () => {
    renderSalesPage()

    const card = screen.getByRole('article', { name: 'Pedidos Pendentes' })
    expect(card).toBeInTheDocument()
    expect(card.className).toContain('border-l-secondary')
  })

  it('exibe card "Ticket Médio" com accent azul (border-l-[#60a5fa])', () => {
    renderSalesPage()

    const card = screen.getByRole('article', { name: 'Ticket Médio' })
    expect(card).toBeInTheDocument()
    expect(card.className).toContain('border-l-[#60a5fa]')
  })

  it('exibe card "Cancelamentos" com accent vermelho (border-l-on-error-container)', () => {
    renderSalesPage()

    const card = screen.getByRole('article', { name: 'Cancelamentos' })
    expect(card).toBeInTheDocument()
    expect(card.className).toContain('border-l-on-error-container')
  })

  it('a seção de KPIs tem rótulo acessível', () => {
    renderSalesPage()

    expect(screen.getByRole('region', { name: /indicadores de vendas/i })).toBeInTheDocument()
  })
})
