import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('dispara onClick ao clicar quando habilitado', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    await user.click(screen.getByRole('button', { name: /salvar/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não dispara onClick quando disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Bloqueado
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: /bloqueado/i }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('aplica variante secundária sem quebrar o rótulo acessível', () => {
    render(
      <Button variant="secondary" type="submit">
        Enviar
      </Button>,
    )

    const btn = screen.getByRole('button', { name: /enviar/i })
    expect(btn).toHaveAttribute('type', 'submit')
  })
})
