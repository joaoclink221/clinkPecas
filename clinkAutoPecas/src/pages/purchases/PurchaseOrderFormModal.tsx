import { useEffect, useState, type ReactNode } from 'react'

import {
  INITIAL_PURCHASE_ORDER_FORM,
  PURCHASE_ORDER_DRAFT_KEY,
  employeesMock,
  suppliersMock,
  type PurchaseOrderForm,
} from './purchaseOrderFormMocks'

// ── Ícones inline ──────────────────────────────────────────────────────────────

function XIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CornerUpLeftIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 shrink-0">
      <polyline points="9 14 4 9 9 4" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </svg>
  )
}

function ChevronDownIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 shrink-0">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CheckCircleIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface PurchaseOrderFormModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

// ── Componente principal ───────────────────────────────────────────────────────

export function PurchaseOrderFormModal({
  open,
  onClose,
  onCreated,
}: PurchaseOrderFormModalProps): ReactNode {
  const [form, setForm] = useState<PurchaseOrderForm>(INITIAL_PURCHASE_ORDER_FORM)
  const [showDraftBanner, setShowDraftBanner] = useState(false)

  // Fecha ao pressionar Escape
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Ao abrir: tenta restaurar rascunho do localStorage; ao fechar: reseta
  useEffect(() => {
    if (!open) {
      setForm(INITIAL_PURCHASE_ORDER_FORM)
      setShowDraftBanner(false)
      return
    }
    setShowDraftBanner(false)
    try {
      const raw = localStorage.getItem(PURCHASE_ORDER_DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PurchaseOrderForm
        setForm(parsed)
        setShowDraftBanner(true)
      } else {
        setForm(INITIAL_PURCHASE_ORDER_FORM)
      }
    } catch {
      setForm(INITIAL_PURCHASE_ORDER_FORM)
    }
  }, [open])

  if (!open) return null

  /**
   * "GENERATE ORDER" permanece desabilitado até que todos os pré-requisitos
   * sejam atendidos: supplier selecionado, agent selecionado, issue date
   * preenchida e ao menos 1 item na tabela.
   */
  const isGenerateDisabled =
    form.supplier === null ||
    form.agent === null ||
    form.issueDate === '' ||
    form.items.length === 0

  /**
   * Expected Delivery é inválida quando preenchida mas não é posterior à Issue Date.
   * Comparação lexicográfica de strings ISO "YYYY-MM-DD" é equivalente a comparação
   * cronológica, eliminando a necessidade de construir objetos Date.
   */
  const isDeliveryDateInvalid =
    form.expectedDelivery !== '' &&
    form.issueDate !== '' &&
    form.expectedDelivery <= form.issueDate

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pof-title"
        className="flex w-full max-w-[1040px] flex-col rounded-2xl border border-outline-variant/20 bg-surface-container-low shadow-2xl"
        style={{ maxHeight: 'calc(100dvh - 2rem)' }}
      >

        {/* ── 1.1 Header ───────────────────────────────────────────────────── */}
        <header className="flex shrink-0 items-center justify-between border-b border-outline-variant/15 px-8 py-5">
          <div className="flex flex-col gap-0.5">
            <h2
              id="pof-title"
              className="text-body-lg font-bold text-on-surface"
            >
              New Purchase Order
            </h2>
            <p className="text-[12px] italic text-primary">
              Initiate part procurement and logistical scheduling
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
          >
            <XIcon />
          </button>
        </header>

        {/* ── Corpo — seções 2.x–5.x ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* ── 2.2 Banner de rascunho restaurado ──────────────────────────── */}
          {showDraftBanner && (
            <div
              role="status"
              aria-live="polite"
              className="mb-5 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-body-sm text-primary"
            >
              Draft restored
            </div>
          )}

          {/* ── 3.1 + 3.2 — Grid 2×2 de cabeçalho ──────────────────────────── */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">

            {/* ── 3.1a SUPPLIER ENTITY ───────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pof-supplier"
                className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60"
              >
                Supplier Entity
              </label>
              <div className="relative">
                <select
                  id="pof-supplier"
                  aria-label="Supplier Entity"
                  value={form.supplier ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      supplier: e.target.value || null,
                    }))
                  }
                  className="w-full appearance-none rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 pr-10 text-body-sm text-on-surface transition-colors focus:border-primary/60 focus:outline-none"
                >
                  <option value="">Select Supplier...</option>
                  {suppliersMock.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* ── 3.1b PURCHASING AGENT ──────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pof-agent"
                className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60"
              >
                Purchasing Agent
              </label>
              <div className="relative">
                <select
                  id="pof-agent"
                  aria-label="Purchasing Agent"
                  value={form.agent ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      agent: e.target.value || null,
                    }))
                  }
                  className="w-full appearance-none rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 pr-10 text-body-sm text-on-surface transition-colors focus:border-primary/60 focus:outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employeesMock.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* ── 3.2a ISSUE DATE ────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pof-issue-date"
                className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60"
              >
                Issue Date
              </label>
              <input
                id="pof-issue-date"
                type="date"
                aria-label="Issue Date"
                value={form.issueDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, issueDate: e.target.value }))
                }
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-body-sm text-on-surface transition-colors focus:border-primary/60 focus:outline-none"
              />
            </div>

            {/* ── 3.2b EXPECTED DELIVERY ─────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="pof-delivery-date"
                className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60"
              >
                Expected Delivery
              </label>
              <input
                id="pof-delivery-date"
                type="date"
                aria-label="Expected Delivery"
                value={form.expectedDelivery}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, expectedDelivery: e.target.value }))
                }
                className={[
                  'w-full rounded-xl border bg-surface-container px-4 py-3 text-body-sm text-on-surface transition-colors focus:outline-none',
                  isDeliveryDateInvalid
                    ? 'border-tertiary ring-[1.5px] ring-tertiary'
                    : 'border-outline-variant/20 focus:border-primary/60',
                ].join(' ')}
                aria-invalid={isDeliveryDateInvalid}
              />
              {isDeliveryDateInvalid && (
                <p role="alert" className="text-[11px] text-tertiary">
                  Expected delivery must be after issue date.
                </p>
              )}
            </div>

          </div>

          {/* Seções 4.x–5.x serão implementadas nas próximas fases */}
        </div>

        {/* ── 1.2 Rodapé de ações ───────────────────────────────────────────── */}
        <footer className="grid shrink-0 grid-cols-3 items-center border-t border-outline-variant/15 px-8 py-4">

          {/* CANCEL ORDER — ghost com ícone, alinhado à esquerda */}
          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl border border-outline-variant/40 px-4 py-2.5 text-label-sm font-semibold text-on-surface-variant transition-colors hover:border-tertiary/60 hover:text-tertiary"
            >
              <CornerUpLeftIcon />
              CANCEL ORDER
            </button>
          </div>

          {/* SAVE DRAFT — secundário escuro, centralizado */}
          <div className="flex justify-center">
            <button
              type="button"
              className="rounded-xl bg-surface-container-highest px-5 py-2.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest/70"
            >
              SAVE DRAFT
            </button>
          </div>

          {/* GENERATE ORDER — primário verde com ícone, alinhado à direita */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isGenerateDisabled}
              onClick={() => { if (!isGenerateDisabled) onCreated() }}
              aria-disabled={isGenerateDisabled}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-label-sm font-bold text-[#0D1117] transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircleIcon />
              GENERATE ORDER
            </button>
          </div>

        </footer>
      </div>
    </div>
  )
}
