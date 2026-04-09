import { useEffect, useRef, useState, type ReactNode } from 'react'

import {
  CHAMADO_DRAFT_KEY,
  INITIAL_CLAIM_STATE,
  availableSkusMock,
  type Chamado,
  type ChamadoReason,
} from './warrantyClaimMocks'

// ── Ícones inline ─────────────────────────────────────────────────────────────

function XIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function TagIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 text-primary">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function ChevronDownIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ImageBrokenIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-7 w-7 text-secondary">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <path d="M9 21V9" />
      <path d="m3 15 4-4 4 4 4-4 4 4" />
    </svg>
  )
}

function AlertCircleIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden
      className={className ?? 'h-4 w-4 text-primary'}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function CartXIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-7 w-7 text-secondary">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="15" y1="10" x2="9" y2="16" />
      <line x1="9" y1="10" x2="15" y2="16" />
    </svg>
  )
}

function PaperclipIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-4 w-4 text-primary">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function UploadIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-6 w-6 text-primary">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function FileIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-10 w-10 shrink-0 text-on-surface-variant/50">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

// ── Constante pública ──────────────────────────────────────────────────────────

/** Chave do `localStorage` usada para persistir rascunhos do chamado. */
export const WARRANTY_CLAIM_DRAFT_KEY = 'warranty_claim_draft'

// ── Props ─────────────────────────────────────────────────────────────────────

export interface WarrantyClaimModalProps {
  open: boolean
  onClose: () => void
  /** Chamado após confirmação válida. Validação real de campos será adicionada na fase 2.x. */
  onSuccess: () => void
}

// ── Sub-componentes de layout ──────────────────────────────────────────────

/** Header de seção com ícone teal + label uppercase. Mesmo padrão de EntityFormModal. */
function SectionHeader({ icon, label }: { icon: ReactNode; label: string }): ReactNode {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
        {label}
      </span>
    </div>
  )
}

/** Label de campo uppercase muted acima de inputs/selects. */
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }): ReactNode {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60"
    >
      {children}
    </label>
  )
}

// ── Sub-componente: card de motivo ──────────────────────────────────────────

interface ReasonCardProps {
  value: ChamadoReason
  label: string
  icon: ReactNode
  isActive: boolean
  onClick: () => void
}

function ReasonCard({ label, icon, isActive, onClick }: ReasonCardProps): ReactNode {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex flex-col items-center gap-2.5 rounded-lg border px-4 py-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
        isActive
          ? 'border-[1.5px] border-primary bg-surface-container'
          : 'border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
      }`}
    >
      {icon}
      <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface">
        {label}
      </span>
    </button>
  )
}

// ── Sub-componente: preview de arquivo anexado ───────────────────────────

function FilePreviewItem({ file, onRemove }: { file: File; onRemove: () => void }): ReactNode {
  const isImage = file.type.startsWith('image/')
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  // Cria URL de objeto para thumbnails de imagem e revoga ao desmontar (evita memory leak)
  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file, isImage])

  const sizeLabel =
    file.size >= 1_048_576
      ? `${(file.size / 1_048_576).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`

  return (
    <div className="flex items-center gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low px-3 py-2">
      {isImage && objectUrl ? (
        <img src={objectUrl} alt="" aria-hidden className="h-10 w-10 shrink-0 rounded object-cover" />
      ) : (
        <FileIcon />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[12px] font-medium text-on-surface">{file.name}</span>
        <span className="text-[11px] text-on-surface-variant/60">{sizeLabel}</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${file.name}`}
        className="shrink-0 rounded p-1 text-on-surface-variant hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <XIcon />
      </button>
    </div>
  )
}

// ── Sub-componente: dropzone de upload ─────────────────────────────────────

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function Dropzone({ onFilesAdded }: { onFilesAdded: (files: File[]) => void }): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function processFiles(fileList: FileList | null): void {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList)
    const valid = files.filter((f) => f.size <= MAX_UPLOAD_BYTES)
    const hasOversized = files.some((f) => f.size > MAX_UPLOAD_BYTES)
    setUploadError(hasOversized ? 'Um ou mais arquivos excedem o tamanho máximo de 10 MB.' : null)
    if (valid.length > 0) onFilesAdded(valid)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de upload — clique para selecionar arquivos"
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); processFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
          dragActive
            ? 'border-primary/60 bg-primary/5'
            : 'border-outline-variant/25 bg-surface-container/20 hover:border-primary/40'
        }`}
      >
        {/* Input oculto — ativado programaticamente pelo div acima */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          tabIndex={-1}
          aria-hidden
          className="hidden"
          onChange={(e) => { processFiles(e.target.files); e.target.value = '' }}
        />
        <UploadIcon />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          Clique para anexar fotos ou arraste aqui
        </span>
        <span className="text-[11px] text-on-surface-variant/50">
          PNG, JPG ou PDF (Máx 10MB)
        </span>
      </div>
      {uploadError && (
        <p role="alert" className="text-[11px] text-tertiary">
          {uploadError}
        </p>
      )}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

interface ModalState {
  form: Chamado
  draftRestored: boolean
}

const INITIAL_MODAL_STATE: ModalState = { form: INITIAL_CLAIM_STATE, draftRestored: false }

const REASON_CARDS: Array<{ value: ChamadoReason; label: string; icon: ReactNode }> = [
  { value: 'avaria',      label: 'Avaria',        icon: <ImageBrokenIcon /> },
  { value: 'incompativel', label: 'Incompatível',  icon: <AlertCircleIcon className="h-7 w-7 text-secondary" /> },
  { value: 'erro_pedido', label: 'Erro de Pedido', icon: <CartXIcon /> },
]

export function WarrantyClaimModal({ open, onClose, onSuccess }: WarrantyClaimModalProps): ReactNode {
  const [{ form, draftRestored }, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE)

  // Fecha o modal ao pressionar Escape
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Restaura rascunho do localStorage ao abrir; reseta estado se não houver rascunho.
  // Padrão correto para sincronizar estado React com armazenamento externo (localStorage)
  // quando uma prop muda — lazy initializer não reexecuta ao reabrir o modal.
  useEffect(() => {
    if (!open) return
    try {
      const raw = localStorage.getItem(CHAMADO_DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Chamado>
        setModalState({
          draftRestored: true,
          form: {
            skuId: parsed.skuId ?? null,
            incidentDate: parsed.incidentDate ?? '',
            reason: parsed.reason ?? null,
            description: parsed.description ?? '',
            attachments: [], // File[] não é serializável — reiniciado como vazio
            status: parsed.status ?? 'draft',
          },
        })
        return
      }
    } catch {
      // JSON inválido no localStorage — seguir com reset
    }
    setModalState(INITIAL_MODAL_STATE)
  }, [open])

  if (!open) return null

  function setField<K extends keyof Chamado>(key: K, value: Chamado[K]): void {
    setModalState((prev) => ({ ...prev, form: { ...prev.form, [key]: value } }))
  }

  const today = new Date().toISOString().split('T')[0]

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) onClose()
  }

  function handleSaveDraft(): void {
    localStorage.setItem(
      CHAMADO_DRAFT_KEY,
      JSON.stringify({
        skuId: form.skuId,
        incidentDate: form.incidentDate,
        reason: form.reason,
        description: form.description,
        status: form.status,
        savedAt: new Date().toISOString(),
      }),
    )
    onClose()
  }

  function handleConfirm(): void {
    // Fase 2.x: validação dos campos (SKU, data do incidente, motivo) será adicionada aqui.
    onSuccess()
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
        aria-labelledby="wcm-title"
        className="flex max-h-[90dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-surface-container-low shadow-2xl"
      >
        {/* ── 1.1 Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between border-b border-outline-variant/20 px-8 py-6">
          <div className="flex flex-col gap-1">
            <h2 id="wcm-title" className="text-headline-sm font-bold text-on-surface">
              Abrir Novo Chamado
            </h2>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant/60">
              WARRANTY &amp; RETURN PROTOCOL
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <XIcon />
          </button>
        </div>

        {/* ── 2.2 Banner de rascunho restaurado ──────────────────────── */}
        {draftRestored && (
          <div
            role="status"
            aria-live="polite"
            className="mx-8 mt-4 rounded-lg bg-primary/10 px-4 py-2 text-[11px] font-semibold text-primary"
          >
            Rascunho restaurado
          </div>
        )}

        {/* ── Corpo ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">

          {/* ── 3.1 / 3.2 / 3.3 — Identificação do Item ────────────── */}
          <div className="flex flex-col gap-3">
            <SectionHeader icon={<TagIcon />} label="Identificação do Item" />

            <div className="grid grid-cols-2 gap-4">
              {/* 3.2 — Dropdown de SKU */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="wcm-sku">Seleção de SKU / Produto</FieldLabel>
                <div className="relative">
                  <select
                    id="wcm-sku"
                    value={form.skuId ?? ''}
                    onChange={(e) => setField('skuId', e.target.value || null)}
                    className="w-full appearance-none rounded-xl border border-outline-variant/30 bg-surface-container-highest py-2.5 pl-3 pr-9 text-body-sm text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="" disabled>
                      Selecione um item do pedido…
                    </option>
                    {availableSkusMock.map((s) => (
                      <option key={s.sku} value={s.sku}>
                        {s.sku} — {s.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-on-surface-variant">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              {/* 3.3 — Date picker de incidente */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="wcm-date">Data do Incidente</FieldLabel>
                <input
                  id="wcm-date"
                  type="date"
                  value={form.incidentDate}
                  max={today}
                  onChange={(e) => setField('incidentDate', e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-highest px-3 py-2.5 text-body-sm text-on-surface focus:border-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* ── 4.1 / 4.2 — Motivo da Solicitação ────────────────────── */}
          <div className="flex flex-col gap-3">
            <SectionHeader icon={<AlertCircleIcon />} label="Motivo da Solicitação" />

            <div className="grid grid-cols-3 gap-3">
              {REASON_CARDS.map((card) => (
                <ReasonCard
                  key={card.value}
                  value={card.value}
                  label={card.label}
                  icon={card.icon}
                  isActive={form.reason === card.value}
                  onClick={() => setField('reason', form.reason === card.value ? null : card.value)}
                />
              ))}
            </div>
          </div>

          {/* ── 5.1 / 5.2 / 5.3 — Evidências e Observações ──────────────── */}
          <div className="flex flex-col gap-4">
            <SectionHeader icon={<PaperclipIcon />} label="Evidências e Observações" />

            {/* 5.1 — Textarea de descrição */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="wcm-description">Descrição do Ocorrido</FieldLabel>
              <textarea
                id="wcm-description"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Descreva detalhadamente o ocorrido ou defeito apresentado…"
                maxLength={500}
                className="w-full resize-y rounded-xl border border-outline-variant/30 bg-surface-container-highest px-3 py-2.5 text-body-sm text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:outline-none"
                style={{ minHeight: '100px' }}
              />
              <span className="pointer-events-none self-end select-none text-[10px] text-on-surface-variant/50">
                {form.description.length}/500
              </span>
            </div>

            {/* 5.2 — Dropzone */}
            <Dropzone
              onFilesAdded={(files) =>
                setField('attachments', [...form.attachments, ...files])
              }
            />

            {/* 5.3 — Lista de preview */}
            {form.attachments.length > 0 && (
              <ul className="flex flex-col gap-2" aria-label="Arquivos anexados">
                {form.attachments.map((file, idx) => (
                  <li key={`${file.name}-${idx}`}>
                    <FilePreviewItem
                      file={file}
                      onRemove={() =>
                        setField(
                          'attachments',
                          form.attachments.filter((_, i) => i !== idx),
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── 1.2 Rodapé de ações ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-outline-variant/20 px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-label-sm font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-xl bg-surface-container-highest px-6 py-2.5 text-label-sm font-bold text-on-surface hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Salvar Rascunho
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-primary px-6 py-2.5 text-label-sm font-bold text-[#0D1117] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Confirmar Abertura
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
