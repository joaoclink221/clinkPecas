import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

// ── Tipos ──────────────────────────────────────────────────────────────────────

type TicketType     = 'Garantia' | 'Devolução'
type TicketPriority = 'baixa' | 'média' | 'alta'

interface TicketFormState {
  type:        TicketType
  itemSku:     string
  reason:      string
  priority:    TicketPriority
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface OpenTicketModalProps {
  onClose: () => void
  onSuccess: () => void
}

// ── Sub-componentes de layout ──────────────────────────────────────────────────

function ModalBackdrop({ onClose }: { onClose: () => void }): ReactNode {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      aria-hidden
      onClick={onClose}
    />
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

const INITIAL_FORM: TicketFormState = {
  type:     'Garantia',
  itemSku:  '',
  reason:   '',
  priority: 'média',
}

export function OpenTicketModal({ onClose, onSuccess }: OpenTicketModalProps): ReactNode {
  const [form, setForm] = useState<TicketFormState>(INITIAL_FORM)
  const firstInputRef = useRef<HTMLSelectElement>(null)

  // Foco no primeiro campo quando o modal abre
  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  // Fechar com Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    onSuccess()
  }

  return (
    <>
      <ModalBackdrop onClose={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 id="modal-title" className="text-body-lg font-bold text-on-surface">
              Abrir Chamado
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-highest"
              aria-label="Fechar modal"
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
                <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Campo: Tipo */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ticket-type" className="text-label-sm font-semibold text-on-surface-variant">
                Tipo
              </label>
              <select
                id="ticket-type"
                ref={firstInputRef}
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as TicketType }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-highest px-3 py-2.5 text-body-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="Garantia">Garantia</option>
                <option value="Devolução">Devolução</option>
              </select>
            </div>

            {/* Campo: Item / SKU */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ticket-sku" className="text-label-sm font-semibold text-on-surface-variant">
                Item / SKU
              </label>
              <input
                id="ticket-sku"
                type="text"
                placeholder="Ex.: SKU-4821"
                value={form.itemSku}
                onChange={(e) => setForm((prev) => ({ ...prev, itemSku: e.target.value }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-highest px-3 py-2.5 text-body-sm text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Campo: Motivo */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ticket-reason" className="text-label-sm font-semibold text-on-surface-variant">
                Motivo
              </label>
              <textarea
                id="ticket-reason"
                rows={3}
                placeholder="Descreva o problema..."
                value={form.reason}
                onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                className="resize-none rounded-xl border border-outline-variant/30 bg-surface-container-highest px-3 py-2.5 text-body-sm text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Campo: Prioridade */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ticket-priority" className="text-label-sm font-semibold text-on-surface-variant">
                Prioridade
              </label>
              <select
                id="ticket-priority"
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TicketPriority }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-highest px-3 py-2.5 text-body-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Botões */}
            <div className="mt-1 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-outline-variant/30 px-4 py-2.5 text-label-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-label-sm font-bold text-[#0D1117] transition-colors hover:bg-primary/90"
              >
                Abrir Chamado
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
