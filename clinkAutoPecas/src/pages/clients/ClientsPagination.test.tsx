import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ClientsPagination } from './ClientsPagination'
import { buildPageItems } from './clientsPaginationUtils'

// ── buildPageItems — algoritmo de elipses ─────────────────────────────────────

describe('buildPageItems — algoritmo de elipses', () => {
  it('totalPages=1 retorna [1]', () => {
    expect(buildPageItems(1, 1)).toEqual([1])
  })

  it('totalPages<=1 retorna [1]', () => {
    expect(buildPageItems(1, 0)).toEqual([1])
  })

  it('página 1 de 125: exibe [1, 2, null, 125]', () => {
    expect(buildPageItems(1, 125)).toEqual([1, 2, null, 125])
  })

  it('página 2 de 125: exibe [1, 2, 3, null, 125]', () => {
    expect(buildPageItems(2, 125)).toEqual([1, 2, 3, null, 125])
  })

  it('página 5 de 125: exibe [1, null, 4, 5, 6, null, 125]', () => {
    expect(buildPageItems(5, 125)).toEqual([1, null, 4, 5, 6, null, 125])
  })

  it('página 63 de 125 (meio): exibe [1, null, 62, 63, 64, null, 125]', () => {
    expect(buildPageItems(63, 125)).toEqual([1, null, 62, 63, 64, null, 125])
  })

  it('página 124 de 125: exibe [1, null, 123, 124, 125]', () => {
    expect(buildPageItems(124, 125)).toEqual([1, null, 123, 124, 125])
  })

  it('página 125 de 125: exibe [1, null, 124, 125]', () => {
    expect(buildPageItems(125, 125)).toEqual([1, null, 124, 125])
  })

  it('não insere elipse quando gap é de 1 página (vizinhas são contíguas)', () => {
    // página 3 de 5: [1, 2, 3, 4, 5] — sem elipses
    const result = buildPageItems(3, 5)
    expect(result.includes(null)).toBe(false)
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('nunca retorna páginas fora do intervalo [1, totalPages]', () => {
    const result = buildPageItems(1, 125)
    const pages = result.filter((x) => x !== null) as number[]
    for (const p of pages) {
      expect(p).toBeGreaterThanOrEqual(1)
      expect(p).toBeLessThanOrEqual(125)
    }
  })
})

// ── ClientsPagination — renderização ─────────────────────────────────────────

describe('ClientsPagination — renderização', () => {
  it('retorna null quando totalPages <= 1', () => {
    const { container } = render(
      <ClientsPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    )

    expect(container.firstChild).toBeNull()
  })

  it('renderiza nav com aria-label acessível', () => {
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('navigation', { name: /paginação de entidades/i })).toBeInTheDocument()
  })

  it('página 1 ativa por padrão — aria-current="page"', () => {
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
  })

  it('"…" e página 125 visíveis quando currentPage=1', () => {
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={vi.fn()} />)

    // Elipse renderizada como span aria-hidden
    expect(screen.getByRole('navigation').textContent).toContain('…')
    // Botão para última página visível
    expect(screen.getByRole('button', { name: /página 125/i })).toBeInTheDocument()
  })

  it('botão "Página anterior" desabilitado na página 1', () => {
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
  })

  it('botão "Próxima página" desabilitado na última página', () => {
    render(<ClientsPagination currentPage={125} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('botão "Próxima página" habilitado na página 1', () => {
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /próxima página/i })).toBeEnabled()
  })

  it('botão "Página anterior" habilitado quando não é a primeira', () => {
    render(<ClientsPagination currentPage={5} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeEnabled()
  })

  it('página 125 exibe aria-current="page" na última página', () => {
    render(<ClientsPagination currentPage={125} totalPages={125} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /página 125/i })).toHaveAttribute('aria-current', 'page')
  })

  it('renderiza elipse à esquerda e à direita na página do meio', () => {
    // página 63 de 125: [1, …, 62, 63, 64, …, 125]
    render(<ClientsPagination currentPage={63} totalPages={125} onPageChange={vi.fn()} />)

    const nav = screen.getByRole('navigation')
    // Duas elipses no conteúdo textual
    const ellipseCount = (nav.textContent?.match(/…/g) ?? []).length
    expect(ellipseCount).toBe(2)
  })
})

// ── ClientsPagination — interações ────────────────────────────────────────────

describe('ClientsPagination — interações', () => {
  it('clicar em página 2 chama onPageChange(2)', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /página 2/i }))

    expect(onPageChange).toHaveBeenCalledOnce()
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('clicar em "Próxima página" chama onPageChange(currentPage + 1)', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={3} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /próxima página/i }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('clicar em "Página anterior" chama onPageChange(currentPage - 1)', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={5} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('navegar até a página 125 via botão de página funciona', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={124} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /página 125/i }))

    expect(onPageChange).toHaveBeenCalledWith(125)
  })

  it('clicar na página já ativa ainda chama onPageChange (sem guard)', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Página 1' }))

    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('botão "Próxima página" não chama onPageChange quando desabilitado', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={125} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /próxima página/i }))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('botão "Página anterior" não chama onPageChange quando desabilitado', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<ClientsPagination currentPage={1} totalPages={125} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: /página anterior/i }))

    expect(onPageChange).not.toHaveBeenCalled()
  })
})
