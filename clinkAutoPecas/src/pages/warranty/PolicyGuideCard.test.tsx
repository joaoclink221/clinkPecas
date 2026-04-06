import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { PolicyGuideCard } from './PolicyGuideCard'

// ── 5.2 Card "Guia de Políticas" ──────────────────────────────────────────────

describe('PolicyGuideCard — 5.2', () => {
  it('renderiza sem erros', () => {
    expect(() => render(<PolicyGuideCard />)).not.toThrow()
  })

  it('exibe o título "Guia de Políticas"', () => {
    render(<PolicyGuideCard />)

    expect(
      screen.getByRole('heading', { name: /guia de políticas/i }),
    ).toBeInTheDocument()
  })

  it('exibe o subtítulo com a versão V2.4', () => {
    render(<PolicyGuideCard />)

    expect(screen.getByText(/V2\.4/)).toBeInTheDocument()
  })

  it('exibe o texto completo do subtítulo', () => {
    render(<PolicyGuideCard />)

    expect(
      screen.getByText(/consulte as diretrizes de garantia obsidian gear atualizadas/i),
    ).toBeInTheDocument()
  })

  it('botão "DOWNLOAD PDF" está presente', () => {
    render(<PolicyGuideCard />)

    expect(
      screen.getByRole('button', { name: /baixar pdf do guia de políticas de garantia/i }),
    ).toBeInTheDocument()
  })

  it('botão tem aria-label acessível completo', () => {
    render(<PolicyGuideCard />)

    expect(
      screen.getByRole('button', { name: /baixar pdf do guia de políticas de garantia/i }),
    ).toBeInTheDocument()
  })

  it('ícone de documento SVG está presente no DOM', () => {
    const { container } = render(<PolicyGuideCard />)

    // O ícone é um SVG 40×40 com viewBox "0 0 40 40"
    const svg = container.querySelector('svg[viewBox="0 0 40 40"]')
    expect(svg).toBeInTheDocument()
  })

  describe('comportamento do botão DOWNLOAD PDF', () => {
    let openSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    })

    afterEach(() => {
      openSpy.mockRestore()
    })

    it('clicar no botão chama window.open sem lançar erro', async () => {
      render(<PolicyGuideCard />)

      const button = screen.getByRole('button', { name: /baixar pdf do guia de políticas de garantia/i })

      await expect(userEvent.click(button)).resolves.not.toThrow()
    })

    it('clicar no botão chama window.open com "about:blank"', async () => {
      render(<PolicyGuideCard />)

      const button = screen.getByRole('button', { name: /baixar pdf do guia de políticas de garantia/i })
      await userEvent.click(button)

      expect(openSpy).toHaveBeenCalledWith(
        'about:blank',
        '_blank',
        'noopener,noreferrer',
      )
    })

    it('clicar múltiplas vezes não causa erros', async () => {
      render(<PolicyGuideCard />)

      const button = screen.getByRole('button', { name: /baixar pdf do guia de políticas de garantia/i })

      await userEvent.click(button)
      await userEvent.click(button)

      expect(openSpy).toHaveBeenCalledTimes(2)
    })
  })
})
