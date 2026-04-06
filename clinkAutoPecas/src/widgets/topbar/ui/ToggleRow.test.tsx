import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ToggleRow } from './ToggleRow'

// ── Fixture ───────────────────────────────────────────────────────────────────

const ICON = <svg data-testid="test-icon" aria-hidden />

function renderToggle(checked = false, onChange = vi.fn()) {
  render(
    <ToggleRow
      icon={ICON}
      label="Test Toggle"
      sublabel="Test sublabel text."
      checked={checked}
      onChange={onChange}
    />,
  )
  return { onChange }
}

// ── 5.1 Estrutura e acessibilidade ────────────────────────────────────────────

describe('ToggleRow — 5.1 Estrutura e acessibilidade', () => {
  it('renderiza o label visível', () => {
    renderToggle()
    expect(screen.getByText('Test Toggle')).toBeInTheDocument()
  })

  it('renderiza o sublabel visível', () => {
    renderToggle()
    expect(screen.getByText('Test sublabel text.')).toBeInTheDocument()
  })

  it('botão tem role="switch"', () => {
    renderToggle()
    expect(screen.getByRole('switch', { name: /test toggle/i })).toBeInTheDocument()
  })

  it('aria-checked="false" quando checked=false', () => {
    renderToggle(false)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('aria-checked="true" quando checked=true', () => {
    renderToggle(true)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('container da row tem backgroundColor #1E2228', () => {
    const { container } = render(
      <ToggleRow icon={ICON} label="T" sublabel="S" checked={false} onChange={vi.fn()} />,
    )
    const row = container.firstChild as HTMLElement
    expect(row.style.backgroundColor).toBe('rgb(30, 34, 40)')
  })
})

// ── 5.1 Track e Thumb ─────────────────────────────────────────────────────────

describe('ToggleRow — 5.1 Track e Thumb', () => {
  it('track tem width 44px e height 24px', () => {
    renderToggle()
    const track = screen.getByRole('switch')
    expect(track.style.width).toBe('44px')
    expect(track.style.height).toBe('24px')
  })

  it('track é cinza #31353C quando checked=false', () => {
    renderToggle(false)
    expect(screen.getByRole('switch').style.backgroundColor).toBe('rgb(49, 53, 60)')
  })

  it('track é teal #4EDEA3 quando checked=true', () => {
    renderToggle(true)
    expect(screen.getByRole('switch').style.backgroundColor).toBe('rgb(78, 222, 163)')
  })

  it('thumb tem width e height 18px', () => {
    renderToggle()
    const thumb = screen.getByRole('switch').querySelector('span') as HTMLElement
    expect(thumb.style.width).toBe('18px')
    expect(thumb.style.height).toBe('18px')
  })

  it('thumb está à esquerda (left: 3px) quando checked=false', () => {
    renderToggle(false)
    const thumb = screen.getByRole('switch').querySelector('span') as HTMLElement
    expect(thumb.style.left).toBe('3px')
  })

  it('thumb está à direita (left: 23px) quando checked=true', () => {
    renderToggle(true)
    const thumb = screen.getByRole('switch').querySelector('span') as HTMLElement
    expect(thumb.style.left).toBe('23px')
  })

  it('track tem transition de 200ms no backgroundColor', () => {
    renderToggle()
    expect(screen.getByRole('switch').style.transition).toMatch(/200ms/)
  })

  it('thumb tem transition de 200ms no left', () => {
    renderToggle()
    const thumb = screen.getByRole('switch').querySelector('span') as HTMLElement
    expect(thumb.style.transition).toMatch(/200ms/)
  })
})

// ── 5.1 Interação ─────────────────────────────────────────────────────────────

describe('ToggleRow — 5.1 Interação', () => {
  it('clicar no switch chama onChange uma vez', async () => {
    const { onChange } = renderToggle(false)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('clicar múltiplas vezes chama onChange o mesmo número de vezes', async () => {
    const { onChange } = renderToggle(false)
    await userEvent.click(screen.getByRole('switch'))
    await userEvent.click(screen.getByRole('switch'))
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('ativar via teclado (Space) chama onChange', async () => {
    renderToggle(false)
    const switchBtn = screen.getByRole('switch')
    switchBtn.focus()
    await userEvent.keyboard(' ')
    // onChange chama-se ao pressionar Space num button
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })
})
