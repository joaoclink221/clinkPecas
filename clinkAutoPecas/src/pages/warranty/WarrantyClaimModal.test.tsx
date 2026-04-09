import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

  it('"Confirmar Abertura" chama onSuccess', async () => {
    const { onSuccess } = renderModal()

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
