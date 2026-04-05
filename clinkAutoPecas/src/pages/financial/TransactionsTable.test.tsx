import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { Transaction } from './financial.types'
import { TransactionsTable } from './TransactionsTable'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const receber: Transaction = {
  id: 'TR-001',
  ref: 'ORD-001',
  entityName: 'Cliente A',
  entityAvatarType: 'person',
  dueDate: '2024-06-10',
  method: 'pix',
  value: 1000,
  status: 'pago',
  type: 'receber',
}

const pagar: Transaction = {
  id: 'TR-002',
  ref: 'PUR-002',
  entityName: 'Fornecedor B',
  entityAvatarType: 'building',
  dueDate: '2024-07-05',
  method: 'boleto',
  value: 2500,
  status: 'pendente',
  type: 'pagar',
}

const atrasado: Transaction = {
  id: 'TR-003',
  ref: 'ORD-003',
  entityName: 'Oficina Mecânica Centro',
  entityAvatarType: 'workshop',
  dueDate: '2024-06-15',
  method: 'cartao',
  value: 890,
  status: 'atrasado',
  type: 'receber',
}

const fixtureTransactions: Transaction[] = [receber, pagar, atrasado]

// 5 transações do tipo "receber" para testar paginação (PAGE_SIZE=4 => 2 páginas)
const manyReceber: Transaction[] = Array.from({ length: 5 }, (_, i) => ({
  id: `TR-P${i}`,
  ref: `ORD-P${i}`,
  entityName: `Empresa ${i + 1}`,
  entityAvatarType: 'building' as const,
  dueDate: '2024-07-01',
  method: 'pix' as const,
  value: 1000 * (i + 1),
  status: 'pago' as const,
  type: 'receber' as const,
}))

// ── 5.1 Toggle Contas a Receber / Contas a Pagar ──────────────────────────────

describe('TransactionsTable — 5.1 Toggle', () => {
  it('renderiza o group de filtro com aria-label acessível', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(
      screen.getByRole('group', { name: /filtro de tipo de transação/i }),
    ).toBeInTheDocument()
  })

  it('"Contas a Receber" está ativo por padrão (aria-pressed=true)', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(
      screen.getByRole('button', { name: /contas a receber/i }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('"Contas a Pagar" está inativo por padrão (aria-pressed=false)', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(
      screen.getByRole('button', { name: /contas a pagar/i }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('exibe transação "receber" na vista padrão', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(screen.getByText('Cliente A')).toBeInTheDocument()
  })

  it('não exibe transação "pagar" na vista padrão', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(screen.queryByText('Fornecedor B')).not.toBeInTheDocument()
  })

  it('ao clicar "Contas a Pagar" exibe transações type=pagar', async () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))

    expect(screen.getByText('Fornecedor B')).toBeInTheDocument()
  })

  it('ao clicar "Contas a Pagar" oculta transações type=receber', async () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))

    expect(screen.queryByText('Cliente A')).not.toBeInTheDocument()
  })

  it('após trocar o toggle, "Contas a Pagar" fica aria-pressed=true', async () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))

    expect(
      screen.getByRole('button', { name: /contas a pagar/i }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: /contas a receber/i }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('voltando para "Contas a Receber" restaura as transações corretas', async () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))
    await userEvent.click(screen.getByRole('button', { name: /contas a receber/i }))

    expect(screen.getByText('Cliente A')).toBeInTheDocument()
    expect(screen.queryByText('Fornecedor B')).not.toBeInTheDocument()
  })
})

// ── 5.2 Estrutura da tabela ───────────────────────────────────────────────────

describe('TransactionsTable — 5.2 Estrutura', () => {
  it('renderiza a section com aria-label acessível', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(
      screen.getByRole('region', { name: /últimas movimentações/i }),
    ).toBeInTheDocument()
  })

  it('renderiza heading "Últimas Movimentações"', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(
      screen.getByRole('heading', { level: 2, name: /últimas movimentações/i }),
    ).toBeInTheDocument()
  })

  it('renderiza os 6 cabeçalhos de coluna', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    expect(screen.getByRole('columnheader', { name: /cliente\/beneficiário/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /vencimento/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /método/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /valor/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /ações/i })).toBeInTheDocument()
  })

  it('data de transação "atrasado" aparece em coral via inline style', () => {
    render(<TransactionsTable transactions={[atrasado]} />)

    // A data da Oficina Mecânica Centro deve ter color coral (#FC7C78)
    const dateEl = screen.getByText('15 Jun 2024')
    expect(dateEl).toHaveStyle({ color: '#FC7C78' })
  })

  it('data de transação "pago" não tem estilo coral', () => {
    render(<TransactionsTable transactions={[receber]} />)

    const dateEl = screen.getByText('10 Jun 2024')
    expect(dateEl).not.toHaveStyle({ color: '#FC7C78' })
  })

  it('exibe o nome da entidade e a referência', () => {
    render(<TransactionsTable transactions={[receber]} />)

    expect(screen.getByText('Cliente A')).toBeInTheDocument()
    expect(screen.getByText('ORD-001')).toBeInTheDocument()
  })

  it('exibe o valor formatado em BRL', () => {
    render(<TransactionsTable transactions={[receber]} />)

    // Intl formata 1000 como "R$\u00a01.000,00" em pt-BR
    expect(screen.getByText(/1\.000,00/)).toBeInTheDocument()
  })

  it('exibe a contagem no formato "Mostrando X–Y de 128 transações"', () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    // Vista padrão: receber = receber + atrasado = 2 (< PAGE_SIZE) => "1–2 de 128"
    expect(screen.getByText(/mostrando 1–2 de 128 transações/i)).toBeInTheDocument()
  })
})

// ── 5.3 Badges de status ──────────────────────────────────────────────────────

describe('TransactionsTable — 5.3 Badges', () => {
  it('badge PAGO renderiza com texto correto', () => {
    render(<TransactionsTable transactions={[receber]} />)

    expect(screen.getByText('PAGO')).toBeInTheDocument()
  })

  it('badge PENDENTE renderiza com texto correto', async () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))

    expect(screen.getByText('PENDENTE')).toBeInTheDocument()
  })

  it('badge ATRASADO renderiza com texto correto', () => {
    render(<TransactionsTable transactions={[atrasado]} />)

    expect(screen.getByText('ATRASADO')).toBeInTheDocument()
  })

  it('badge ATRASADO tem fundo coral sólido', () => {
    render(<TransactionsTable transactions={[atrasado]} />)

    const badge = screen.getByText('ATRASADO')
    expect(badge).toHaveStyle({ background: '#FC7C78', color: '#ffffff' })
  })

  it('badge PAGO tem fundo teal translúcido', () => {
    render(<TransactionsTable transactions={[receber]} />)

    const badge = screen.getByText('PAGO')
    expect(badge).toHaveStyle({ color: '#10B981' })
  })
})

// ── 5.4 Ícones de método de pagamento ────────────────────────────────────────

describe('TransactionsTable — 5.4 Ícones de método', () => {
  it('exibe label "Pix" para transação com method=pix', () => {
    render(<TransactionsTable transactions={[receber]} />)

    expect(screen.getByText('Pix')).toBeInTheDocument()
  })

  it('exibe label "Boleto" para transação com method=boleto', async () => {
    render(<TransactionsTable transactions={fixtureTransactions} />)

    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))

    expect(screen.getByText('Boleto')).toBeInTheDocument()
  })

  it('exibe label "Cartão" para transação com method=cartao', () => {
    render(<TransactionsTable transactions={[atrasado]} />)

    expect(screen.getByText('Cartão')).toBeInTheDocument()
  })
})

// ── Coluna de Ações ───────────────────────────────────────────────────────────

describe('TransactionsTable — Ações', () => {
  it('primeira linha tem botão "Adicionar ação"', () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    expect(screen.getByRole('button', { name: /adicionar ação/i })).toBeInTheDocument()
  })

  it('demais linhas têm botão "Mais ações"', () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    // Com 2 rows: 1 "Adicionar ação" + 1 "Mais ações"
    expect(screen.getByRole('button', { name: /mais ações/i })).toBeInTheDocument()
  })

  it('com múltiplas linhas há exatamente 1 botão "Adicionar ação"', () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    expect(screen.getAllByRole('button', { name: /adicionar ação/i })).toHaveLength(1)
  })
})

// ── 6.1 Paginação ──────────────────────────────────────────────────────────

describe('TransactionsTable — 6.1 Paginação', () => {
  it('página 1 mostra no máximo 4 linhas (PAGE_SIZE)', () => {
    render(<TransactionsTable transactions={manyReceber} />)

    // 5 receber, PAGE_SIZE=4 ⇒ página 1 tem 4 linhas + 1 thead = 5 rows
    expect(screen.getAllByRole('row')).toHaveLength(5)
  })

  it('contador mostra "1–4 de 128" na página 1', () => {
    render(<TransactionsTable transactions={manyReceber} />)

    expect(screen.getByText(/mostrando 1–4 de 128 transações/i)).toBeInTheDocument()
  })

  it('clicar em página 2 exibe os próximos registros', async () => {
    render(<TransactionsTable transactions={manyReceber} />)

    await userEvent.click(screen.getByRole('button', { name: /página 2/i }))

    expect(screen.getByText('Empresa 5')).toBeInTheDocument()
    expect(screen.queryByText('Empresa 1')).not.toBeInTheDocument()
  })

  it('contador atualiza para "5–5 de 128" na página 2', async () => {
    render(<TransactionsTable transactions={manyReceber} />)

    await userEvent.click(screen.getByRole('button', { name: /página 2/i }))

    expect(screen.getByText(/mostrando 5–5 de 128 transações/i)).toBeInTheDocument()
  })

  it('botão "Página anterior" está desabilitado na página 1', () => {
    render(<TransactionsTable transactions={manyReceber} />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('botão "Próxima página" está desabilitado na última página', async () => {
    render(<TransactionsTable transactions={manyReceber} />)

    await userEvent.click(screen.getByRole('button', { name: /página 2/i }))

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('trocar toggle reseta para página 1', async () => {
    const transactions = [
      ...manyReceber,
      { ...pagar, id: 'TR-PAG1', entityName: 'Fornecedor Z' },
    ]
    render(<TransactionsTable transactions={transactions} />)

    // Vai para página 2
    await userEvent.click(screen.getByRole('button', { name: /página 2/i }))
    expect(screen.getByText(/mostrando 5/i)).toBeInTheDocument()

    // Troca para "pagar" — deve resetar para página 1
    await userEvent.click(screen.getByRole('button', { name: /contas a pagar/i }))
    expect(screen.getByText(/mostrando 1/i)).toBeInTheDocument()
  })

  it('renderiza a nav de paginação com aria-label acessível', () => {
    render(<TransactionsTable transactions={manyReceber} />)

    expect(
      screen.getByRole('navigation', { name: /paginação de transações/i }),
    ).toBeInTheDocument()
  })

  it('página ativa tem aria-current="page"', () => {
    render(<TransactionsTable transactions={manyReceber} />)

    expect(screen.getByRole('button', { name: /página 1/i })).toHaveAttribute('aria-current', 'page')
  })

  it('não renderiza barra de paginação com menos de 2 páginas', () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    expect(screen.queryByRole('navigation', { name: /paginação/i })).not.toBeInTheDocument()
  })
})

// ── 6.2 Highlight de linha atrasada ───────────────────────────────────────────

describe('TransactionsTable — 6.2 Highlight de linha atrasada', () => {
  it('linha com status atrasado tem fundo coral sutil via inline style', () => {
    render(<TransactionsTable transactions={[atrasado]} />)

    // A linha da Oficina Mecânica Centro deve ter background rgba coral
    const row = screen.getByRole('row', { name: /oficina mecânica centro/i })
    expect(row).toHaveStyle({ background: 'rgba(252,124,120,0.05)' })
  })

  it('linha com status pago não tem fundo coral', () => {
    render(<TransactionsTable transactions={[receber]} />)

    const rows = screen.getAllByRole('row')
    const dataRow = rows[1] // index 0 = thead row
    expect(dataRow).not.toHaveStyle({ background: 'rgba(252,124,120,0.05)' })
  })
})

// ── 6.3 Dropdown mock do kebab ───────────────────────────────────────────────

describe('TransactionsTable — 6.3 Kebab dropdown', () => {
  it('botão kebab tem aria-expanded=false inicialmente', () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    expect(
      screen.getByRole('button', { name: /mais ações/i }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('clicar no kebab abre o menu (aria-expanded=true)', async () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    await userEvent.click(screen.getByRole('button', { name: /mais ações/i }))

    expect(
      screen.getByRole('button', { name: /mais ações/i }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('dropdown exibe 3 opções de menu', async () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    await userEvent.click(screen.getByRole('button', { name: /mais ações/i }))

    expect(screen.getByRole('menuitem', { name: /visualizar detalhes/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /marcar como pago/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /cancelar transação/i })).toBeInTheDocument()
  })

  it('clicar em um menuitem fecha o dropdown', async () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    await userEvent.click(screen.getByRole('button', { name: /mais ações/i }))
    await userEvent.click(screen.getByRole('menuitem', { name: /marcar como pago/i }))

    expect(
      screen.getByRole('button', { name: /mais ações/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('menu não está visível antes de clicar no kebab', () => {
    render(<TransactionsTable transactions={[receber, atrasado]} />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

// ── Integridade geral ─────────────────────────────────────────────────────────

describe('TransactionsTable — Integridade', () => {
  it('renderiza sem erros com dados padrão (transactionsMock)', () => {
    expect(() => render(<TransactionsTable />)).not.toThrow()
  })

  it('renderiza sem erros com array vazio', () => {
    expect(() => render(<TransactionsTable transactions={[]} />)).not.toThrow()
  })

  it('com array vazio não renderiza nenhuma linha', () => {
    render(<TransactionsTable transactions={[]} />)

    expect(screen.queryAllByRole('row')).toHaveLength(1) // apenas o thead
  })
})
