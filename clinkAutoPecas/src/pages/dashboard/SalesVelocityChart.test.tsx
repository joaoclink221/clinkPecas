import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { SalesVelocityChart } from './SalesVelocityChart'

describe('SalesVelocityChart', () => {
  it('renderiza o título e subtítulo do widget', () => {
    render(<SalesVelocityChart />)

    expect(screen.getByText(/sales velocity/i)).toBeInTheDocument()
    expect(screen.getByText(/last 30 days/i)).toBeInTheDocument()
  })

  it('exibe os botões de toggle Volume e Value', () => {
    render(<SalesVelocityChart />)

    expect(screen.getByRole('button', { name: /^volume$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^value$/i })).toBeInTheDocument()
  })

  it('inicia com o modo Volume ativo (aria-pressed=true)', () => {
    render(<SalesVelocityChart />)

    expect(screen.getByRole('button', { name: /^volume$/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^value$/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('troca para Value ao clicar no botão correspondente (3.3)', async () => {
    const user = userEvent.setup()
    render(<SalesVelocityChart />)

    await user.click(screen.getByRole('button', { name: /^value$/i }))

    expect(screen.getByRole('button', { name: /^value$/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^volume$/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('volta para Volume ao clicar novamente', async () => {
    const user = userEvent.setup()
    render(<SalesVelocityChart />)

    await user.click(screen.getByRole('button', { name: /^value$/i }))
    await user.click(screen.getByRole('button', { name: /^volume$/i }))

    expect(screen.getByRole('button', { name: /^volume$/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('o grupo de toggle tem rótulo acessível', () => {
    render(<SalesVelocityChart />)

    expect(screen.getByRole('group', { name: /modo de exibição/i })).toBeInTheDocument()
  })
})
