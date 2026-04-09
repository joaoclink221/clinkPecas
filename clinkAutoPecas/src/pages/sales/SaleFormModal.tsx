import { useState, type ReactNode } from 'react'

import type { Client, Product, Sale, SaleFormPaymentMethod, SaleItem } from './sales.types'
import { INITIAL_SALE_ITEMS, SELLER, clientsMock, computeSubtotal, computeTotal, productsMock } from './saleFormMocks'

// ── Ícones inline ─────────────────────────────────────────────────────────────

function CartIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden className="h-8 w-8 shrink-0">
      <circle cx="9" cy="21" r="1" stroke="#10B981" fill="#10B981" />
      <circle cx="20" cy="21" r="1" stroke="#10B981" fill="#10B981" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
        stroke="#10B981" />
    </svg>
  )
}

function XIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

function ChevronDownIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden
      className="h-4 w-4 shrink-0 text-on-surface-variant">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function BadgeIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <circle cx="8" cy="13" r="2" />
      <path d="M14 11h4M14 15h4" />
    </svg>
  )
}

function TrashIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function PlusIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-3.5 w-3.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SpinnerIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 shrink-0 animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// ── Estilos compartilhados de campo ──────────────────────────────────────────

const fieldLabelClass =
  'text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60'

// ── 3.1 — Dropdown de seleção de cliente ─────────────────────────────────────

interface ClientSelectFieldProps {
  value: Client | null
  onChange: (client: Client | null) => void
}

function ClientSelectField({ value, onChange }: ClientSelectFieldProps): ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="sale-client-select" className={fieldLabelClass}>
        Seleção de Cliente
      </label>
      <div className="relative rounded-lg border border-outline-variant/40 bg-surface-container [&:focus-within]:border-primary [&:focus-within]:ring-1 [&:focus-within]:ring-primary">
        <div className="pointer-events-none flex items-center justify-between px-4 py-3">
          <span className={`text-body-sm ${value ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>
            {value?.name ?? 'Selecione um cliente…'}
          </span>
          <ChevronDownIcon />
        </div>
        <select
          id="sale-client-select"
          aria-label="Seleção de cliente"
          value={value?.id ?? ''}
          onChange={(e) => {
            const found = clientsMock.find((c) => c.id === e.target.value) ?? null
            onChange(found)
          }}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
          <option value="">Selecione um cliente…</option>
          {clientsMock.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ── 3.2 — Campo readonly de vendedor responsável ──────────────────────────────

function VendorField(): ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <p className={fieldLabelClass}>Vendedor Responsável</p>
      <div className="relative flex items-center">
        <input
          type="text"
          readOnly
          value={SELLER}
          aria-label="Vendedor responsável"
          className="w-full cursor-default rounded-lg border border-outline-variant/30 bg-surface-container/60 px-4 py-3 pr-11 text-body-sm text-on-surface-variant focus:outline-none"
        />
        <span className="pointer-events-none absolute right-3 text-on-surface-variant/50" aria-hidden>
          <BadgeIcon />
        </span>
      </div>
    </div>
  )
}

// ── Utilitário de formatação ──────────────────────────────────────────────────

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// ── 4.4 — Dropdown de adição de produto ──────────────────────────────────────

interface AddProductDropdownProps {
  currentItems: SaleItem[]
  onSelect: (product: Product) => void
}

function AddProductDropdown({ currentItems, onSelect }: AddProductDropdownProps): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  function handleClose() {
    setIsOpen(false)
    setQuery('')
  }

  function handleSelect(product: Product) {
    onSelect(product)
    handleClose()
  }

  const normalizedQuery = query.trim().toLowerCase()
  const filteredProducts = productsMock.filter(
    (p) =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.sku.toLowerCase().includes(normalizedQuery),
  )

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Adicionar produto"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-bold text-on-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <PlusIcon />
        Adicionar Produto
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Produtos disponíveis"
          className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low shadow-xl"
        >
          {/* Campo de busca */}
          <div className="border-b border-outline-variant/20 px-3 py-2.5">
            <input
              type="text"
              autoFocus
              aria-label="Buscar produto"
              placeholder="Buscar por nome ou SKU…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
            />
          </div>

          {/* Lista de produtos filtrada */}
          <div className="max-h-64 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="px-4 py-6 text-center text-body-sm text-on-surface-variant/50">
                Nenhum produto encontrado para &ldquo;{query.trim()}&rdquo;
              </p>
            ) : (
              filteredProducts.map((product) => {
                const cartItem = currentItems.find((i) => i.product.sku === product.sku)
                return (
                  <button
                    key={product.sku}
                    type="button"
                    role="option"
                    aria-selected={Boolean(cartItem)}
                    onClick={() => handleSelect(product)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-container focus-visible:bg-surface-container focus-visible:outline-none"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="text-body-sm font-semibold text-on-surface">
                          {product.name}
                        </span>
                        {cartItem && (
                          <span className="rounded-sm bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            Na venda ×{cartItem.quantity}
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-on-surface-variant/60">
                        SKU: {product.sku}
                      </span>
                    </span>
                    <span className="ml-4 shrink-0 text-body-sm font-bold text-primary">
                      {brl.format(product.unitPrice)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── 4.1 — Tabela dinâmica de itens ────────────────────────────────────────────

interface ItemsTableProps {
  items: SaleItem[]
  onQtyChange: (index: number, qty: number) => void
  onRemove: (index: number) => void
  onAddProduct: (product: Product) => void
}

function ItemsTable({ items, onQtyChange, onRemove, onAddProduct }: ItemsTableProps): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className={fieldLabelClass}>Itens da Venda</p>
        <AddProductDropdown currentItems={items} onSelect={onAddProduct} />
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant/20">
        <table className="w-full table-fixed text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/60">
              <th className="w-[38%] px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                Produto / SKU
              </th>
              <th className="w-[14%] px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                Qtd.
              </th>
              <th className="w-[20%] px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                Preço Unit.
              </th>
              <th className="w-[20%] px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                Subtotal
              </th>
              <th className="w-[8%] px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-body-sm text-on-surface-variant/50">
                  Nenhum produto adicionado
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr
                  key={`${item.product.sku}-${idx}`}
                  className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container/30"
                >
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-on-surface">{item.product.name}</span>
                    <span className="block text-[11px] text-on-surface-variant/60">
                      SKU: {item.product.sku}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      aria-label={`Quantidade do produto ${item.product.name}`}
                      onChange={(e) => onQtyChange(idx, parseInt(e.target.value, 10) || 1)}
                      className="w-16 rounded-md border border-outline-variant/40 bg-surface-container px-2 py-1 text-center text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </td>
                  <td className="px-3 py-3 text-right text-on-surface-variant">
                    {brl.format(item.product.unitPrice)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-on-surface">
                    {brl.format(computeSubtotal(item))}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      aria-label={`Remover ${item.product.name}`}
                      onClick={() => onRemove(idx)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#FC7C78] hover:bg-[#FC7C78]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FC7C78]"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── 5.1 — Toggle de forma de pagamento ──────────────────────────────────────

const PAYMENT_OPTIONS: { value: SaleFormPaymentMethod; label: string }[] = [
  { value: 'pix',      label: 'PIX' },
  { value: 'cartao',   label: 'Cartão' },
  { value: 'boleto',   label: 'Boleto' },
  { value: 'faturado', label: 'Faturado' },
]

interface PaymentToggleProps {
  value: SaleFormPaymentMethod | null
  onChange: (method: SaleFormPaymentMethod) => void
}

function PaymentToggle({ value, onChange }: PaymentToggleProps): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <p className={fieldLabelClass}>Forma de Pagamento</p>
      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_OPTIONS.map(({ value: opt, label }) => (
          <button
            key={opt}
            type="button"
            aria-pressed={value === opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-4 py-2.5 text-label-sm font-bold uppercase tracking-widest transition-colors ${
              value === opt
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── 5.2/5.3 — Painel de resumo reativo ───────────────────────────────────────

interface SummaryPanelProps {
  items: SaleItem[]
  discountRate: number
}

function SummaryPanel({ items, discountRate }: SummaryPanelProps): ReactNode {
  const gross = items.reduce((acc, item) => acc + computeSubtotal(item), 0)
  const clampedRate = Math.min(Math.max(discountRate, 0), 1)
  const discountAmount = gross * clampedRate
  const net = gross - discountAmount

  return (
    <div className="flex flex-col gap-3">
      <p className={fieldLabelClass}>Resumo / Totais</p>
      <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container/40 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant/70">Subtotal</span>
          <span className="text-body-sm font-semibold text-on-surface">{brl.format(gross)}</span>
        </div>

        {/* 5.3 — Linha de desconto: visível apenas quando discountRate > 0 */}
        {clampedRate > 0 && (
          <div className="flex items-center justify-between">
            <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              Cupom Aplicado: -{Math.round(clampedRate * 100)}%
            </span>
            <span className="text-body-sm font-semibold text-[#FC7C78]">-{brl.format(discountAmount)}</span>
          </div>
        )}

        <div className="border-t border-outline-variant/20" />

        <div className="flex items-center justify-between">
          <span className="text-body-sm font-semibold text-on-surface">Valor Total Líquido</span>
          <span className="text-[2rem] font-bold leading-none text-primary">{brl.format(net)}</span>
        </div>
      </div>
    </div>
  )
}

// ── 6.1/6.2 — Toast de feedback inline ──────────────────────────────────────

type ToastData = { message: string; type: 'error' | 'success' }

function ToastNotification({ toast }: { toast: ToastData | null }): ReactNode {
  if (!toast) return null

  const isError = toast.type === 'error'
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-body-sm font-medium ${
        isError ? 'bg-[#FC7C78]/15 text-[#FC7C78]' : 'bg-primary/15 text-primary'
      }`}
    >
      {toast.message}
    </div>
  )
}

// ── Estado do formulário ────────────────────────────────────────────────────────

type SaleFormState = {
  selectedClient:  Client | null
  items:           SaleItem[]
  paymentMethod:   SaleFormPaymentMethod | null
  couponCode:      string
  /** Taxa de desconto 0–1, ex.: 0.10 = 10 % */
  discountRate:    number
}

const INITIAL_FORM_STATE: SaleFormState = {
  selectedClient: null,
  items:          INITIAL_SALE_ITEMS,
  paymentMethod:  'pix',
  couponCode:     '',
  discountRate:   0.10,
}

// ── Props ─────────────────────────────────────────────────────────────────────

export type SaleFormModalProps = {
  open: boolean
  onClose: () => void
  /** Callback disparado com o novo Sale após submit (implementado nas fases 2.x+). */
  onCreated: (sale: Sale) => void
}

// ── Componente principal ───────────────────────────────────────────────────────

export function SaleFormModal({ open, onClose }: SaleFormModalProps): ReactNode {
  const [form, setForm] = useState<SaleFormState>(INITIAL_FORM_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  if (!open) return null

  function showToast(data: ToastData) {
    setToast(data)
    setTimeout(() => setToast(null), 3000)
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isSubmitting) return
    if (e.target === e.currentTarget) onClose()
  }

  function handleQtyChange(index: number, qty: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, qty) } : item
      ),
    }))
  }

  function handleRemoveItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  function handleAddProduct(product: Product) {
    setForm((prev) => {
      const existingIdx = prev.items.findIndex((item) => item.product.sku === product.sku)
      if (existingIdx !== -1) {
        return {
          ...prev,
          items: prev.items.map((item, i) =>
            i === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      }
      return { ...prev, items: [...prev.items, { product, quantity: 1 }] }
    })
  }

  function handleSubmit() {
    if (!form.selectedClient) {
      showToast({ message: 'Selecione um cliente', type: 'error' })
      return
    }
    if (form.items.length === 0) {
      showToast({ message: 'Adicione ao menos um produto', type: 'error' })
      return
    }
    if (!form.paymentMethod) {
      showToast({ message: 'Selecione uma forma de pagamento', type: 'error' })
      return
    }

    const total = computeTotal(form.items, form.discountRate)
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setToast({ message: `Venda finalizada com sucesso — ${brl.format(total)}`, type: 'success' })
      setTimeout(() => {
        setForm(INITIAL_FORM_STATE)
        setToast(null)
        onClose()
      }, 1500)
    }, 800)
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-modal-title"
        className="flex max-h-[90dvh] w-full max-w-[1040px] flex-col overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl"
      >
        {/* ── 1.1 Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 px-8 py-6">
          <div className="flex items-center gap-4">
            <CartIcon />
            <div className="flex flex-col gap-0.5">
              <h2
                id="sale-modal-title"
                className="text-2xl font-bold leading-tight text-on-surface"
              >
                Nova Venda
              </h2>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/60">
                Geração de Orçamento &amp; Venda Direta
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40"
          >
            <XIcon />
          </button>
        </div>

        {/* ── Corpo ────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">

          {/* ── 6.1/6.2 Toast de feedback ──────────────────────────────── */}
          <ToastNotification toast={toast} />

          {/* ── 3.1/3.2 Cliente + Vendedor ────────────────────────────────── */}
          <div className="grid gap-6 sm:grid-cols-2">
            <ClientSelectField
              value={form.selectedClient}
              onChange={(client) => setForm((prev) => ({ ...prev, selectedClient: client }))}
            />
            <VendorField />
          </div>
          {/* ── 4.1-4.4 Tabela de Itens ──────────────────────────────────── */}
          <ItemsTable
            items={form.items}
            onQtyChange={handleQtyChange}
            onRemove={handleRemoveItem}
            onAddProduct={handleAddProduct}
          />
          {/* ── 5.1/5.2/5.3 Forma de Pagamento + Resumo ────────────────── */}
          <div className="grid gap-6 sm:grid-cols-2">
            <PaymentToggle
              value={form.paymentMethod}
              onChange={(method) => setForm((prev) => ({ ...prev, paymentMethod: method }))}
            />
            <SummaryPanel
              items={form.items}
              discountRate={form.discountRate}
            />
          </div>
        </div>

        {/* ── 1.2 Rodapé de ações ─────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-4 border-t border-outline-variant/20 px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-6 py-2.5 text-label-sm font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-label-sm font-bold text-on-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? <SpinnerIcon /> : <CheckCircleIcon />}
            {isSubmitting ? 'Finalizando…' : 'Finalizar Venda'}
          </button>
        </div>
      </div>
    </div>
  )
}
