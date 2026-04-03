import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Topbar } from './Topbar'

describe('Topbar', () => {
  it('exibe busca global acessível por label', () => {
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    expect(screen.getByRole('searchbox', { name: /buscar no portal/i })).toBeInTheDocument()
  })

  it('exibe nome do funcionário, cargo Manager e selo Authorized', () => {
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText(/manager/i)).toBeInTheDocument()
    expect(screen.getByText(/authorized/i)).toBeInTheDocument()
  })

  it('expõe ações de notificação como botão acessível', async () => {
    const user = userEvent.setup()
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    const bell = screen.getByRole('button', { name: /notificações/i })
    expect(bell).toBeEnabled()
    await user.click(bell)
    expect(bell).toBeVisible()
  })
})
