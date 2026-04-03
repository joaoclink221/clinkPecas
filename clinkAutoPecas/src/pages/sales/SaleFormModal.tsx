import { useState, type FormEvent } from 'react'

import type { PaymentMethod, Sale } from './sales.types'

type LineItem = { sku: string; qty: number; unitPrice: number }

type FormState = {
  customerName: string
  customerDoc: string
  paymentMethod: PaymentMethod
  installments: number
  items: LineItem[]
  discount: number
  notes: string
}

type FormErrors = Partial<Record<keyof FormState | 'items_row', string>>

type SaleFormModalProps = {
  open: boolean
  onClose: () => void
  onCreated: (sale: Sale) => void
}

const PAYMENT_METHODS: PaymentMethod[] = ['Pix', 'Boleto', 'Cartão', 'Dinheiro']

const EMPTY_ITEM: LineItem = { sku: '', qty: 1, unitPrice: 0 }

const INITIAL_FORM: FormState = {
  customerName: '',
  customerDoc: '',
  paymentMethod: 'Pix',
  installments: 1,
  items: [{ ...EMPTY_ITEM }],
  discount: 0,
  notes: '',
}

function computeTotal(items: LineItem[], discount: number): number {
  const gross = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
  return Math.max(0, gross - discount)
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (form.customerName.trim().length < 3) {
    errors.customerName = 'Nome do cliente deve ter ao menos 3 caracteres.'
  }

  const validItems = form.items.filter(
    (i) => i.sku.trim() !== '' && i.qty > 0 && i.unitPrice > 0,
  )
  if (validItems.length === 0) {
    errors.items_row = 'Adicione ao menos um item com SKU, quantidade e valor válidos.'
  }

  const gross = form.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
  if (form.discount < 0 || form.discount > gross) {
    errors.discount = 'Desconto não pode ser negativo nem maior que o subtotal.'
  }

  return errors
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const labelClass = 'block text-label-sm font-medium text-on-surface-variant'
const inputClass =
  'mt-1 w-full rounded-lg border border-outline bg-surface-container px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
const errorClass = 'mt-1 text-label-sm text-on-error-container'

export function SaleFormModal({ open, onClose, onCreated }: SaleFormModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  function resetAndClose() {
    setForm(INITIAL_FORM)
    setErrors({})
    onClose()
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function setItemField(index: number, key: keyof LineItem, value: string | number) {
    setForm((prev) => {
      const updated = prev.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      )
      return { ...prev, items: updated }
    })
    if (errors.items_row) setErrors((prev) => ({ ...prev, items_row: undefined }))
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }))
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) resetAndClose()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const validItems = form.items.filter(
        (i) => i.sku.trim() !== '' && i.qty > 0 && i.unitPrice > 0,
      )
      const totalValue = computeTotal(validItems, form.discount)

      const newSale: Sale = {
        id: `VD-${Date.now()}`,
        customerName: form.customerName.trim(),
        customerDoc: form.customerDoc.trim(),
        date: new Date().toISOString().split('T')[0],
        paymentMethod: form.paymentMethod,
        installments: form.paymentMethod === 'Cartão' && form.installments > 1
          ? form.installments
          : undefined,
        discount: form.discount,
        totalValue,
        status: 'pending',
      }

      const apiBase = import.meta.env.VITE_API_BASE as string | undefined
      if (apiBase) {
        const res = await fetch(`${apiBase}/api/sales`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSale),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created = await res.json() as Sale
        onCreated(created)
      } else {
        onCreated(newSale)
      }

      setForm(INITIAL_FORM)
      setErrors({})
    } catch (err) {
      setErrors({
        customerName: err instanceof Error ? err.message : 'Erro ao criar venda. Tente novamente.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const subtotal = form.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
  const total = computeTotal(form.items, form.discount)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-surface-container-low shadow-2xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4">
          <h2 id="modal-title" className="text-title-md font-semibold text-on-surface">
            Nova Venda
          </h2>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={resetAndClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form
          id="sale-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 overflow-y-auto px-6 py-5"
        >
          {/* Cliente */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className={labelClass}>
                Cliente <span aria-hidden className="text-on-error-container">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                autoComplete="off"
                aria-autocomplete="list"
                aria-required="true"
                aria-invalid={!!errors.customerName}
                aria-describedby={errors.customerName ? 'err-customerName' : undefined}
                value={form.customerName}
                onChange={(e) => setField('customerName', e.target.value)}
                placeholder="Nome ou razão social"
                className={inputClass}
              />
              {errors.customerName && (
                <p id="err-customerName" className={errorClass} role="alert">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="customerDoc" className={labelClass}>CPF / CNPJ</label>
              <input
                id="customerDoc"
                type="text"
                autoComplete="off"
                value={form.customerDoc}
                onChange={(e) => setField('customerDoc', e.target.value)}
                placeholder="000.000.000-00"
                className={inputClass}
              />
            </div>
          </div>

          {/* Pagamento */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="paymentMethod" className={labelClass}>Método de pagamento</label>
              <select
                id="paymentMethod"
                value={form.paymentMethod}
                onChange={(e) => setField('paymentMethod', e.target.value as PaymentMethod)}
                className={inputClass}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {form.paymentMethod === 'Cartão' && (
              <div>
                <label htmlFor="installments" className={labelClass}>Parcelas</label>
                <input
                  id="installments"
                  type="number"
                  min="1"
                  max="24"
                  value={form.installments}
                  onChange={(e) => setField('installments', Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {/* Itens */}
          <fieldset>
            <legend className={`${labelClass} mb-2`}>
              Itens <span aria-hidden className="text-on-error-container">*</span>
            </legend>

            {errors.items_row && (
              <p className={errorClass} role="alert">{errors.items_row}</p>
            )}

            <div className="flex flex-col gap-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label htmlFor={`sku-${idx}`} className="sr-only">SKU do item {idx + 1}</label>
                    <input
                      id={`sku-${idx}`}
                      type="text"
                      placeholder="SKU"
                      value={item.sku}
                      onChange={(e) => setItemField(idx, 'sku', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="w-20">
                    <label htmlFor={`qty-${idx}`} className="sr-only">Qtd do item {idx + 1}</label>
                    <input
                      id={`qty-${idx}`}
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      value={item.qty}
                      onChange={(e) => setItemField(idx, 'qty', Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className={inputClass}
                    />
                  </div>
                  <div className="w-32">
                    <label htmlFor={`price-${idx}`} className="sr-only">Preço do item {idx + 1}</label>
                    <input
                      id={`price-${idx}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="R$ 0,00"
                      value={item.unitPrice}
                      onChange={(e) => setItemField(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </div>
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remover item ${idx + 1}`}
                      onClick={() => removeItem(idx)}
                      className="mb-[1px] inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-error-container"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-label-sm font-medium text-primary hover:underline"
            >
              + Adicionar item
            </button>
          </fieldset>

          {/* Desconto */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="discount" className={labelClass}>Desconto (R$)</label>
              <input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                aria-invalid={!!errors.discount}
                aria-describedby={errors.discount ? 'err-discount' : undefined}
                value={form.discount}
                onChange={(e) => setField('discount', parseFloat(e.target.value) || 0)}
                className={inputClass}
              />
              {errors.discount && (
                <p id="err-discount" className={errorClass} role="alert">{errors.discount}</p>
              )}
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-label-sm text-on-surface-variant">
                Subtotal: <span className="font-medium text-on-surface">{brl.format(subtotal)}</span>
              </p>
              <p aria-label={`Total: ${brl.format(total)}`} className="text-title-sm font-semibold text-on-surface">
                Total: {brl.format(total)}
              </p>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="notes" className={labelClass}>Observações</label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="Informações adicionais sobre a venda..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-outline-variant/20 px-6 py-4">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg px-4 py-2 text-label-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="sale-form"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Salvando…' : 'Criar Venda'}
          </button>
        </div>
      </div>
    </div>
  )
}
