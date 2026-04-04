import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PurchasesPagination } from './PurchasesPagination'

// ── 5.2 Renderização condicional ──────────────────────────────────────────────

describe('PurchasesPagination — 5.2 Renderização condicional', () => {
  it('não renderiza quando totalPages <= 1', () => {
    render(<PurchasesPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('não renderiza quando totalPages = 0', () => {
    render(<PurchasesPagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renderiza nav acessível com aria-label correto quando totalPages > 1', () => {
    render(<PurchasesPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(
      screen.getByRole('navigation', { name: /paginação de ordens de compra/i }),
    ).toBeInTheDocument()
  })
})

// ── 5.2 Botão Prev ────────────────────────────────────────────────────────────

describe('PurchasesPagination — 5.2 Botão Prev', () => {
  it('botão "Página anterior" está desabilitado na página 1', () => {
    render(<PurchasesPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('botão "Página anterior" está habilitado quando currentPage > 1', () => {
    render(<PurchasesPagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /página anterior/i })).not.toBeDisabled()
  })

  it('clicar em "Página anterior" chama onPageChange com page - 1', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<PurchasesPagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})

// ── 5.2 Botão Next ────────────────────────────────────────────────────────────

describe('PurchasesPagination — 5.2 Botão Next', () => {
  it('botão "Próxima página" está desabilitado na última página', () => {
    render(<PurchasesPagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('botão "Próxima página" está habilitado quando não é a última página', () => {
    render(<PurchasesPagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /próxima página/i })).not.toBeDisabled()
  })

  it('clicar em "Próxima página" chama onPageChange com page + 1', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<PurchasesPagination currentPage={2} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /próxima página/i }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})

// ── 5.2 Página ativa ──────────────────────────────────────────────────────────

describe('PurchasesPagination — 5.2 Página ativa', () => {
  it('página 1 tem aria-current="page" por padrão', () => {
    render(<PurchasesPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^página 1$/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('página ativa tem aria-current="page"', () => {
    render(<PurchasesPagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^página 2$/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('páginas não-ativas não têm aria-current', () => {
    render(<PurchasesPagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />)

    const btn1 = screen.getByRole('button', { name: /^página 1$/i })
    expect(btn1).not.toHaveAttribute('aria-current')
  })
})

// ── 5.2 Numeração de páginas ──────────────────────────────────────────────────

describe('PurchasesPagination — 5.2 Numeração de páginas', () => {
  it('exibe 3 botões numerados para totalPages = 3', () => {
    render(<PurchasesPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^página 1$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^página 2$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^página 3$/i })).toBeInTheDocument()
  })

  it('mock de 15 registros com pageSize=5 → 3 páginas visíveis', () => {
    render(<PurchasesPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)

    const pageButtons = screen
      .getAllByRole('button')
      .filter((b) => /^página \d+$/i.test(b.getAttribute('aria-label') ?? ''))
    expect(pageButtons).toHaveLength(3)
  })

  it('clicar na página 2 chama onPageChange com 2', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<PurchasesPagination currentPage={1} totalPages={3} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /^página 2$/i }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('para totalPages > 7 exibe reticências ao navegar para página do meio', () => {
    render(<PurchasesPagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />)

    // '…' é renderizado como span aria-hidden — verifica pelo texto visível
    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1)
  })

  it('para totalPages <= 7 exibe todas as páginas sem reticências', () => {
    render(<PurchasesPagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.queryByText('…')).not.toBeInTheDocument()
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: new RegExp(`^página ${i}$`, 'i') })).toBeInTheDocument()
    }
  })
})
