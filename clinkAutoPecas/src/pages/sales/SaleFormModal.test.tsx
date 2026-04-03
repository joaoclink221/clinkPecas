import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SaleFormModal } from './SaleFormModal'

function renderModal(props?: Partial<Parameters<typeof SaleFormModal>[0]>) {
  const onClose = vi.fn()
  const onCreated = vi.fn()
  render(
    <SaleFormModal
      open={props?.open ?? true}
      onClose={props?.onClose ?? onClose}
      onCreated={props?.onCreated ?? onCreated}
    />,
  )
  return { onClose, onCreated }
}

describe('SaleFormModal — renderização', () => {
  it('renderiza o modal quando open=true', () => {
    renderModal()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /nova venda/i })).toBeInTheDocument()
  })

  it('não renderiza nada quando open=false', () => {
    renderModal({ open: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza todos os campos essenciais', () => {
    renderModal()

    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cpf \/ cnpj/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/método de pagamento/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/desconto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/observações/i)).toBeInTheDocument()
  })

  it('renderiza botões Cancelar e Criar Venda', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criar venda/i })).toBeInTheDocument()
  })

  it('campo parcelas aparece apenas quando Cartão é selecionado', async () => {
    renderModal()

    expect(screen.queryByLabelText(/parcelas/i)).not.toBeInTheDocument()

    await userEvent.selectOptions(screen.getByLabelText(/método de pagamento/i), 'Cartão')

    expect(screen.getByLabelText(/parcelas/i)).toBeInTheDocument()
  })
})

describe('SaleFormModal — fechar modal', () => {
  it('botão Fechar chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /fechar modal/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('botão Cancelar chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clique no overlay chama onClose', async () => {
    const { onClose } = renderModal()

    const overlay = screen.getByRole('presentation')
    await userEvent.click(overlay)

    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('SaleFormModal — validação', () => {
  it('exibe erro quando nome do cliente está vazio', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /criar venda/i }))

    // Both customerName and items errors appear; check for the specific message
    expect(screen.getByText(/3 caracteres/i)).toBeInTheDocument()
  })

  it('exibe erro de item quando nenhum item válido foi adicionado', async () => {
    renderModal()

    // Fill customer name but leave items empty
    await userEvent.type(screen.getByLabelText(/cliente/i), 'Cliente Teste')
    await userEvent.click(screen.getByRole('button', { name: /criar venda/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/ao menos um item/i)
  })

  it('não chama onCreated quando há erros de validação', async () => {
    const { onCreated } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /criar venda/i }))

    expect(onCreated).not.toHaveBeenCalled()
  })
})

describe('SaleFormModal — submissão válida', () => {
  async function fillAndSubmit(onCreated = vi.fn()) {
    const onClose = vi.fn()
    render(<SaleFormModal open onClose={onClose} onCreated={onCreated} />)

    await userEvent.type(screen.getByLabelText(/cliente/i), 'Apex Autopeças')

    // Fill first item
    const skuInput = screen.getByRole('textbox', { name: /sku do item 1/i })
    const qtyInput = screen.getByRole('spinbutton', { name: /qtd do item 1/i })
    const priceInput = screen.getByRole('spinbutton', { name: /preço do item 1/i })

    await userEvent.type(skuInput, 'FILTRO-OIL-001')
    fireEvent.change(qtyInput, { target: { value: '2' } })
    fireEvent.change(priceInput, { target: { value: '150' } })

    await userEvent.click(screen.getByRole('button', { name: /criar venda/i }))

    return { onCreated, onClose }
  }

  it('chama onCreated com um objeto Sale válido', async () => {
    const onCreated = vi.fn()
    await fillAndSubmit(onCreated)

    expect(onCreated).toHaveBeenCalledOnce()
    const sale = onCreated.mock.calls[0][0]
    expect(sale.customerName).toBe('Apex Autopeças')
    expect(sale.status).toBe('pending')
    expect(sale.totalValue).toBeGreaterThan(0)
    expect(sale.id).toMatch(/^VD-\d+$/)
  })

  it('novo sale tem data de hoje', async () => {
    const onCreated = vi.fn()
    await fillAndSubmit(onCreated)

    const today = new Date().toISOString().split('T')[0]
    expect(onCreated.mock.calls[0][0].date).toBe(today)
  })

  it('totalValue = subtotal - desconto', async () => {
    const onClose = vi.fn()
    const onCreated = vi.fn()
    render(<SaleFormModal open onClose={onClose} onCreated={onCreated} />)

    await userEvent.type(screen.getByLabelText(/cliente/i), 'Cliente X')

    const skuInput = screen.getByRole('textbox', { name: /sku do item 1/i })
    const qtyInput = screen.getByRole('spinbutton', { name: /qtd do item 1/i })
    const priceInput = screen.getByRole('spinbutton', { name: /preço do item 1/i })

    await userEvent.type(skuInput, 'SKU-001')
    fireEvent.change(qtyInput, { target: { value: '1' } })
    fireEvent.change(priceInput, { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/desconto/i), { target: { value: '50' } })

    await userEvent.click(screen.getByRole('button', { name: /criar venda/i }))

    const sale = onCreated.mock.calls[0][0]
    expect(sale.totalValue).toBe(450)
    expect(sale.discount).toBe(50)
  })

  it('adiciona item extra com botão "+ Adicionar item"', async () => {
    renderModal()

    expect(screen.queryByRole('textbox', { name: /sku do item 2/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /adicionar item/i }))

    expect(screen.getByRole('textbox', { name: /sku do item 2/i })).toBeInTheDocument()
  })

  it('remove item com botão de lixeira quando há mais de um item', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar item/i }))
    expect(screen.getByRole('textbox', { name: /sku do item 2/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /remover item 1/i }))

    expect(screen.queryByRole('textbox', { name: /sku do item 2/i })).not.toBeInTheDocument()
  })
})

describe('SaleFormModal — acessibilidade', () => {
  it('dialog tem aria-modal=true', () => {
    renderModal()

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('dialog tem aria-labelledby apontando para o título', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')!
    const title = document.getElementById(labelId)
    expect(title).toHaveTextContent(/nova venda/i)
  })

  it('campo cliente tem aria-required=true', () => {
    renderModal()

    expect(screen.getByLabelText(/cliente/i)).toHaveAttribute('aria-required', 'true')
  })

  it('campo cliente tem aria-invalid=true após tentativa inválida', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /criar venda/i }))

    expect(screen.getByLabelText(/cliente/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('área do formulário é acessível por screen readers', () => {
    renderModal()

    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByRole('group', { name: /itens/i })).toBeInTheDocument()
  })
})
