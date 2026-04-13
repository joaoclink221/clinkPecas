import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { WarrantyClaimModal } from './WarrantyClaimModal'
import {
  CHAMADO_DRAFT_KEY,
  INITIAL_CLAIM_STATE,
  availableSkusMock,
} from './warrantyClaimMocks'

// ── Helper ────────────────────────────────────────────────────────────────────

function renderModal(props?: Partial<Parameters<typeof WarrantyClaimModal>[0]>) {
  const onClose = vi.fn()
  const onSuccess = vi.fn()
  render(
    <WarrantyClaimModal
      open={true}
      onClose={onClose}
      onSuccess={onSuccess}
      {...props}
    />,
  )
  return { onClose, onSuccess }
}

// ── 1.1 — Modal, Overlay e Header ────────────────────────────────────────────

describe('WarrantyClaimModal 1.1 — Modal, Overlay e Header', () => {
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

  it('dialog tem aria-labelledby apontando para o h2 "Abrir Novo Chamado"', () => {
    renderModal()

    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby')
    expect(document.getElementById(labelId!)).toHaveTextContent('Abrir Novo Chamado')
  })

  it('exibe h2 "Abrir Novo Chamado" no header', () => {
    renderModal()

    expect(screen.getByRole('heading', { name: /abrir novo chamado/i })).toBeInTheDocument()
  })

  it('exibe subtítulo "WARRANTY & RETURN PROTOCOL"', () => {
    renderModal()

    expect(screen.getByText(/warranty & return protocol/i)).toBeInTheDocument()
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

    // O overlay é o container externo com role="presentation"
    const overlay = document.querySelector('[role="presentation"]') as HTMLElement
    await userEvent.click(overlay)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('clicar dentro do dialog NÃO chama onClose', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('pressionar Escape chama onClose', () => {
    const { onClose } = renderModal()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('Escape NÃO chama onClose quando open=false', () => {
    // O useEffect não registra o listener quando open=false
    const { onClose } = renderModal({ open: false })

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('modal reaparece ao reabrir após fechar (re-render)', () => {
    const { rerender } = render(
      <WarrantyClaimModal open={false} onClose={vi.fn()} onSuccess={vi.fn()} />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

// ── 1.2 — Rodapé com 3 botões ─────────────────────────────────────────────────

describe('WarrantyClaimModal 1.2 — Rodapé de Ações', () => {
  afterEach(() => localStorage.clear())

  it('renderiza os 3 botões do rodapé', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /salvar rascunho/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar abertura/i })).toBeInTheDocument()
  })

  it('todos os botões têm type="button" para evitar submit acidental', () => {
    renderModal()

    for (const name of [/cancelar/i, /salvar rascunho/i, /confirmar abertura/i]) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('type', 'button')
    }
  })

  it('"Cancelar" chama onClose e NÃO chama onSuccess', async () => {
    const { onClose, onSuccess } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('"Salvar Rascunho" persiste no localStorage com status "draft"', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.status).toBe('draft')
  })

  it('"Salvar Rascunho" persiste campo savedAt no localStorage', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(typeof saved.savedAt).toBe('string')
    expect(saved.savedAt).toBeTruthy()
  })

  it('"Salvar Rascunho" chama onClose após salvar', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('"Salvar Rascunho" NÃO chama onSuccess', async () => {
    const { onSuccess } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('"Confirmar Abertura" chama onSuccess com formulário válido', async () => {
    const { onSuccess } = renderModal()

    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.type(screen.getByLabelText(/data do incidente/i), '2024-03-15')
    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))
    await userEvent.type(
      screen.getByLabelText(/descrição do ocorrido/i),
      'Peça chegou com dano visível na embalagem.',
    )
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))

    expect(onSuccess).toHaveBeenCalledOnce()
  })

  it('"Confirmar Abertura" NÃO persiste rascunho no localStorage', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))

    expect(localStorage.getItem(CHAMADO_DRAFT_KEY)).toBeNull()
  })

  it('"Confirmar Abertura" NÃO chama onClose diretamente', async () => {
    // onClose é responsabilidade do pai após receber onSuccess
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))

    expect(onClose).not.toHaveBeenCalled()
  })
})

// ── 2.1 — Interface TypeScript e mocks ────────────────────────────────────────

describe('WarrantyClaimModal 2.1 — Interface e Mocks', () => {
  it('INITIAL_CLAIM_STATE tem skuId null', () => {
    expect(INITIAL_CLAIM_STATE.skuId).toBeNull()
  })

  it('INITIAL_CLAIM_STATE tem incidentDate vazio', () => {
    expect(INITIAL_CLAIM_STATE.incidentDate).toBe('')
  })

  it('INITIAL_CLAIM_STATE tem reason null', () => {
    expect(INITIAL_CLAIM_STATE.reason).toBeNull()
  })

  it('INITIAL_CLAIM_STATE tem description vazio', () => {
    expect(INITIAL_CLAIM_STATE.description).toBe('')
  })

  it('INITIAL_CLAIM_STATE tem attachments como array vazio', () => {
    expect(INITIAL_CLAIM_STATE.attachments).toHaveLength(0)
  })

  it('INITIAL_CLAIM_STATE tem status "draft"', () => {
    expect(INITIAL_CLAIM_STATE.status).toBe('draft')
  })

  it('availableSkusMock contém exatamente 5 itens', () => {
    expect(availableSkusMock).toHaveLength(5)
  })

  it('availableSkusMock inclui OG-TB-001 (Turbo Compressor T3 Titanium)', () => {
    expect(availableSkusMock.find((s) => s.sku === 'OG-TB-001')).toBeTruthy()
  })

  it('availableSkusMock inclui OG-IJ-992 (Kit Injeção Eletrônica RaceSpec)', () => {
    expect(availableSkusMock.find((s) => s.sku === 'OG-IJ-992')).toBeTruthy()
  })

  it('availableSkusMock inclui ORD-98231-X (Disco de Freio Ventilado)', () => {
    expect(availableSkusMock.find((s) => s.sku === 'ORD-98231-X')).toBeTruthy()
  })

  it('availableSkusMock inclui ORD-88122-Y (Alternador 120A)', () => {
    expect(availableSkusMock.find((s) => s.sku === 'ORD-88122-Y')).toBeTruthy()
  })

  it('availableSkusMock inclui ORD-99100-A (Kit Filtros)', () => {
    expect(availableSkusMock.find((s) => s.sku === 'ORD-99100-A')).toBeTruthy()
  })

  it('cada item do mock tem campos sku e name não vazios', () => {
    for (const item of availableSkusMock) {
      expect(item.sku).toBeTruthy()
      expect(item.name).toBeTruthy()
    }
  })
})

// ── 2.2 — Restaurar rascunho ao abrir ─────────────────────────────────────────

describe('WarrantyClaimModal 2.2 — Restaurar Rascunho', () => {
  afterEach(() => localStorage.clear())

  function seedDraft(overrides: Record<string, unknown> = {}): void {
    localStorage.setItem(
      CHAMADO_DRAFT_KEY,
      JSON.stringify({
        skuId: 'OG-TB-001',
        incidentDate: '2026-03-15',
        reason: 'avaria',
        description: 'Motor com ruído metálico',
        status: 'draft',
        savedAt: new Date().toISOString(),
        ...overrides,
      }),
    )
  }

  it('sem rascunho no localStorage não exibe banner', () => {
    renderModal()

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('com rascunho no localStorage exibe banner "Rascunho restaurado"', () => {
    seedDraft()
    renderModal()

    expect(screen.getByRole('status')).toHaveTextContent(/rascunho restaurado/i)
  })

  it('banner tem aria-live="polite"', () => {
    seedDraft()
    renderModal()

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('banner não é exibido quando não há rascunho', () => {
    renderModal()

    expect(screen.queryByText(/rascunho restaurado/i)).not.toBeInTheDocument()
  })

  it('fechar modal e reabrir sem rascunho não exibe banner', () => {
    // Abre com rascunho → banner aparece
    seedDraft()
    const { rerender } = render(
      <WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Remove rascunho e fecha
    localStorage.clear()
    rerender(<WarrantyClaimModal open={false} onClose={vi.fn()} onSuccess={vi.fn()} />)

    // Reabre sem rascunho — banner não deve aparecer
    rerender(<WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('JSON inválido no localStorage não causa erro e não exibe banner', () => {
    localStorage.setItem(CHAMADO_DRAFT_KEY, '{invalid json}')

    expect(() => renderModal()).not.toThrow()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('salvar rascunho e reabrir o modal exibe banner', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    // Reabre o modal numa nova instância
    render(<WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />)

    const banners = screen.getAllByRole('status')
    expect(banners.some((b) => /rascunho restaurado/i.test(b.textContent ?? ''))).toBe(true)
  })
})

// ── 3.1 — Header da seção Identificação do Item ───────────────────────────────

describe('WarrantyClaimModal 3.1 — Header da Seção', () => {
  it('exibe label "Identificação do Item" na seção', () => {
    renderModal()

    expect(screen.getByText(/identificação do item/i)).toBeInTheDocument()
  })

  it('label da seção está visível no corpo do modal', () => {
    renderModal()

    const header = screen.getByText(/identificação do item/i)
    expect(header).toBeVisible()
  })
})

// ── 3.2 — Dropdown de SKU ─────────────────────────────────────────────────────

describe('WarrantyClaimModal 3.2 — Dropdown SKU', () => {
  it('exibe label "Seleção de SKU / Produto" associada ao select', () => {
    renderModal()

    expect(screen.getByLabelText(/seleção de sku/i)).toBeInTheDocument()
  })

  it('select tem placeholder "Selecione um item do pedido…" como primeira opção desabilitada', () => {
    renderModal()

    const option = screen.getByRole('option', { name: /selecione um item do pedido/i })
    expect(option).toBeInTheDocument()
    expect(option).toBeDisabled()
  })

  it('select renderiza todas as 5 opções do mock de SKUs', () => {
    renderModal()

    expect(screen.getByRole('option', { name: /OG-TB-001/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /OG-IJ-992/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /ORD-98231-X/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /ORD-88122-Y/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /ORD-99100-A/i })).toBeInTheDocument()
  })

  it('selecionar SKU atualiza o valor do select', async () => {
    renderModal()

    const select = screen.getByLabelText(/seleção de sku/i)
    await userEvent.selectOptions(select, 'OG-TB-001')

    expect(select).toHaveValue('OG-TB-001')
  })

  it('selecionar SKU e salvar rascunho persiste skuId no localStorage', async () => {
    renderModal()

    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-IJ-992')
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.skuId).toBe('OG-IJ-992')
  })

  it('SKU restaurado do rascunho aparece pré-selecionado no select', () => {
    localStorage.setItem(
      CHAMADO_DRAFT_KEY,
      JSON.stringify({ skuId: 'ORD-98231-X', incidentDate: '', reason: null, description: '', status: 'draft' }),
    )
    renderModal()

    expect(screen.getByLabelText(/seleção de sku/i)).toHaveValue('ORD-98231-X')
  })

  afterEach(() => localStorage.clear())
})

// ── 3.3 — Date picker de incidente ────────────────────────────────────────────

describe('WarrantyClaimModal 3.3 — Date Picker', () => {
  afterEach(() => localStorage.clear())

  it('exibe label "Data do Incidente" associada ao input', () => {
    renderModal()

    expect(screen.getByLabelText(/data do incidente/i)).toBeInTheDocument()
  })

  it('input é do tipo "date"', () => {
    renderModal()

    expect(screen.getByLabelText(/data do incidente/i)).toHaveAttribute('type', 'date')
  })

  it('atributo max é a data de hoje (datas futuras desabilitadas)', () => {
    renderModal()

    const today = new Date().toISOString().split('T')[0]
    expect(screen.getByLabelText(/data do incidente/i)).toHaveAttribute('max', today)
  })

  it('selecionar data válida (passada) atualiza o valor do input', () => {
    renderModal()

    const dateInput = screen.getByLabelText(/data do incidente/i)
    fireEvent.change(dateInput, { target: { value: '2026-01-15' } })

    expect(dateInput).toHaveValue('2026-01-15')
  })

  it('selecionar data e salvar rascunho persiste incidentDate no localStorage', async () => {
    renderModal()

    fireEvent.change(screen.getByLabelText(/data do incidente/i), { target: { value: '2026-01-15' } })
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.incidentDate).toBe('2026-01-15')
  })

  it('data restaurada do rascunho aparece pré-preenchida no input', () => {
    localStorage.setItem(
      CHAMADO_DRAFT_KEY,
      JSON.stringify({ skuId: null, incidentDate: '2026-02-20', reason: null, description: '', status: 'draft' }),
    )
    renderModal()

    expect(screen.getByLabelText(/data do incidente/i)).toHaveValue('2026-02-20')
  })
})

// ── 4.1 — Grid de 3 cards de motivo ───────────────────────────────────────────

describe('WarrantyClaimModal 4.1 — Cards de Motivo', () => {
  it('renderiza o header da seção "Motivo da Solicitação"', () => {
    renderModal()

    expect(screen.getByText(/motivo da solicitação/i)).toBeInTheDocument()
  })

  it('renderiza os 3 cards de motivo', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /avaria/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /incompatível/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /erro de pedido/i })).toBeInTheDocument()
  })

  it('todos os cards têm type="button"', () => {
    renderModal()

    for (const name of [/avaria/i, /incompatível/i, /erro de pedido/i]) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('type', 'button')
    }
  })

  it('nenhum card está ativo ao abrir (reason=null)', () => {
    renderModal()

    expect(screen.getByRole('button', { name: /avaria/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /incompatível/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /erro de pedido/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('cards têm aria-pressed para acessibilidade', () => {
    renderModal()

    for (const name of [/avaria/i, /incompatível/i, /erro de pedido/i]) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed')
    }
  })
})

// ── 4.2 — Estado ativo com seleção exclusiva ──────────────────────────────────

describe('WarrantyClaimModal 4.2 — Seleção Exclusiva de Motivo', () => {
  afterEach(() => localStorage.clear())

  it('clicar em "Avaria" ativa o card (aria-pressed=true)', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))

    expect(screen.getByRole('button', { name: /avaria/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicar em "Avaria" mantém os outros cards inativos', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))

    expect(screen.getByRole('button', { name: /incompatível/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /erro de pedido/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('clicar em "Incompatível" desmarca "Avaria" (exclusividade)', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))
    await userEvent.click(screen.getByRole('button', { name: /incompatível/i }))

    expect(screen.getByRole('button', { name: /avaria/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /incompatível/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicar no card ativo novamente desmarca (toggle → reason=null)', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))
    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))

    expect(screen.getByRole('button', { name: /avaria/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selecionar motivo e salvar rascunho persiste reason no localStorage', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /erro de pedido/i }))
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.reason).toBe('erro_pedido')
  })

  it('salvar rascunho com reason=null persiste null no localStorage', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.reason).toBeNull()
  })

  it('motivo restaurado do rascunho aparece pré-selecionado', () => {
    localStorage.setItem(
      CHAMADO_DRAFT_KEY,
      JSON.stringify({ skuId: null, incidentDate: '', reason: 'incompativel', description: '', status: 'draft' }),
    )
    renderModal()

    expect(screen.getByRole('button', { name: /incompatível/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /avaria/i })).toHaveAttribute('aria-pressed', 'false')
  })
})

// ── 5.1 — Textarea de descrição ───────────────────────────────────────────────

describe('WarrantyClaimModal 5.1 — Textarea de Descrição', () => {
  it('renderiza o header da seção "Evidências e Observações"', () => {
    renderModal()
    expect(screen.getByText(/evidências e observações/i)).toBeInTheDocument()
  })

  it('exibe label "Descrição do Ocorrido" associada à textarea', () => {
    renderModal()
    expect(screen.getByLabelText(/descrição do ocorrido/i)).toBeInTheDocument()
  })

  it('textarea tem o placeholder correto', () => {
    renderModal()
    expect(screen.getByLabelText(/descrição do ocorrido/i)).toHaveAttribute(
      'placeholder',
      'Descreva detalhadamente o ocorrido ou defeito apresentado\u2026',
    )
  })

  it('exibe contador "0/500" quando textarea está vazia', () => {
    renderModal()
    expect(screen.getByText('0/500')).toBeInTheDocument()
  })

  it('digitar na textarea atualiza o valor e o contador', async () => {
    renderModal()
    const textarea = screen.getByLabelText(/descrição do ocorrido/i)
    await userEvent.type(textarea, 'Peça com defeito')
    expect(textarea).toHaveValue('Peça com defeito')
    expect(screen.getByText('16/500')).toBeInTheDocument()
  })

  it('textarea tem maxLength=500', () => {
    renderModal()
    expect(screen.getByLabelText(/descrição do ocorrido/i)).toHaveAttribute('maxLength', '500')
  })

  it('textarea é vazia no estado inicial (sem rascunho)', () => {
    renderModal()
    expect(screen.getByLabelText(/descrição do ocorrido/i)).toHaveValue('')
  })
})

// ── 5.2 — Dropzone de arquivos ────────────────────────────────────────────────

describe('WarrantyClaimModal 5.2 — Dropzone', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('renderiza a área de upload com role="button"', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /área de upload/i })).toBeInTheDocument()
  })

  it('exibe texto "Clique para anexar fotos ou arraste aqui"', () => {
    renderModal()
    expect(screen.getByText(/clique para anexar fotos ou arraste aqui/i)).toBeInTheDocument()
  })

  it('exibe sub-label com formatos e tamanho máximo', () => {
    renderModal()
    expect(screen.getByText(/PNG, JPG ou PDF/i)).toBeInTheDocument()
  })

  it('input file tem accept=".png,.jpg,.jpeg,.pdf" e atributo multiple', () => {
    renderModal()
    // Input é aria-hidden; acessado via document.querySelector
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toHaveAttribute('accept', '.png,.jpg,.jpeg,.pdf')
    expect(input).toHaveAttribute('multiple')
  })

  it('arrastar arquivo PNG válido via onDrop adiciona ao estado', () => {
    renderModal()
    const file = new File(['content'], 'foto.png', { type: 'image/png' })
    const dropzone = screen.getByRole('button', { name: /área de upload/i })
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
    expect(screen.getByText('foto.png')).toBeInTheDocument()
  })

  it('arrastar arquivo > 10 MB exibe mensagem de erro', () => {
    renderModal()
    const bigFile = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
    const dropzone = screen.getByRole('button', { name: /área de upload/i })
    fireEvent.drop(dropzone, { dataTransfer: { files: [bigFile] } })
    expect(screen.getByRole('alert')).toHaveTextContent(/tamanho máximo/i)
  })

  it('arquivo > 10 MB não é adicionado ao estado', () => {
    renderModal()
    const bigFile = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
    fireEvent.drop(screen.getByRole('button', { name: /área de upload/i }), {
      dataTransfer: { files: [bigFile] },
    })
    expect(screen.queryByText('big.jpg')).not.toBeInTheDocument()
  })

  it('mistura válido + > 10 MB: válido adicionado, erro exibido', () => {
    renderModal()
    const valid = new File(['content'], 'ok.jpg', { type: 'image/jpeg' })
    const big = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 })
    fireEvent.drop(screen.getByRole('button', { name: /área de upload/i }), {
      dataTransfer: { files: [valid, big] },
    })
    expect(screen.getByText('ok.jpg')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('selecionar arquivo válido via input onChange adiciona ao estado', () => {
    renderModal()
    const file = new File(['content'], 'via-input.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('via-input.jpg')).toBeInTheDocument()
  })

  it('selecionar arquivo > 10 MB via input onChange exibe erro', () => {
    renderModal()
    const bigFile = new File(['x'], 'big-input.jpg', { type: 'image/jpeg' })
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [bigFile] } })
    expect(screen.getByRole('alert')).toHaveTextContent(/tamanho máximo/i)
  })
})

// ── 5.3 — Preview dos arquivos anexados ──────────────────────────────────────

describe('WarrantyClaimModal 5.3 — Preview de Arquivos', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  function dropFile(file: File): void {
    fireEvent.drop(screen.getByRole('button', { name: /área de upload/i }), {
      dataTransfer: { files: [file] },
    })
  }

  it('lista de preview não é exibida quando não há anexos', () => {
    renderModal()
    expect(screen.queryByRole('list', { name: /arquivos anexados/i })).not.toBeInTheDocument()
  })

  it('anexar arquivo exibe lista com o nome do arquivo', () => {
    renderModal()
    dropFile(new File(['content'], 'peca.jpg', { type: 'image/jpeg' }))
    expect(screen.getByText('peca.jpg')).toBeInTheDocument()
  })

  it('exibe tamanho formatado em KB para arquivo pequeno', () => {
    renderModal()
    const file = new File(['x'.repeat(2048)], 'peca.jpg', { type: 'image/jpeg' })
    dropFile(file)
    expect(screen.getByText(/2 KB/)).toBeInTheDocument()
  })

  it('exibe tamanho formatado em MB para arquivo >= 1 MB', () => {
    renderModal()
    const file = new File(['content'], 'big.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 2.4 * 1024 * 1024 })
    dropFile(file)
    expect(screen.getByText(/2\.4 MB/)).toBeInTheDocument()
  })

  it('exibe botão Remover com aria-label para cada arquivo', () => {
    renderModal()
    dropFile(new File(['content'], 'foto.jpg', { type: 'image/jpeg' }))
    expect(screen.getByRole('button', { name: /remover foto\.jpg/i })).toBeInTheDocument()
  })

  it('clicar em X remove o arquivo da lista', async () => {
    renderModal()
    dropFile(new File(['content'], 'foto.jpg', { type: 'image/jpeg' }))
    await userEvent.click(screen.getByRole('button', { name: /remover foto\.jpg/i }))
    expect(screen.queryByText('foto.jpg')).not.toBeInTheDocument()
  })

  it('lista não é exibida após remover o único arquivo', async () => {
    renderModal()
    dropFile(new File(['content'], 'unico.jpg', { type: 'image/jpeg' }))
    await userEvent.click(screen.getByRole('button', { name: /remover unico\.jpg/i }))
    expect(screen.queryByRole('list', { name: /arquivos anexados/i })).not.toBeInTheDocument()
  })

  it('anexar 2 arquivos exibe ambos na lista', () => {
    renderModal()
    dropFile(new File(['a'], 'a.jpg', { type: 'image/jpeg' }))
    dropFile(new File(['b'], 'b.pdf', { type: 'application/pdf' }))
    expect(screen.getByText('a.jpg')).toBeInTheDocument()
    expect(screen.getByText('b.pdf')).toBeInTheDocument()
  })

  it('remover primeiro arquivo mantém o segundo', async () => {
    renderModal()
    dropFile(new File(['a'], 'a.jpg', { type: 'image/jpeg' }))
    dropFile(new File(['b'], 'b.jpg', { type: 'image/jpeg' }))
    await userEvent.click(screen.getByRole('button', { name: /remover a\.jpg/i }))
    expect(screen.queryByText('a.jpg')).not.toBeInTheDocument()
    expect(screen.getByText('b.jpg')).toBeInTheDocument()
  })

  it('imagem exibe thumbnail via URL.createObjectURL', async () => {
    renderModal()
    dropFile(new File(['content'], 'img.jpg', { type: 'image/jpeg' }))
    // <img alt="" aria-hidden> tem role="presentation"; query direta via DOM
    await waitFor(() =>
      expect(document.querySelector('img')).toHaveAttribute('src', 'blob:mock-url'),
    )
  })

  it('URL.revokeObjectURL é chamado ao desmontar o preview de imagem', async () => {
    renderModal()
    dropFile(new File(['content'], 'revogar.jpg', { type: 'image/jpeg' }))
    await waitFor(() => expect(document.querySelector('img')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /remover revogar\.jpg/i }))
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})

// ── 6.1 — Salvar Rascunho ────────────────────────────────────────────────────

describe('WarrantyClaimModal 6.1 — Salvar Rascunho', () => {
  afterEach(() => localStorage.clear())

  it('salvar com campos vazios persiste no localStorage com status "draft"', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.status).toBe('draft')
  })

  it('salvar com apenas SKU preenchido persiste o skuId', async () => {
    renderModal()
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.skuId).toBe('OG-TB-001')
  })

  it('rascunho salvo com SKU é restaurado ao reabrir o modal', async () => {
    const { rerender } = render(
      <WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />,
    )
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-IJ-992')
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))

    rerender(<WarrantyClaimModal open={false} onClose={vi.fn()} onSuccess={vi.fn()} />)
    rerender(<WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />)

    expect(screen.getByLabelText<HTMLSelectElement>(/seleção de sku/i).value).toBe('OG-IJ-992')
  })

  it('persiste campo savedAt no localStorage', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(typeof saved.savedAt).toBe('string')
    expect(saved.savedAt).toBeTruthy()
  })

  it('persiste attachmentNames (array de strings) em vez de objetos File', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    renderModal()
    const file = new File(['x'], 'evidencia.jpg', { type: 'image/jpeg' })
    fireEvent.drop(screen.getByRole('button', { name: /área de upload/i }), {
      dataTransfer: { files: [file] },
    })
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    const saved = JSON.parse(localStorage.getItem(CHAMADO_DRAFT_KEY) ?? '{}')
    expect(saved.attachmentNames).toEqual(['evidencia.jpg'])
    expect(saved.attachments).toBeUndefined()
    vi.restoreAllMocks()
  })

  it('chama onDraftSaved quando fornecido', async () => {
    const onDraftSaved = vi.fn()
    renderModal({ onDraftSaved })
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    expect(onDraftSaved).toHaveBeenCalledOnce()
  })

  it('chama onClose após salvar', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('NÃO chama onSuccess ao salvar rascunho', async () => {
    const { onSuccess } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: /salvar rascunho/i }))
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

// ── 6.2 — Confirmar Abertura ──────────────────────────────────────────────────

describe('WarrantyClaimModal 6.2 — Confirmar Abertura', () => {
  afterEach(() => localStorage.clear())

  async function fillValidForm(): Promise<void> {
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.type(screen.getByLabelText(/data do incidente/i), '2024-03-15')
    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))
    await userEvent.type(
      screen.getByLabelText(/descrição do ocorrido/i),
      'Peça chegou com dano visível na embalagem e no produto.',
    )
  }

  it('submeter sem nenhum campo exibe toast de erro dentro do modal', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('submeter sem SKU e sem data exibe mensagem sobre identificação', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/selecione o item/i)
  })

  it('submeter sem motivo exibe mensagem sobre motivo', async () => {
    renderModal()
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.type(screen.getByLabelText(/data do incidente/i), '2024-03-15')
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/motivo/i)
  })

  it('submeter com descrição < 20 chars exibe mensagem sobre descrição', async () => {
    renderModal()
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.type(screen.getByLabelText(/data do incidente/i), '2024-03-15')
    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))
    await userEvent.type(screen.getByLabelText(/descrição do ocorrido/i), 'Curta')
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/20 caracteres/i)
  })

  it('submeter sem motivo NÃO fecha o modal', async () => {
    const { onClose } = renderModal()
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('submeter sem motivo NÃO chama onSuccess', async () => {
    const { onSuccess } = renderModal()
    await userEvent.selectOptions(screen.getByLabelText(/seleção de sku/i), 'OG-TB-001')
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('corrigir campo após erro remove o toast de erro', async () => {
    renderModal()
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /avaria/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('formulário válido chama onSuccess com protocolo no formato GAR-XXXXX', async () => {
    const { onSuccess } = renderModal()
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(onSuccess).toHaveBeenCalledOnce()
    const [protocol] = (onSuccess as ReturnType<typeof vi.fn>).mock.calls[0] as [string]
    expect(protocol).toMatch(/^GAR-\d{5}$/)
  })

  it('formulário válido limpa o rascunho do localStorage', async () => {
    localStorage.setItem(CHAMADO_DRAFT_KEY, JSON.stringify({ status: 'draft' }))
    renderModal()
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(localStorage.getItem(CHAMADO_DRAFT_KEY)).toBeNull()
  })

  it('formulário válido NÃO chama onClose diretamente', async () => {
    const { onClose } = renderModal()
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('reabrir modal após confirmação válida reseta validationErrors', async () => {
    const { rerender } = render(
      <WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /confirmar abertura/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(<WarrantyClaimModal open={false} onClose={vi.fn()} onSuccess={vi.fn()} />)
    rerender(<WarrantyClaimModal open={true} onClose={vi.fn()} onSuccess={vi.fn()} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
