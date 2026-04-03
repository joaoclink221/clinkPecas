import { render, screen, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LiveFeedBadge } from './LiveFeedBadge'

describe('LiveFeedBadge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe "LIVE FEED" e "just now" no estado inicial', () => {
    render(<LiveFeedBadge />)

    expect(screen.getByText('LIVE FEED')).toBeInTheDocument()
    expect(screen.getByText(/just now/i)).toBeInTheDocument()
  })

  it('tem role="status" para leitores de tela', () => {
    render(<LiveFeedBadge />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('atualiza para "1m ago" após 1 minuto', () => {
    render(<LiveFeedBadge />)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByRole('status')).toHaveAccessibleName(/1m ago/i)
  })

  it('atualiza para "2m ago" após 2 minutos', () => {
    render(<LiveFeedBadge />)

    act(() => {
      vi.advanceTimersByTime(120_000)
    })

    expect(screen.getByRole('status')).toHaveAccessibleName(/2m ago/i)
  })

  it('exibe "1h ago" após 60 minutos', () => {
    render(<LiveFeedBadge />)

    act(() => {
      vi.advanceTimersByTime(60 * 60_000)
    })

    expect(screen.getByRole('status')).toHaveAccessibleName(/1h ago/i)
  })

  it('cancela o setInterval ao desmontar (sem memory leak)', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    const { unmount } = render(<LiveFeedBadge />)
    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
