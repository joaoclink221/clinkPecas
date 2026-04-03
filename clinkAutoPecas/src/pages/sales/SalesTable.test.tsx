import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Sale } from './sales.types'
import { SalesTable } from './SalesTable'

const mockSales: Sale[] = [
  {
    id: 'VD-001',
    customerName: 'Apex Autopeças Ltda',
    customerDoc: '13.579.246/0001-80',
    date: '2024-01-20',
    paymentMethod: 'Pix',
    discount: 0,
    totalValue: 2750.0,
    status: 'completed',
  },
  {
    id: 'VD-002',
    customerName: 'Roberta Cavalcanti',
    customerDoc: '024.680.135-79',
    date: '2024-01-15',
    paymentMethod: 'Cartão',
    installments: 3,
    discount: 50.0,
    totalValue: 950.0,
    status: 'pending',
  },
  {
    id: 'VD-003',
    customerName: 'PrimePeças Distribuidora',
    customerDoc: '24.680.135/0001-79',
    date: '2024-01-08',
    paymentMethod: 'Boleto',
    discount: 0,
    totalValue: 4100.0,
    status: 'cancelled',
  },
]

function renderTable(sales = mockSales) {
  return render(<SalesTable sales={sales} />)
}

describe('SalesTable — 4.1 Estrutura das colunas', () => {
  it('renderiza as 8 colunas de cabeçalho', () => {
    renderTable()

    const table = screen.getByRole('table', { name: /tabela de vendas/i })
    const headers = within(table).getAllByRole('columnheader')
    expect(headers).toHaveLength(8)
  })

  it('exibe Order ID com estilo teal (text-primary)', () => {
    renderTable()

    const idCell = screen.getByText('VD-001')
    expect(idCell.className).toContain('text-primary')
  })

  it('exibe nome do cliente e documento na mesma célula', () => {
    renderTable()

    const row = screen.getByText('Apex Autopeças Ltda').closest('tr')!
    expect(within(row).getByText('13.579.246/0001-80')).toBeInTheDocument()
  })

  it('formata a data no padrão DD/MM/YYYY', () => {
    renderTable()

    expect(screen.getByText('20/01/2024')).toBeInTheDocument()
  })

  it('exibe parcelas quando installments > 1', () => {
    renderTable()

    const row = screen.getByText('Roberta Cavalcanti').closest('tr')!
    expect(within(row).getByText('(3×)')).toBeInTheDocument()
  })

  it('não exibe parcelas quando installments é 1 ou indefinido', () => {
    renderTable()

    const row = screen.getByText('Apex Autopeças Ltda').closest('tr')!
    expect(within(row).queryByText(/×/)).not.toBeInTheDocument()
  })

  it('exibe desconto em vermelho quando maior que zero', () => {
    renderTable()

    const discountCell = screen.getByText(/-R\$\s*50,00/i)
    expect(discountCell.className).toContain('text-on-error-container')
  })

  it('exibe R$ 0,00 em muted quando desconto é zero', () => {
    renderTable()

    const row = screen.getByText('Apex Autopeças Ltda').closest('tr')!
    const zeroDiscount = within(row).getByText(/R\$\s*0,00/)
    expect(zeroDiscount.className).toContain('text-on-surface-variant')
  })

  it('exibe total value em negrito', () => {
    renderTable()

    const totalCell = screen.getByText(/2\.750/)
    expect(totalCell.className).toContain('font-semibold')
  })

  it('renderiza botão de ações para cada linha', () => {
    renderTable()

    const actionButtons = screen.getAllByRole('button', { name: /ações para VD-/i })
    expect(actionButtons).toHaveLength(mockSales.length)
  })
})

describe('SalesTable — 4.2 Badges de status', () => {
  it('exibe badge "Completed" para status completed', () => {
    renderTable()

    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('exibe badge "Pending" para status pending', () => {
    renderTable()

    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('exibe badge "Cancelled" para status cancelled', () => {
    renderTable()

    expect(screen.getByText('Cancelled')).toBeInTheDocument()
  })

  it('badge completed tem classe de cor verde semântica', () => {
    renderTable([mockSales[0]])

    const badge = screen.getByText('Completed')
    expect(badge.className).toContain('bg-status-completed-bg')
    expect(badge.className).toContain('text-status-completed-fg')
  })

  it('badge pending tem classe de cor roxa semântica', () => {
    renderTable([mockSales[1]])

    const badge = screen.getByText('Pending')
    expect(badge.className).toContain('bg-status-pending-bg')
    expect(badge.className).toContain('text-status-pending-fg')
  })

  it('badge cancelled tem classe de cor coral semântica', () => {
    renderTable([mockSales[2]])

    const badge = screen.getByText('Cancelled')
    expect(badge.className).toContain('bg-status-cancelled-bg')
    expect(badge.className).toContain('text-status-cancelled-fg')
  })

  it('badge tem rounded-full (formato pill)', () => {
    renderTable([mockSales[0]])

    const badge = screen.getByText('Completed')
    expect(badge.className).toContain('rounded-full')
  })
})

describe('SalesTable — 4.3 Ícones de método de pagamento', () => {
  it('renderiza ícone acessível para Pix', () => {
    renderTable([mockSales[0]])

    expect(screen.getByLabelText('Pix')).toBeInTheDocument()
  })

  it('renderiza ícone acessível para Cartão', () => {
    renderTable([mockSales[1]])

    expect(screen.getByLabelText('Cartão')).toBeInTheDocument()
  })

  it('renderiza ícone acessível para Boleto', () => {
    renderTable([mockSales[2]])

    expect(screen.getByLabelText('Boleto')).toBeInTheDocument()
  })

  it('renderiza ícone para Dinheiro', () => {
    const dinheiroSale: Sale = { ...mockSales[0], id: 'VD-D', paymentMethod: 'Dinheiro' }
    render(<SalesTable sales={[dinheiroSale]} />)

    expect(screen.getByLabelText('Dinheiro')).toBeInTheDocument()
  })
})

describe('SalesTable — estado vazio', () => {
  it('exibe mensagem quando não há vendas', () => {
    renderTable([])

    expect(screen.getByRole('status')).toHaveTextContent(
      /nenhuma venda encontrada/i,
    )
  })

  it('não renderiza tabela quando lista está vazia', () => {
    renderTable([])

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
