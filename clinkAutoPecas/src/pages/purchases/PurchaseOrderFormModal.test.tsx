import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PurchaseOrderFormModal } from './PurchaseOrderFormModal'

// ── Helper ─────────────────────────────────────────────────────────────────────

function renderModal(props?: Partial<Parameters<typeof PurchaseOrderFormModal>[0]>) {
  const onClose = vi.fn()
  const onCreated = vi.fn()
  render(
    <PurchaseOrderFormModal
      open={props?.open ?? true}
      onClose={props?.onClose ?? onClose}
      onCreated={props?.onCreated ?? onCreated}
    />,
  )
  return { onClose, onCreated }
}

// ── 1.1 — Modal, Overlay e Header ─────────────────────────────────────────────

describe('PurchaseOrderFormModal 1.1 — Modal, Overlay e Header', () => {
  it('não renderiza nada quando open=false', () => {
    renderModal({ open: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renderiza o dialog quando open=true', () => {
    renderModal()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('dialog tem aria-modal="true"', () => {
    renderModal()

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('dialog tem aria-labelledby apontando para o h2 "New Purchase Order"', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)).toHaveTextContent(/new purchase order/i)
  })

  it('exibe h2 "New Purchase Order" no header', () => {
    renderModal()

    expect(screen.getByRole('heading', { name: /new purchase order/i })).toBeInTheDocument()
  })

  it('exibe subtítulo com texto sobre procurement e logistical scheduling', () => {
    renderModal()

    expect(
      screen.getByText(/initiate part procurement and logistical scheduling/i),
    ).toBeInTheDocument()
  })

  it('subtítulo tem estilo itálico', () => {
    renderModal()

    const subtitle = screen.getByText(/initiate part procurement/i)
    expect(subtitle.tagName).toBe('P')
    expect(subtitle.className).toContain('italic')
  })

  it('subtítulo é colorido com teal (text-primary) — não cinza muted', () => {
    renderModal()

    const subtitle = screen.getByText(/initiate part procurement/i)
    expect(subtitle.className).toContain('text-primary')
    expect(subtitle.className).not.toContain('text-on-surface-variant')
  })

  it('lado esquerdo do header contém apenas texto — sem ícone decorativo', () => {
    renderModal()

    // O div esquerdo contém apenas h2 + subtítulo, sem SVG decorativo
    const heading = screen.getByRole('heading', { name: /new purchase order/i })
    const titleGroup = heading.parentElement!
    expect(titleGroup.querySelector('svg')).toBeNull()
  })

  it('botão X está presente com aria-label "Close modal"', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument()
  })

  it('botão X chama onClose ao ser clicado', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /close modal/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('pressionar Escape chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clicar no overlay (fora do dialog) chama onClose', () => {
    const { onClose } = renderModal()

    // O overlay é o elemento role="presentation" que envolve o dialog
    const overlay = screen.getByRole('presentation')
    fireEvent.click(overlay)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clicar dentro do dialog NÃO chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('dialog tem largura máxima de 1040px via classe max-w-[1040px]', () => {
    renderModal()

    expect(screen.getByRole('dialog').className).toContain('max-w-[1040px]')
  })

  it('ao fechar (open=false) e reabrir (open=true) o modal é renderizado novamente', () => {
    const { rerender } = render(
      <PurchaseOrderFormModal open={true} onClose={vi.fn()} onCreated={vi.fn()} />,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    rerender(<PurchaseOrderFormModal open={false} onClose={vi.fn()} onCreated={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<PurchaseOrderFormModal open={true} onClose={vi.fn()} onCreated={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

// ── 1.2 — Rodapé de Ações ─────────────────────────────────────────────────────

describe('PurchaseOrderFormModal 1.2 — Rodapé de Ações', () => {
  it('renderiza os 3 botões do rodapé', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /cancel order/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate order/i })).toBeInTheDocument()
  })

  it('"GENERATE ORDER" está desabilitado ao abrir (formulário vazio)', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /generate order/i })).toBeDisabled()
  })

  it('"GENERATE ORDER" tem aria-disabled=true quando desabilitado', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /generate order/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('"CANCEL ORDER" tem estilo ghost (borda visível, sem fundo sólido)', () => {
    renderModal()

    const btn = screen.getByRole('button', { name: /cancel order/i })
    expect(btn.className).toContain('border')
    expect(btn.className).not.toContain('bg-primary')
    expect(btn.className).not.toContain('bg-surface-container-highest')
  })

  it('"SAVE DRAFT" tem estilo secundário escuro', () => {
    renderModal()

    const btn = screen.getByRole('button', { name: /save draft/i })
    expect(btn.className).toContain('bg-surface-container-highest')
  })

  it('"GENERATE ORDER" tem estilo primário verde (bg-primary)', () => {
    renderModal()

    const btn = screen.getByRole('button', { name: /generate order/i })
    expect(btn.className).toContain('bg-primary')
  })

  it('"CANCEL ORDER" chama onClose ao ser clicado', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /cancel order/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('"GENERATE ORDER" NÃO chama onCreated quando desabilitado', async () => {
    const { onCreated } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /generate order/i }))

    expect(onCreated).not.toHaveBeenCalled()
  })

  it('todos os botões têm type="button" (sem submit implícito)', () => {
    renderModal()

    const buttons = screen.getAllByRole('button')
    const actionButtons = buttons.filter((b) =>
      /cancel order|save draft|generate order/i.test(b.textContent ?? ''),
    )
    actionButtons.forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button')
    })
  })
})

// ── 2.1 — Interfaces e Mocks ──────────────────────────────────────────────────

import {
  INITIAL_ORDER_ITEMS,
  INITIAL_PURCHASE_ORDER_FORM,
  PURCHASE_ORDER_DRAFT_KEY,
  componentCatalogMock,
  computeSubtotal,
  computeTotal,
  employeesMock,
  suppliersMock,
} from './purchaseOrderFormMocks'

describe('PurchaseOrderFormModal 2.1 — Interfaces e Mocks', () => {
  it('suppliersMock tem exatamente 5 fornecedores', () => {
    expect(suppliersMock).toHaveLength(5)
  })

  it('suppliersMock contém apenas strings não vazias', () => {
    suppliersMock.forEach((s) => {
      expect(typeof s).toBe('string')
      expect(s.length).toBeGreaterThan(0)
    })
  })

  it('employeesMock tem exatamente 5 funcionários', () => {
    expect(employeesMock).toHaveLength(5)
  })

  it('employeesMock contém apenas strings não vazias', () => {
    employeesMock.forEach((e) => {
      expect(typeof e).toBe('string')
      expect(e.length).toBeGreaterThan(0)
    })
  })

  it('componentCatalogMock tem 6 ou mais itens', () => {
    expect(componentCatalogMock.length).toBeGreaterThanOrEqual(6)
  })

  it('componentCatalogMock inclui BRM-0092-CF (Ceramic Brake Pad Set) a $124', () => {
    const item = componentCatalogMock.find((c) => c.sku === 'BRM-0092-CF')
    expect(item).toBeDefined()
    expect(item!.unitCost).toBe(124)
  })

  it('componentCatalogMock inclui BRM-rotor-v3 (Ventilated Disc Rotor) a $312', () => {
    const item = componentCatalogMock.find((c) => c.sku === 'BRM-rotor-v3')
    expect(item).toBeDefined()
    expect(item!.unitCost).toBe(312)
  })

  it('INITIAL_ORDER_ITEMS tem 2 itens', () => {
    expect(INITIAL_ORDER_ITEMS).toHaveLength(2)
  })

  it('computeSubtotal dos itens iniciais retorna 11820', () => {
    // 45 × $124 + 20 × $312 = $5.580 + $6.240 = $11.820
    expect(computeSubtotal(INITIAL_ORDER_ITEMS)).toBe(11820)
  })

  it('computeTotal com estLogistics=450 retorna 12270', () => {
    expect(computeTotal(INITIAL_ORDER_ITEMS, 450)).toBe(12270)
  })

  it('INITIAL_PURCHASE_ORDER_FORM tem estLogistics=450', () => {
    expect(INITIAL_PURCHASE_ORDER_FORM.estLogistics).toBe(450)
  })

  it('INITIAL_PURCHASE_ORDER_FORM tem supplier e agent nulos', () => {
    expect(INITIAL_PURCHASE_ORDER_FORM.supplier).toBeNull()
    expect(INITIAL_PURCHASE_ORDER_FORM.agent).toBeNull()
  })

  it('INITIAL_PURCHASE_ORDER_FORM tem issueDate pré-preenchida com 2023-10-27', () => {
    expect(INITIAL_PURCHASE_ORDER_FORM.issueDate).toBe('2023-10-27')
  })

  it('INITIAL_PURCHASE_ORDER_FORM tem expectedDelivery vazia', () => {
    expect(INITIAL_PURCHASE_ORDER_FORM.expectedDelivery).toBe('')
  })

  it('computeSubtotal de array vazio retorna 0', () => {
    expect(computeSubtotal([])).toBe(0)
  })

  it('computeTotal de array vazio com logistics=450 retorna 450', () => {
    expect(computeTotal([], 450)).toBe(450)
  })

  it('PURCHASE_ORDER_DRAFT_KEY é "purchase_order_draft"', () => {
    expect(PURCHASE_ORDER_DRAFT_KEY).toBe('purchase_order_draft')
  })
})

// ── 2.2 — Restaurar Rascunho ──────────────────────────────────────────────────

describe('PurchaseOrderFormModal 2.2 — Restaurar Rascunho', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('sem rascunho no localStorage não exibe banner "Draft restored"', () => {
    renderModal()

    expect(screen.queryByText(/draft restored/i)).not.toBeInTheDocument()
  })

  it('com rascunho válido no localStorage exibe banner "Draft restored"', () => {
    localStorage.setItem(
      PURCHASE_ORDER_DRAFT_KEY,
      JSON.stringify({ ...INITIAL_PURCHASE_ORDER_FORM, supplier: 'Bosch Global Parts' }),
    )
    renderModal()

    expect(screen.getByText(/draft restored/i)).toBeInTheDocument()
  })

  it('banner tem role="status" e aria-live="polite"', () => {
    localStorage.setItem(
      PURCHASE_ORDER_DRAFT_KEY,
      JSON.stringify({ ...INITIAL_PURCHASE_ORDER_FORM, supplier: 'NGK Spark Plugs' }),
    )
    renderModal()

    const banner = screen.getByRole('status')
    expect(banner).toHaveAttribute('aria-live', 'polite')
  })

  it('JSON inválido no localStorage não causa erro e não exibe banner', () => {
    localStorage.setItem(PURCHASE_ORDER_DRAFT_KEY, '{invalid-json}')
    // Não deve lançar erro ao renderizar
    expect(() => renderModal()).not.toThrow()
    expect(screen.queryByText(/draft restored/i)).not.toBeInTheDocument()
  })

  it('fechar modal e reabrir sem rascunho não exibe banner', () => {
    const { rerender } = render(
      <PurchaseOrderFormModal open={true} onClose={vi.fn()} onCreated={vi.fn()} />,
    )
    // Sem rascunho, banner não aparece
    expect(screen.queryByText(/draft restored/i)).not.toBeInTheDocument()

    rerender(<PurchaseOrderFormModal open={false} onClose={vi.fn()} onCreated={vi.fn()} />)
    rerender(<PurchaseOrderFormModal open={true} onClose={vi.fn()} onCreated={vi.fn()} />)

    expect(screen.queryByText(/draft restored/i)).not.toBeInTheDocument()
  })

  it('salvar rascunho e reabrir exibe banner', () => {
    const draft = {
      ...INITIAL_PURCHASE_ORDER_FORM,
      supplier: 'Continental Tyres Br',
      agent: 'Fernanda Rocha',
      issueDate: '2023-10-27',
    }
    localStorage.setItem(PURCHASE_ORDER_DRAFT_KEY, JSON.stringify(draft))

    const { rerender } = render(
      <PurchaseOrderFormModal open={false} onClose={vi.fn()} onCreated={vi.fn()} />,
    )
    rerender(<PurchaseOrderFormModal open={true} onClose={vi.fn()} onCreated={vi.fn()} />)

    expect(screen.getByText(/draft restored/i)).toBeInTheDocument()
  })
})

// ── 3.1 — Dropdowns Supplier Entity e Purchasing Agent ───────────────────────

describe('PurchaseOrderFormModal 3.1 — Dropdowns Supplier e Agent', () => {
  it('renderiza label "Supplier Entity" e select com placeholder', () => {
    renderModal()

    expect(screen.getByLabelText(/supplier entity/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /supplier entity/i })).toBeInTheDocument()
  })

  it('renderiza label "Purchasing Agent" e select com placeholder', () => {
    renderModal()

    expect(screen.getByLabelText(/purchasing agent/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /purchasing agent/i })).toBeInTheDocument()
  })

  it('select Supplier preenche todas as opções do mock', () => {
    renderModal()

    const select = screen.getByRole('combobox', { name: /supplier entity/i })
    suppliersMock.forEach((name) => {
      expect(select).toHaveTextContent(name)
    })
  })

  it('select Agent preenche todas as opções do mock', () => {
    renderModal()

    const select = screen.getByRole('combobox', { name: /purchasing agent/i })
    employeesMock.forEach((name) => {
      expect(select).toHaveTextContent(name)
    })
  })

  it('selecionar supplier atualiza o estado — habilita geração quando todos os campos OK', async () => {
    renderModal()

    const supplierSelect = screen.getByRole('combobox', { name: /supplier entity/i })
    const agentSelect    = screen.getByRole('combobox', { name: /purchasing agent/i })

    await userEvent.selectOptions(supplierSelect, 'Bosch Global Parts')
    await userEvent.selectOptions(agentSelect, 'Carlos Mendes')

    // issueDate já preenchida (2023-10-27) e INITIAL_ORDER_ITEMS tem 2 itens
    expect(screen.getByRole('button', { name: /generate order/i })).not.toBeDisabled()
  })

  it('select Supplier inicia com valor vazio (placeholder)', () => {
    renderModal()

    const select = screen.getByRole('combobox', { name: /supplier entity/i }) as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('select Agent inicia com valor vazio (placeholder)', () => {
    renderModal()

    const select = screen.getByRole('combobox', { name: /purchasing agent/i }) as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('supplier e agent são independentes — mudar um não afeta o outro', async () => {
    renderModal()

    const supplierSelect = screen.getByRole('combobox', { name: /supplier entity/i }) as HTMLSelectElement
    const agentSelect    = screen.getByRole('combobox', { name: /purchasing agent/i }) as HTMLSelectElement

    await userEvent.selectOptions(supplierSelect, 'NGK Spark Plugs')
    expect(agentSelect.value).toBe('')

    await userEvent.selectOptions(agentSelect, 'Ana Lima')
    expect(supplierSelect.value).toBe('NGK Spark Plugs')
  })
})

// ── 3.2 — Date Pickers Issue Date e Expected Delivery ─────────────────────────

describe('PurchaseOrderFormModal 3.2 — Date Pickers e Validação', () => {
  it('renderiza label "Issue Date" e input[type=date]', () => {
    renderModal()

    expect(screen.getByLabelText(/issue date/i)).toHaveAttribute('type', 'date')
  })

  it('renderiza label "Expected Delivery" e input[type=date]', () => {
    renderModal()

    expect(screen.getByLabelText(/expected delivery/i)).toHaveAttribute('type', 'date')
  })

  it('Issue Date inicia com valor padrão 2023-10-27', () => {
    renderModal()

    const input = screen.getByLabelText(/issue date/i) as HTMLInputElement
    expect(input.value).toBe('2023-10-27')
  })

  it('Expected Delivery inicia vazia', () => {
    renderModal()

    const input = screen.getByLabelText(/expected delivery/i) as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('Expected Delivery posterior à Issue Date — sem borda coral, sem mensagem de erro', async () => {
    renderModal()

    const deliveryInput = screen.getByLabelText(/expected delivery/i)
    fireEvent.change(deliveryInput, { target: { value: '2023-11-15' } })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(deliveryInput).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('Expected Delivery igual à Issue Date — exibe mensagem de erro e aria-invalid', async () => {
    renderModal()

    const deliveryInput = screen.getByLabelText(/expected delivery/i)
    fireEvent.change(deliveryInput, { target: { value: '2023-10-27' } })

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(deliveryInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('Expected Delivery anterior à Issue Date — exibe mensagem de erro e aria-invalid', async () => {
    renderModal()

    const deliveryInput = screen.getByLabelText(/expected delivery/i)
    fireEvent.change(deliveryInput, { target: { value: '2023-10-01' } })

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(deliveryInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('mensagem de erro contém texto sobre data posterior', () => {
    renderModal()

    const deliveryInput = screen.getByLabelText(/expected delivery/i)
    fireEvent.change(deliveryInput, { target: { value: '2023-09-01' } })

    expect(screen.getByRole('alert')).toHaveTextContent(/after issue date/i)
  })

  it('corrigir Expected Delivery remove mensagem de erro', async () => {
    renderModal()

    const deliveryInput = screen.getByLabelText(/expected delivery/i)

    // Primeiro: data inválida
    fireEvent.change(deliveryInput, { target: { value: '2023-10-01' } })
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Corrigir para data válida
    fireEvent.change(deliveryInput, { target: { value: '2023-12-01' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('Expected Delivery vazia com Issue Date preenchida não exibe erro', () => {
    renderModal()

    // Estado padrão: issueDate=2023-10-27, expectedDelivery=''
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
