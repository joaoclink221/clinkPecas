import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SalesPagination } from './SalesPagination'

function renderPagination(
  currentPage: number,
  totalPages: number,
  onPageChange = vi.fn(),
) {
  return render(
    <SalesPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />,
  )
}

describe('SalesPagination — renderização', () => {
  it('não renderiza nada quando totalPages é 1', () => {
    const { container } = renderPagination(1, 1)

    expect(container).toBeEmptyDOMElement()
  })

  it('não renderiza nada quando totalPages é 0', () => {
    const { container } = renderPagination(1, 0)

    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza nav acessível com aria-label', () => {
    renderPagination(1, 5)

    expect(screen.getByRole('navigation', { name: /paginação de vendas/i })).toBeInTheDocument()
  })

  it('renderiza botão "Página anterior"', () => {
    renderPagination(2, 5)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeInTheDocument()
  })

  it('renderiza botão "Próxima página"', () => {
    renderPagination(1, 5)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeInTheDocument()
  })

  it('página ativa tem aria-current="page"', () => {
    renderPagination(3, 5)

    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('páginas não-ativas não têm aria-current', () => {
    renderPagination(3, 5)

    expect(screen.getByRole('button', { name: 'Página 1' })).not.toHaveAttribute('aria-current')
  })
})

describe('SalesPagination — ellipsis e janela de páginas', () => {
  it('exibe todas as páginas sem ellipsis quando totalPages <= 7', () => {
    renderPagination(1, 7)

    for (let i = 1; i <= 7; i++) {
      expect(screen.getByRole('button', { name: `Página ${i}` })).toBeInTheDocument()
    }
    expect(screen.queryAllByText('…')).toHaveLength(0)
  })

  it('exibe ellipsis no início de 42 páginas ao estar na página 1', () => {
    renderPagination(1, 42)

    // Deve mostrar 1, 2, …, 42
    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 42' })).toBeInTheDocument()
    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1)
  })

  it('exibe ellipsis em ambos os lados ao estar na página 21 de 42', () => {
    renderPagination(21, 42)

    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 20' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 21' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 22' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 42' })).toBeInTheDocument()
    expect(screen.getAllByText('…')).toHaveLength(2)
  })

  it('exibe ellipsis apenas à esquerda ao estar na página 42 de 42', () => {
    renderPagination(42, 42)

    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 41' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 42' })).toBeInTheDocument()
    expect(screen.getAllByText('…')).toHaveLength(1)
  })
})

describe('SalesPagination — interações', () => {
  it('botão anterior é desabilitado na página 1', () => {
    renderPagination(1, 5)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('botão próximo é desabilitado na última página', () => {
    renderPagination(5, 5)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('botão anterior não é desabilitado quando não está na página 1', () => {
    renderPagination(3, 5)

    expect(screen.getByRole('button', { name: /página anterior/i })).not.toBeDisabled()
  })

  it('clique em "Próxima página" chama onPageChange com currentPage+1', async () => {
    const onPageChange = vi.fn()
    renderPagination(3, 5, onPageChange)

    await userEvent.click(screen.getByRole('button', { name: /próxima página/i }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('clique em "Página anterior" chama onPageChange com currentPage-1', async () => {
    const onPageChange = vi.fn()
    renderPagination(3, 5, onPageChange)

    await userEvent.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('clique em número de página chama onPageChange com o número correto', async () => {
    const onPageChange = vi.fn()
    renderPagination(1, 5, onPageChange)

    await userEvent.click(screen.getByRole('button', { name: 'Página 4' }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('navegar até página 42 e voltar funciona sem erro', async () => {
    const onPageChange = vi.fn()
    // Renderiza na página 42 de 42 — prev deve funcionar
    renderPagination(42, 42, onPageChange)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /página anterior/i })).not.toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onPageChange).toHaveBeenCalledWith(41)
  })

  it('página ativa tem classe de destaque teal (bg-primary)', () => {
    renderPagination(3, 5)

    const activePage = screen.getByRole('button', { name: 'Página 3' })
    expect(activePage.className).toContain('bg-primary')
    expect(activePage.className).toContain('text-on-primary')
  })
})
