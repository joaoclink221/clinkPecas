import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OpenTicketModal } from './OpenTicketModal'

// ── Fixtures ──────────────────────────────────────────────────────────────────

function renderModal(overrides?: { onClose?: () => void; onSuccess?: () => void }) {
  const onClose   = overrides?.onClose   ?? vi.fn()
  const onSuccess = overrides?.onSuccess ?? vi.fn()
  render(<OpenTicketModal onClose={onClose} onSuccess={onSuccess} />)
  return { onClose, onSuccess }
}

// ── 6.1 Renderização do modal ──────────────────────────────────────────────────

describe('OpenTicketModal — 6.1 Renderização', () => {
  it('renderiza sem erros', () => {
    expect(() => renderModal()).not.toThrow()
  })

  it('exibe dialog acessível com aria-modal', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('título "Abrir Chamado" identificável por aria-labelledby', () => {
    renderModal()
    expect(
      screen.getByRole('heading', { name: /abrir chamado/i }),
    ).toBeInTheDocument()
  })

  it('botão fechar (×) está presente', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /fechar modal/i })).toBeInTheDocument()
  })
})

// ── 6.1 Campos do formulário ───────────────────────────────────────────────────

describe('OpenTicketModal — 6.1 Campos', () => {
  it('campo "Tipo" é um select com opções Garantia e Devolução', () => {
    renderModal()
    const select = screen.getByLabelText(/^tipo$/i)
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Garantia' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Devolução' })).toBeInTheDocument()
  })

  it('campo "Item / SKU" é um input de texto', () => {
    renderModal()
    expect(screen.getByLabelText(/item \/ sku/i)).toBeInTheDocument()
  })

  it('campo "Motivo" é uma textarea', () => {
    renderModal()
    expect(screen.getByLabelText(/motivo/i).tagName).toBe('TEXTAREA')
  })

  it('campo "Prioridade" tem opções baixa, média e alta', () => {
    renderModal()
    const select = screen.getByLabelText(/prioridade/i)
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /baixa/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /média/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /alta/i })).toBeInTheDocument()
  })

  it('campos são preenchíveis pelo usuário', async () => {
    renderModal()

    const skuInput = screen.getByLabelText(/item \/ sku/i)
    await userEvent.type(skuInput, 'SKU-1234')
    expect(skuInput).toHaveValue('SKU-1234')

    const textarea = screen.getByLabelText(/motivo/i)
    await userEvent.type(textarea, 'Peça com defeito de fabricação')
    expect(textarea).toHaveValue('Peça com defeito de fabricação')
  })

  it('select Tipo pode ser alterado para Devolução', async () => {
    renderModal()
    const select = screen.getByLabelText(/^tipo$/i)
    await userEvent.selectOptions(select, 'Devolução')
    expect(select).toHaveValue('Devolução')
  })

  it('select Prioridade pode ser alterado para alta', async () => {
    renderModal()
    const select = screen.getByLabelText(/prioridade/i)
    await userEvent.selectOptions(select, 'alta')
    expect(select).toHaveValue('alta')
  })
})

// ── 6.1 Botões de ação ────────────────────────────────────────────────────────

describe('OpenTicketModal — 6.1 Botões de Ação', () => {
  it('botão "Cancelar" chama onClose', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('botão fechar (×) chama onClose', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /fechar modal/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('submit do formulário chama onSuccess', async () => {
    const { onSuccess } = renderModal()
    await userEvent.click(
      screen.getByRole('button', { name: /^abrir chamado$/i }),
    )
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('submit NÃO chama onClose diretamente — onSuccess é responsável', async () => {
    const { onClose, onSuccess } = renderModal()
    await userEvent.click(
      screen.getByRole('button', { name: /^abrir chamado$/i }),
    )
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('tecla Escape chama onClose', async () => {
    const { onClose } = renderModal()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
