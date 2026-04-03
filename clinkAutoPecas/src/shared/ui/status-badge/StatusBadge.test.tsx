import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it.each([
    ['pending', /pendente/i],
    ['completed', /concluído/i],
    ['cancelled', /cancelado/i],
  ] as const)('renderiza rótulo padrão para status %s', (status, matcher) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(matcher)).toBeInTheDocument()
  })

  it('permite sobrescrever o texto exibido', () => {
    render(<StatusBadge status="pending">Em análise</StatusBadge>)
    expect(screen.getByText(/em análise/i)).toBeInTheDocument()
  })
})
