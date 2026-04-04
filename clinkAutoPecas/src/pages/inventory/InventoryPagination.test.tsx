import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { InventoryPagination } from './InventoryPagination'

describe('InventoryPagination — renderização', () => {
  it('retorna null quando totalPages <= 1', () => {
    const { container } = render(
      <InventoryPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza nav com aria-label correto', () => {
    render(
      <InventoryPagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('navigation', { name: /paginação de estoque/i })).toBeInTheDocument()
  })

  it('renderiza apenas os botões prev e next (sem números)', () => {
    render(
      <InventoryPagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })
})

describe('InventoryPagination — 5.2 Botão prev', () => {
  it('prev está desabilitado na página 1', () => {
    render(
      <InventoryPagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('prev está habilitado em páginas > 1', () => {
    render(
      <InventoryPagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeEnabled()
  })

  it('clicar em prev chama onPageChange com page - 1', () => {
    const onPageChange = vi.fn()
    render(
      <InventoryPagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /página anterior/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('clicar em prev desabilitado não chama onPageChange', () => {
    const onPageChange = vi.fn()
    render(
      <InventoryPagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /página anterior/i }))
    expect(onPageChange).not.toHaveBeenCalled()
  })
})

describe('InventoryPagination — 5.2 Botão next', () => {
  it('next está desabilitado na última página', () => {
    render(
      <InventoryPagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('next está habilitado em páginas antes da última', () => {
    render(
      <InventoryPagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeEnabled()
  })

  it('clicar em next chama onPageChange com page + 1', () => {
    const onPageChange = vi.fn()
    render(
      <InventoryPagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /próxima página/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('clicar em next desabilitado não chama onPageChange', () => {
    const onPageChange = vi.fn()
    render(
      <InventoryPagination currentPage={5} totalPages={5} onPageChange={onPageChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /próxima página/i }))
    expect(onPageChange).not.toHaveBeenCalled()
  })
})
