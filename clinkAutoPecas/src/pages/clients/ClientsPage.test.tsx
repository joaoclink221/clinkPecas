import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ClientsPage } from './ClientsPage'

// ── 1.1 Header ────────────────────────────────────────────────────────────────

describe('ClientsPage — 1.1 Header', () => {
  it('renderiza o título "Clientes e Fornecedores"', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('heading', { name: /clientes e fornecedores/i })).toBeInTheDocument()
  })

  it('renderiza o subtítulo "Directory Management"', () => {
    render(<ClientsPage />)

    expect(screen.getByText(/directory management/i)).toBeInTheDocument()
  })

  it('exibe contador dinâmico de registros no subtítulo', () => {
    render(<ClientsPage />)

    // O contador é dinâmico (filteredCount do hook); verifica apenas o padrão textual
    expect(screen.getByText(/\d+ Records? Active/)).toBeInTheDocument()
  })

  it('renderiza campo de busca com placeholder correto', () => {
    render(<ClientsPage />)

    expect(
      screen.getByRole('searchbox', { name: /buscar clientes ou fornecedores/i }),
    ).toBeInTheDocument()
  })

  it('renderiza botão "Export CSV"', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('button', { name: /exportar csv/i })).toBeInTheDocument()
  })

  it('renderiza botão "Add Entity" como ação primária', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('button', { name: /adicionar entidade/i })).toBeInTheDocument()
  })
})

// ── 1.2 Toggle Clientes / Fornecedores ───────────────────────────────────────

describe('ClientsPage — 1.2 Toggle Clientes / Fornecedores', () => {
  it('aba "Clientes" está ativa por padrão (aria-selected=true)', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('tab', { name: /^clientes$/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /^fornecedores$/i })).toHaveAttribute('aria-selected', 'false')
  })

  it('clicar em "Fornecedores" ativa essa aba', async () => {
    const user = userEvent.setup()
    render(<ClientsPage />)

    await user.click(screen.getByRole('tab', { name: /^fornecedores$/i }))

    expect(screen.getByRole('tab', { name: /^fornecedores$/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /^clientes$/i })).toHaveAttribute('aria-selected', 'false')
  })

  it('clicar em "Clientes" após "Fornecedores" volta à aba inicial', async () => {
    const user = userEvent.setup()
    render(<ClientsPage />)

    await user.click(screen.getByRole('tab', { name: /^fornecedores$/i }))
    await user.click(screen.getByRole('tab', { name: /^clientes$/i }))

    expect(screen.getByRole('tab', { name: /^clientes$/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('nav de abas tem aria-label descritivo', () => {
    render(<ClientsPage />)

    expect(
      screen.getByRole('tablist', { name: /alternar entre clientes e fornecedores/i }),
    ).toBeInTheDocument()
  })
})

// ── 1.3 Barra de filtros inline ───────────────────────────────────────────────

describe('ClientsPage — 1.3 Filtros inline', () => {
  it('renderiza os 3 selects de filtro acessíveis', () => {
    render(<ClientsPage />)

    // Os dropdowns são <select> nativos com aria-label
    expect(screen.getByRole('combobox', { name: /filtrar por tipo de entidade/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /filtrar por status/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /filtrar por saldo/i })).toBeInTheDocument()
  })

  it('dropdown TYPE tem valor padrão "All Entities"', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('combobox', { name: /filtrar por tipo de entidade/i })).toHaveValue('All Entities')
  })

  it('dropdown STATUS tem valor padrão "Active Only"', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('combobox', { name: /filtrar por status/i })).toHaveValue('Active Only')
  })

  it('dropdown BALANCE tem valor padrão "Any"', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('combobox', { name: /filtrar por saldo/i })).toHaveValue('Any')
  })

  it('grupo de filtros tem aria-label acessível', () => {
    render(<ClientsPage />)

    expect(screen.getByRole('group', { name: /filtros de entidade/i })).toBeInTheDocument()
  })
})

// ── 1.4 Cards KPI ─────────────────────────────────────────────────────────────

describe('ClientsPage — 1.4 Cards KPI', () => {
  it('seção KPI tem aria-label descritivo', () => {
    render(<ClientsPage />)

    expect(
      screen.getByRole('region', { name: /indicadores de clientes e fornecedores/i }),
    ).toBeInTheDocument()
  })

  it('renderiza card "Total Receivables" com valor "R$ 1.42M"', () => {
    render(<ClientsPage />)

    const card = screen.getByRole('article', { name: /total receivables/i })
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('R$ 1.42M')
  })

  it('renderiza card "Active Suppliers" com valor "142"', () => {
    render(<ClientsPage />)

    const card = screen.getByRole('article', { name: /active suppliers/i })
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('142')
  })

  it('renderiza card "Overdue Accounts" com valor "R$ 14,802"', () => {
    render(<ClientsPage />)

    const card = screen.getByRole('article', { name: /overdue accounts/i })
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('R$ 14,802')
  })

  it('renderiza card "New Registrations" com valor "24"', () => {
    render(<ClientsPage />)

    const card = screen.getByRole('article', { name: /new registrations/i })
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('24')
  })

  it('cada card exibe o sub-label', () => {
    render(<ClientsPage />)

    expect(screen.getByText(/\+12% from last month/i)).toBeInTheDocument()
    expect(screen.getByText(/managing 8,200 SKUs/i)).toBeInTheDocument()
    expect(screen.getByText(/8 critical follow-ups needed/i)).toBeInTheDocument()
    expect(screen.getByText(/last 7 days activity/i)).toBeInTheDocument()
  })
})

// ── 1.5 Botão flutuante ───────────────────────────────────────────────────────

describe('ClientsPage — 1.5 Botão flutuante "+"', () => {
  it('botão flutuante está presente na página', () => {
    render(<ClientsPage />)

    expect(
      screen.getByRole('button', { name: /adicionar nova entidade/i }),
    ).toBeInTheDocument()
  })

  it('botão tem classe rounded-full (circular)', () => {
    render(<ClientsPage />)

    const btn = screen.getByRole('button', { name: /adicionar nova entidade/i })
    expect(btn.className).toContain('rounded-full')
  })
})
