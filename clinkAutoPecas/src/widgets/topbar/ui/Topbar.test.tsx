import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

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

  // ── 1.2 Gatilho de abertura do modal de perfil ──────────────────────────────

  it('botão de perfil está presente com aria-label acessível', () => {
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    expect(
      screen.getByRole('button', { name: /abrir perfil do funcionário/i }),
    ).toBeInTheDocument()
  })

  it('botão de perfil tem aria-haspopup="dialog"', () => {
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    expect(
      screen.getByRole('button', { name: /abrir perfil do funcionário/i }),
    ).toHaveAttribute('aria-haspopup', 'dialog')
  })

  it('clicar no botão de perfil chama onAvatarClick', async () => {
    const onAvatarClick = vi.fn()
    render(
      <Topbar
        userName="Alex Rivera"
        roleTitle="Manager"
        clearanceLabel="Authorized"
        onAvatarClick={onAvatarClick}
      />,
    )

    await userEvent.click(
      screen.getByRole('button', { name: /abrir perfil do funcionário/i }),
    )

    expect(onAvatarClick).toHaveBeenCalledTimes(1)
  })

  it('sem onAvatarClick, clicar no botão de perfil não lança erro', async () => {
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    await expect(
      userEvent.click(screen.getByRole('button', { name: /abrir perfil do funcionário/i })),
    ).resolves.not.toThrow()
  })

  it('exibe iniciais "AR" para "Alex Rivera"', () => {
    render(
      <Topbar userName="Alex Rivera" roleTitle="Manager" clearanceLabel="Authorized" />,
    )

    expect(screen.getByRole('button', { name: /abrir perfil do funcionário/i }).textContent).toContain('AR')
  })
})
