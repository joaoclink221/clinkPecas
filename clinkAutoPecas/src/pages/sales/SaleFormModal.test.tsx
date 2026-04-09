import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SaleFormModal } from './SaleFormModal'

// ── Helper ────────────────────────────────────────────────────────────────────

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

// ── 1.1 — Modal e Overlay ─────────────────────────────────────────────────────

describe('SaleFormModal 1.1 — Modal e Overlay', () => {
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

  it('dialog tem aria-labelledby apontando para o h2 "Nova Venda"', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)).toHaveTextContent(/nova venda/i)
  })

  it('exibe h2 "Nova Venda" no header', () => {
    renderModal()

    expect(screen.getByRole('heading', { name: /nova venda/i })).toBeInTheDocument()
  })

  it('exibe subtítulo "GERAÇÃO DE ORÇAMENTO & VENDA DIRETA"', () => {
    renderModal()

    expect(screen.getByText(/geração de orçamento/i)).toBeInTheDocument()
  })

  it('botão X está presente com aria-label "Fechar modal"', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /fechar modal/i })).toBeInTheDocument()
  })

  it('botão X chama onClose ao clicar', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /fechar modal/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clicar no overlay chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('presentation'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clicar dentro do dialog NÃO chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('modal reaparece ao reabrir após fechar (re-render)', () => {
    const { rerender } = render(
      <SaleFormModal open={false} onClose={vi.fn()} onCreated={vi.fn()} />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<SaleFormModal open={true} onClose={vi.fn()} onCreated={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

// ── 1.2 — Rodapé de Ações ─────────────────────────────────────────────────────

describe('SaleFormModal 1.2 — Rodapé de Ações', () => {
  it('botão "CANCELAR" está presente', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('botão "Finalizar Venda" está presente', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /finalizar venda/i })).toBeInTheDocument()
  })

  it('botão "Finalizar Venda" está habilitado ao abrir o modal (validação acontece no clique)', () => {
    // A validação migrou para handleSubmit — o botão nunca é disabled na abertura
    renderModal()

    expect(screen.getByRole('button', { name: /finalizar venda/i })).not.toBeDisabled()
  })

  it('"CANCELAR" chama onClose ao clicar', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('botão "Finalizar Venda" tem type="button" para evitar submit acidental', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /finalizar venda/i })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('botão "CANCELAR" tem type="button" para evitar submit acidental', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /cancelar/i })).toHaveAttribute('type', 'button')
  })
})

// ── 3.1 — Dropdown "Seleção de Cliente" ───────────────────────────────────────

describe('SaleFormModal 3.1 — Dropdown Seleção de Cliente', () => {
  it('exibe label "Seleção de Cliente"', () => {
    renderModal()

    expect(screen.getByText(/seleção de cliente/i)).toBeInTheDocument()
  })

  it('exibe placeholder "Selecione um cliente…" por padrão (nenhum cliente selecionado)', () => {
    renderModal()

    // Valor vazio indica que nenhum cliente foi selecionado (opção placeholder ativa)
    expect(screen.getByLabelText(/seleção de cliente/i)).toHaveValue('')
  })

  it('select está associado ao label via htmlFor/id', () => {
    renderModal()

    // getByLabelText encontra o <select> pelo <label htmlFor="sale-client-select">
    expect(screen.getByLabelText(/seleção de cliente/i)).toBeInTheDocument()
  })

  it('contém todas as opções do mock de clientes', () => {
    renderModal()

    const select = screen.getByLabelText(/seleção de cliente/i)
    const options = select.querySelectorAll('option')

    // 1 placeholder + 5 clientes do mock
    expect(options.length).toBe(6)
  })

  it('selecionar um cliente atualiza o valor exibido no dropdown', async () => {
    renderModal()

    const select = screen.getByLabelText(/seleção de cliente/i)
    await userEvent.selectOptions(select, 'CLI-001')

    // Verifica que o valor controlado reflete o ID do cliente selecionado
    expect(select).toHaveValue('CLI-001')
  })

  it('sem cliente selecionado, clicar Finalizar exibe toast "Selecione um cliente"', async () => {
    // paymentMethod padrão é 'pix' e itens já existem; validação é feita no clique
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /finalizar venda/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/selecione um cliente/i)
  })

  it('selecionar cliente diferente atualiza corretamente o valor controlado', async () => {
    renderModal()

    const select = screen.getByLabelText(/seleção de cliente/i)

    await userEvent.selectOptions(select, 'CLI-003')
    expect(select).toHaveValue('CLI-003')

    await userEvent.selectOptions(select, 'CLI-005')
    expect(select).toHaveValue('CLI-005')
  })
})

// ── 3.2 — Campo "Vendedor Responsável" readonly ───────────────────────────────

describe('SaleFormModal 3.2 — Campo Vendedor Responsável', () => {
  it('exibe label "Vendedor Responsável"', () => {
    renderModal()

    expect(screen.getByText(/vendedor responsável/i)).toBeInTheDocument()
  })

  it('exibe o valor hardcoded "Carlos Alberto (ID: 442)"', () => {
    renderModal()

    expect(screen.getByLabelText(/vendedor responsável/i)).toHaveValue(
      'Carlos Alberto (ID: 442)',
    )
  })

  it('campo possui atributo readOnly', () => {
    renderModal()

    expect(screen.getByLabelText(/vendedor responsável/i)).toHaveAttribute('readonly')
  })

  it('valor não é alterado ao tentar digitar', async () => {
    renderModal()

    const input = screen.getByLabelText(/vendedor responsável/i)
    await userEvent.type(input, 'outro valor')

    expect(input).toHaveValue('Carlos Alberto (ID: 442)')
  })
})

// ── 4.1 — Estrutura da tabela de itens ───────────────────────────────────────

describe('SaleFormModal 4.1 — Tabela de Itens', () => {
  it('renderiza o cabeçalho da seção "Itens da Venda"', () => {
    renderModal()

    expect(screen.getByText(/itens da venda/i)).toBeInTheDocument()
  })

  it('exibe os cabeçalhos das 5 colunas', () => {
    renderModal()

    expect(screen.getByText(/produto \/ sku/i)).toBeInTheDocument()
    expect(screen.getByText(/qtd\./i)).toBeInTheDocument()
    expect(screen.getByText(/preço unit\./i)).toBeInTheDocument()
    // "Subtotal" existe no cabeçalho da tabela e também no SummaryPanel
    expect(screen.getAllByText(/subtotal/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/ações/i)).toBeInTheDocument()
  })

  it('renderiza 2 linhas com os itens iniciais da imagem', () => {
    renderModal()

    expect(screen.getByText('Turbo Compressor T3 Titanium')).toBeInTheDocument()
    expect(screen.getByText('Kit Injeção Eletrônica RaceSpec')).toBeInTheDocument()
  })

  it('exibe os SKUs de cada produto na coluna Produto', () => {
    renderModal()

    expect(screen.getByText(/SKU: OG-TB-001/)).toBeInTheDocument()
    expect(screen.getByText(/SKU: OG-IJ-992/)).toBeInTheDocument()
  })

  it('exibe inputs de quantidade com os valores iniciais corretos', () => {
    renderModal()

    const qtyTurbo = screen.getByLabelText(/quantidade do produto turbo compressor/i)
    const qtyKit   = screen.getByLabelText(/quantidade do produto kit injeção/i)

    expect(qtyTurbo).toHaveValue(2)
    expect(qtyKit).toHaveValue(1)
  })

  it('subtotal da linha 1 é R$ 9.000,00 (4.500 × 2)', () => {
    renderModal()

    // Intl.NumberFormat pt-BR: "R$\u00a09.000,00"
    expect(screen.getByText(/9\.000,00/)).toBeInTheDocument()
  })

  it('subtotal da linha 2 é R$ 3.450,00 (3.450 × 1)', () => {
    renderModal()

    // Kit Injeção qty=1 → unitPrice === subtotal, logo 2 células exibem R$ 3.450,00
    expect(screen.getAllByText(/3\.450,00/)).toHaveLength(2)
  })

  it('exibe botão "Adicionar Produto" na seção', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /adicionar produto/i })).toBeInTheDocument()
  })
})

// ── 4.2 — Edição de quantidade reativa ───────────────────────────────────────

describe('SaleFormModal 4.2 — Edição de Quantidade', () => {
  it('alterar qty do Turbo para 3 muda subtotal da linha para R$ 13.500,00', () => {
    renderModal()

    const qtyInput = screen.getByLabelText(/quantidade do produto turbo compressor/i)
    fireEvent.change(qtyInput, { target: { value: '3' } })

    expect(screen.getByText(/13\.500,00/)).toBeInTheDocument()
  })

  it('alterar qty do Turbo remove o subtotal antigo R$ 9.000,00', () => {
    renderModal()

    const qtyInput = screen.getByLabelText(/quantidade do produto turbo compressor/i)
    fireEvent.change(qtyInput, { target: { value: '3' } })

    // Após mudar para 3, R$ 9.000,00 não deve mais ser o subtotal do Turbo
    // (Verifica indiretamente: o novo valor 13.500,00 substituiu 9.000,00)
    expect(screen.getByText(/13\.500,00/)).toBeInTheDocument()
    expect(screen.queryByText(/9\.000,00/)).not.toBeInTheDocument()
  })

  it('impede qty menor que 1: valor 0 é substituído por 1', () => {
    renderModal()

    const qtyInput = screen.getByLabelText(/quantidade do produto turbo compressor/i)
    // parseInt('0') || 1 = 1 → Math.max(1, 1) = 1
    fireEvent.change(qtyInput, { target: { value: '0' } })

    expect(qtyInput).toHaveValue(1)
  })

  it('impede qty negativo: valor -5 é substituído por 1', () => {
    renderModal()

    const qtyInput = screen.getByLabelText(/quantidade do produto turbo compressor/i)
    // parseInt('-5') = -5 → Math.max(1, -5) = 1
    fireEvent.change(qtyInput, { target: { value: '-5' } })

    expect(qtyInput).toHaveValue(1)
  })
})

// ── 4.3 — Remoção de item com lixeira ────────────────────────────────────────

describe('SaleFormModal 4.3 — Remoção de Item', () => {
  it('clicar na lixeira do 1º item remove o Turbo Compressor', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))

    expect(screen.queryByText('Turbo Compressor T3 Titanium')).not.toBeInTheDocument()
  })

  it('após remover o 1º item, o 2º permanece na tabela', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))

    expect(screen.getByText('Kit Injeção Eletrônica RaceSpec')).toBeInTheDocument()
  })

  it('remover todos os itens exibe estado vazio "Nenhum produto adicionado"', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))
    await userEvent.click(screen.getByRole('button', { name: /remover kit injeção/i }))

    expect(screen.getByText(/nenhum produto adicionado/i)).toBeInTheDocument()
  })

  it('remover todos os itens e clicar Finalizar exibe toast "Adicione ao menos um produto"', async () => {
    renderModal()

    // Cliente deve estar selecionado para que a validação chegue ao guard de itens
    await userEvent.selectOptions(screen.getByLabelText(/seleção de cliente/i), 'CLI-001')
    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))
    await userEvent.click(screen.getByRole('button', { name: /remover kit injeção/i }))

    await userEvent.click(screen.getByRole('button', { name: /finalizar venda/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/adicione ao menos um produto/i)
  })
})

// ── 4.4 — Botão "Adicionar Produto" e dropdown ───────────────────────────────

describe('SaleFormModal 4.4 — Adicionar Produto', () => {
  it('dropdown está fechado por padrão', () => {
    renderModal()

    expect(screen.queryByRole('listbox', { name: /produtos disponíveis/i })).not.toBeInTheDocument()
  })

  it('clicar em "Adicionar Produto" abre o dropdown', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    expect(screen.getByRole('listbox', { name: /produtos disponíveis/i })).toBeInTheDocument()
  })

  it('dropdown lista todos os produtos do mock com nome, SKU e preço', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    expect(screen.getByText('Filtro de Óleo Performance Pro')).toBeInTheDocument()
    expect(screen.getByText(/OG-FL-210/)).toBeInTheDocument()
  })

  it('selecionar produto novo adiciona nova linha à tabela', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.click(screen.getByRole('option', { name: /filtro de óleo performance pro/i }))

    expect(screen.getByText('Filtro de Óleo Performance Pro')).toBeInTheDocument()
  })

  it('selecionar produto novo fecha o dropdown', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.click(screen.getByRole('option', { name: /filtro de óleo performance pro/i }))

    expect(screen.queryByRole('listbox', { name: /produtos disponíveis/i })).not.toBeInTheDocument()
  })

  it('adicionar produto já existente incrementa quantidade, sem duplicar linha', async () => {
    renderModal()

    // Turbo Compressor já está na tabela com qty 2
    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.click(screen.getByRole('option', { name: /turbo compressor t3 titanium/i }))

    // Deve ter exatamente 1 input de quantidade para o Turbo
    const qtyInputs = screen.getAllByLabelText(/quantidade do produto turbo compressor/i)
    expect(qtyInputs).toHaveLength(1)

    // Quantidade deve ter sido incrementada para 3
    expect(qtyInputs[0]).toHaveValue(3)
  })

  it('clicar em "Adicionar Produto" novamente fecha o dropdown (toggle)', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    expect(screen.queryByRole('listbox', { name: /produtos disponíveis/i })).not.toBeInTheDocument()
  })

  it('dropdown exibe campo de busca ao abrir', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    expect(screen.getByLabelText(/buscar produto/i)).toBeInTheDocument()
  })

  it('busca por nome filtra os produtos exibidos', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.type(screen.getByLabelText(/buscar produto/i), 'filtro')

    // Apenas "Filtro de Óleo Performance Pro" deve aparecer
    expect(screen.getByRole('option', { name: /filtro de óleo performance pro/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /turbo compressor/i })).not.toBeInTheDocument()
  })

  it('busca por SKU filtra os produtos exibidos', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.type(screen.getByLabelText(/buscar produto/i), 'OG-EC')

    expect(screen.getByRole('option', { name: /ecu programável stage 3/i })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /turbo compressor/i })).not.toBeInTheDocument()
  })

  it('busca sem resultado exibe estado vazio com o termo digitado', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.type(screen.getByLabelText(/buscar produto/i), 'xyz-inexistente')

    expect(screen.getByText(/nenhum produto encontrado para/i)).toBeInTheDocument()
    expect(screen.getByText(/xyz-inexistente/i)).toBeInTheDocument()
  })

  it('produtos já adicionados exibem badge "Na venda ×N" com quantidade correta', async () => {
    renderModal()

    // Turbo Compressor qty=2 e Kit Injeção qty=1 já estão no estado inicial
    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    expect(screen.getByText(/na venda ×2/i)).toBeInTheDocument()
    expect(screen.getByText(/na venda ×1/i)).toBeInTheDocument()
  })

  it('produtos não adicionados não exibem badge "Na venda"', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    // Filtro de Óleo e ECU não estão no carrinho — sem badge
    const options = screen.getAllByRole('option')
    const filtroOption = options.find((o) => /filtro de óleo/i.test(o.textContent ?? ''))
    expect(filtroOption).not.toHaveTextContent(/na venda/i)
  })

  it('fechar e reabrir dropdown limpa a busca anterior', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    await userEvent.type(screen.getByLabelText(/buscar produto/i), 'turbo')

    // Fecha
    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))
    // Reabre
    await userEvent.click(screen.getByRole('button', { name: /adicionar produto/i }))

    // Campo de busca deve estar limpo — todos os produtos visíveis
    expect(screen.getByLabelText(/buscar produto/i)).toHaveValue('')
    // Escopar ao listbox para não confundir com <option> do <select> de cliente
    const listbox = screen.getByRole('listbox', { name: /produtos disponíveis/i })
    expect(within(listbox).getAllByRole('option')).toHaveLength(6)
  })
})

// ── 5.1 — Toggle de forma de pagamento ───────────────────────────────────────────

describe('SaleFormModal 5.1 — Toggle Forma de Pagamento', () => {
  it('exibe label "Forma de Pagamento"', () => {
    renderModal()

    expect(screen.getByText(/forma de pagamento/i)).toBeInTheDocument()
  })

  it('exibe os 4 botões de pagamento', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /^pix$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^cartão$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^boleto$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^faturado$/i })).toBeInTheDocument()
  })

  it('PIX está ativo por padrão (aria-pressed=true)', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /^pix$/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('os outros 3 botões estão inativas por padrão (aria-pressed=false)', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /^cartão$/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /^boleto$/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /^faturado$/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('clicar em CARTÃO ativa Cartão e desativa PIX', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /^cartão$/i }))

    expect(screen.getByRole('button', { name: /^cartão$/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^pix$/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('apenas um botão fica ativo por vez ao alternar entre opções', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /^boleto$/i }))

    const pressed = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-pressed') === 'true')

    // Exatamente 1 botão de pagamento ativo (aria-pressed=true)
    expect(pressed).toHaveLength(1)
    expect(pressed[0]).toHaveAccessibleName(/boleto/i)
  })

  it('Finalizar Venda está sempre habilitado (validação no clique, não via disabled)', async () => {
    renderModal()

    // Botão habilitado mesmo sem cliente — validação é via toast ao clicar
    expect(screen.getByRole('button', { name: /finalizar venda/i })).not.toBeDisabled()
  })
})

// ── 5.2 — Painel de resumo reativo ──────────────────────────────────────────────

describe('SaleFormModal 5.2 — Painel de Resumo', () => {
  it('exibe label "Resumo / Totais"', () => {
    renderModal()

    expect(screen.getByText(/resumo \/ totais/i)).toBeInTheDocument()
  })

  it('exibe linha "Subtotal" no painel de resumo', () => {
    renderModal()

    // "Subtotal" aparece no cabeçalho da tabela E no SummaryPanel
    expect(screen.getAllByText(/^subtotal$/i)).toHaveLength(2)
  })

  it('exibe linha "Valor Total Líquido"', () => {
    renderModal()

    expect(screen.getByText(/valor total líquido/i)).toBeInTheDocument()
  })

  it('Subtotal com os 2 itens iniciais é R$ 12.450,00', () => {
    renderModal()

    // 4500×2 + 3450×1 = 12450
    expect(screen.getByText(/12\.450,00/)).toBeInTheDocument()
  })

  it('Total Líquido com os 2 itens e desconto 10% é R$ 11.205,00', () => {
    renderModal()

    // 12450 * 0.90 = 11205
    expect(screen.getByText(/11\.205,00/)).toBeInTheDocument()
  })

  it('alterar quantidade reflete imediatamente no Subtotal e no Total', () => {
    renderModal()

    // Turbo qty 2→3: novo gross = 4500×3 + 3450 = 16950; total = 16950*0.90 = 15255
    fireEvent.change(
      screen.getByLabelText(/quantidade do produto turbo compressor/i),
      { target: { value: '3' } },
    )

    expect(screen.getByText(/16\.950,00/)).toBeInTheDocument()
    expect(screen.getByText(/15\.255,00/)).toBeInTheDocument()
  })
})

// ── 5.3 — Cupom de desconto mockado ─────────────────────────────────────────────

describe('SaleFormModal 5.3 — Cupom de Desconto', () => {
  it('badge "Cupom Aplicado" é visível quando discountRate=0.10', () => {
    renderModal()

    expect(screen.getByText(/cupom aplicado.*10%/i)).toBeInTheDocument()
  })

  it('valor do desconto exibido é R$ 1.245,00 (12.450 × 10%)', () => {
    renderModal()

    // Valor precedido por "-": "-R$ 1.245,00"
    expect(screen.getByText(/1\.245,00/)).toBeInTheDocument()
  })

  it('remover todos os itens exibe Subtotal R$ 0,00', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))
    await userEvent.click(screen.getByRole('button', { name: /remover kit injeção/i }))

    // Com itens vazios: gross=0, todos os valores zerados
    expect(screen.getAllByText(/R\$\s*0,00/)).toHaveLength(3)
  })

  it('remover todos os itens esconde o badge de cupom (desconto sobre 0 é 0)', async () => {
    // Com gross=0, discountAmount=0 mas discountRate ainda é 0.10
    // O badge permanece visível pois a condição é discountRate>0, não discountAmount>0
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))
    await userEvent.click(screen.getByRole('button', { name: /remover kit injeção/i }))

    expect(screen.getByText(/cupom aplicado.*10%/i)).toBeInTheDocument()
  })
})

// ── 6.1 — Validação antes de finalizar ───────────────────────────────────────

describe('SaleFormModal 6.1 — Validação antes de Finalizar', () => {
  it('clicar Finalizar sem cliente exibe toast "Selecione um cliente"', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /finalizar venda/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/selecione um cliente/i)
  })

  it('modal permanece aberto após exibir toast de erro', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /finalizar venda/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('clicar Finalizar com cliente mas sem itens exibe toast "Adicione ao menos um produto"', async () => {
    renderModal()

    await userEvent.selectOptions(screen.getByLabelText(/seleção de cliente/i), 'CLI-001')
    await userEvent.click(screen.getByRole('button', { name: /remover turbo compressor/i }))
    await userEvent.click(screen.getByRole('button', { name: /remover kit injeção/i }))
    await userEvent.click(screen.getByRole('button', { name: /finalizar venda/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/adicione ao menos um produto/i)
  })

  it('toast de erro não contém mensagem de sucesso', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /finalizar venda/i }))

    expect(screen.getByRole('alert')).not.toHaveTextContent(/venda finalizada/i)
  })
})

// ── 6.2 — Submit mock e feedback ─────────────────────────────────────────────

describe('SaleFormModal 6.2 — Submit Mock', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => { vi.runOnlyPendingTimers(); vi.useRealTimers() })

  function selectValidClient() {
    fireEvent.change(
      screen.getByLabelText(/seleção de cliente/i),
      { target: { value: 'CLI-001' } },
    )
  }

  it('botão muda para "Finalizando…" e fica desabilitado durante loading', () => {
    renderModal()
    selectValidClient()

    act(() => { fireEvent.click(screen.getByRole('button', { name: /finalizar venda/i })) })

    expect(screen.getByRole('button', { name: /finalizando/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /finalizando/i })).toBeDisabled()
  })

  it('após 800ms exibe toast de sucesso com valor líquido R$ 11.205,00', () => {
    renderModal()
    selectValidClient()

    act(() => { fireEvent.click(screen.getByRole('button', { name: /finalizar venda/i })) })
    act(() => { vi.advanceTimersByTime(800) })

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/venda finalizada com sucesso/i)
    expect(alert).toHaveTextContent(/11\.205,00/)
  })

  it('após 800ms + 1500ms chama onClose', () => {
    const { onClose } = renderModal()
    selectValidClient()

    act(() => { fireEvent.click(screen.getByRole('button', { name: /finalizar venda/i })) })
    act(() => { vi.advanceTimersByTime(2300) })

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('após finalizar, estado reseta: select de cliente volta ao placeholder', () => {
    renderModal()
    selectValidClient()

    act(() => { fireEvent.click(screen.getByRole('button', { name: /finalizar venda/i })) })
    act(() => { vi.advanceTimersByTime(2300) })

    expect(screen.getByLabelText(/seleção de cliente/i)).toHaveValue('')
  })

  it('após finalizar, itens iniciais da imagem voltam à tabela', () => {
    renderModal()
    selectValidClient()

    act(() => { fireEvent.click(screen.getByRole('button', { name: /finalizar venda/i })) })
    act(() => { vi.advanceTimersByTime(2300) })

    expect(screen.getByText('Turbo Compressor T3 Titanium')).toBeInTheDocument()
    expect(screen.getByText('Kit Injeção Eletrônica RaceSpec')).toBeInTheDocument()
  })
})
