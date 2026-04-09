import { useId, useState, type ReactNode } from 'react'

import { maskMoeda } from '@/shared/lib/masks'
import { MaskedTextField, TextField, ToggleGroup } from '@/shared/ui'

// ── Ícones inline ──────────────────────────────────────────────────────────────

function UserCircleIcon(): ReactNode {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="h-8 w-8 shrink-0">
      <circle cx="20" cy="20" r="19" stroke="#10B981" strokeWidth="1.5" />
      <circle cx="20" cy="15" r="6" fill="#10B981" />
      <path
        d="M7 34c0-7.18 5.82-13 13-13s13 5.82 13 13"
        fill="#10B981"
        opacity="0.35"
      />
    </svg>
  )
}

function MailIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4 shrink-0"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function PinIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4 shrink-0"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CloseIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-5 w-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SlidersIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4 shrink-0"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

// ── Tipos e constantes de domínio ────────────────────────────────────────────

/** Tipo de vínculo da entidade com a empresa. */
export type VinculoType = 'cliente' | 'fornecedor'

/** Natureza jurídica da entidade. */
export type NaturezaType = 'fisica' | 'juridica'

const VINCULO_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'fornecedor', label: 'Fornecedor' },
] as const

const NATUREZA_OPTIONS = [
  { value: 'fisica', label: 'Pessoa Física' },
  { value: 'juridica', label: 'Pessoa Jurídica' },
] as const

export type EntityFormModalProps = {
  /** Controla visibilidade do modal. */
  open: boolean
  /** Callback disparado ao fechar (botão X, Cancelar ou overlay). */
  onClose: () => void
}

// ── Sub-componente: Sidebar ────────────────────────────────────────────────────

function ModalSidebar(): ReactNode {
  return (
    <aside
      aria-label="Informações do formulário"
      className="relative flex w-[38%] shrink-0 flex-col overflow-hidden rounded-l-2xl bg-[#0E1218]"
    >
      {/* Textura de fundo — grade sutil em baixíssima opacidade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Conteúdo principal */}
      <div className="relative flex flex-1 flex-col px-8 pt-10">
        <UserCircleIcon />

        <h2
          id="entity-modal-title"
          className="mt-5 text-[26px] font-bold leading-tight text-white"
        >
          Registro de Entidade
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Mantenha a integridade da base de dados com informações precisas de parceiros.
        </p>
      </div>

      {/* Rodapé da sidebar */}
      <div className="relative px-8 pb-8">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
            Obsidian Intelligence
          </span>
        </div>
      </div>
    </aside>
  )
}

// ── Sub-componente: Cabeçalho de seção ─────────────────────────────────────────────

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

// ── Sub-componente: Campo com prefixo/sufixo não editável ───────────────────────

type DecoratedFieldProps = {
  label: string
  prefix?: string
  suffix?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function DecoratedField({ label, prefix, suffix, id, ...inputProps }: DecoratedFieldProps): ReactNode {
  const generatedId = useId()
  const inputId = id ?? `decorated-field-${generatedId}`
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-sm font-medium text-on-surface-variant" htmlFor={inputId}>
        {label}
      </label>
      <div className="flex items-center rounded-md bg-surface-container-highest">
        {prefix && (
          <span
            className="select-none pl-3 text-body-md font-semibold text-on-surface-variant"
            aria-hidden
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className="min-w-0 flex-1 border-0 border-b-2 border-transparent bg-transparent px-2 py-2.5 text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          {...inputProps}
        />
        {suffix && (
          <span
            className="select-none pr-3 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
            aria-hidden
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

/**
 * Modal de criação/edição de Entidade (Cliente ou Fornecedor).
 *
 * Fases implementadas:
 * - 7.1–7.3: esqueleto visual (overlay, sidebar, slots)
 * - 7.4 (2.1–2.2): toggles de Tipo de Vínculo e Natureza Jurídica
 * - 7.5 (3.1–3.2): campos Razão Social/Nome e CNPJ/CPF com label e máscara dinâmicos
 * - 7.6 (4.1–4.2): grupos fixos Canais de Contato e Logradouro Principal
 * - 7.7 (5.1–5.2): seção Parâmetros Comerciais condicional por vínculo
 * - 7.8 (5.3): validação de obrigatórios + botão Salvar habilitado + toast
 *
 * Estado interno:
 * - `vinculo`: `'cliente'` (padrão) | `'fornecedor'` — ao trocar, limpa parâmetros
 * - `natureza`: `'fisica'` | `'juridica'` (padrão) — ao trocar, limpa `documento`
 * - `nome`, `documento`, `email`, `telefone`: campos de identificação e contato
 * - `logradouro`, `numero`, `cep`, `cidade`, `uf`: campos de endereço
 * - `limiteCredito`, `prazoEntrega`: parâmetros do cliente (limpos ao trocar vínculo)
 * - `prazoPagamento`, `descontoPadrao`: parâmetros do fornecedor (limpos ao trocar vínculo)
 * - `toastVisible`: controla exibição do feedback de sucesso no submit
 */
export function EntityFormModal({ open, onClose }: EntityFormModalProps): ReactNode {
  const [vinculo, setVinculo] = useState<VinculoType>('cliente')
  const [natureza, setNatureza] = useState<NaturezaType>('juridica')
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [limiteCredito, setLimiteCredito] = useState('')
  const [prazoEntrega, setPrazoEntrega] = useState('')
  const [prazoPagamento, setPrazoPagamento] = useState('')
  const [descontoPadrao, setDescontoPadrao] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  function handleNaturezaChange(value: string) {
    setNatureza(value as NaturezaType)
    setDocumento('')
  }

  function handleVinculoChange(value: string) {
    setVinculo(value as VinculoType)
    setLimiteCredito('')
    setPrazoEntrega('')
    setPrazoPagamento('')
    setDescontoPadrao('')
  }

  const documentoFullLength = natureza === 'juridica' ? 18 : 14
  const isFormValid =
    nome.trim().length > 0 &&
    documento.length === documentoFullLength &&
    email.trim().length > 0 &&
    telefone.length >= 14

  if (!open) return null

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleSubmit() {
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
      onClose()
    }, 1500)
  }

  return (
    /* ── Overlay ────────────────────────────────────────────────── */
    <div
      role="presentation"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      {/* ── Botão X — fora do modal, canto sup. direito do overlay ── */}
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <CloseIcon />
      </button>

      {/* ── Container do modal ───────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-modal-title"
        className="flex w-full max-w-[1040px] overflow-hidden rounded-2xl shadow-2xl"
      >
        {/* ── Coluna esquerda: Sidebar ─────────────────────────── */}
        <ModalSidebar />

        {/* ── Coluna direita: Formulário ───────────────────────── */}
        <div className="flex flex-1 flex-col bg-surface-container-low">
          {/* aria-labelledby aponta para o h2 da sidebar */}

          {/* ── Área de conteúdo com scroll ──────────────────── */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-8 py-8">
            {/* ── Toggles de classificação (fases 2.1 e 2.2) ── */}
            <div className="grid grid-cols-2 gap-6">
              {/* 2.1 — Tipo de Vínculo */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Tipo de Vínculo
                </p>
                <ToggleGroup
                  label="Tipo de Vínculo"
                  options={VINCULO_OPTIONS}
                  value={vinculo}
                  onChange={handleVinculoChange}
                  size="sm"
                />
              </div>

              {/* 2.2 — Natureza Jurídica */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  Natureza Jurídica
                </p>
                <ToggleGroup
                  label="Natureza Jurídica"
                  options={NATUREZA_OPTIONS}
                  value={natureza}
                  onChange={handleNaturezaChange}
                  size="sm"
                />
              </div>
            </div>

            {/* ── Identificação (fases 3.1 e 3.2) ── */}
            <div className="grid grid-cols-[3fr_2fr] gap-4">
              {/* 3.1 — Razão Social / Nome Completo */}
              <TextField
                label={
                  natureza === 'juridica'
                    ? 'Razão Social / Nome Completo'
                    : 'Nome Completo'
                }
                placeholder={
                  natureza === 'juridica'
                    ? 'Ex: Logística Avançada S.A.'
                    : 'Ex: João da Silva'
                }
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              {/* 3.2 — CNPJ / CPF com máscara dinâmica */}
              <MaskedTextField
                label={natureza === 'juridica' ? 'CNPJ' : 'CPF'}
                mask={natureza === 'juridica' ? 'cnpj' : 'cpf'}
                placeholder={
                  natureza === 'juridica' ? '00.000.000/0000-00' : '000.000.000-00'
                }
                value={documento}
                onChange={setDocumento}
              />
            </div>

            {/* ── Canais de Contato (fase 4.1) ── */}
            <div className="flex flex-col gap-3">
              <SectionHeader icon={<MailIcon />} label="Canais de Contato" />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="E-mail"
                  type="email"
                  placeholder="email@exemplo.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MaskedTextField
                  label="Telefone"
                  mask="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={setTelefone}
                />
              </div>
            </div>

            {/* ── Logradouro Principal (fase 4.2) ── */}
            <div className="flex flex-col gap-3">
              <SectionHeader icon={<PinIcon />} label="Logradouro Principal" />

              {/* Linha 1: Rua (~70%) + Número (~28%) */}
              <div className="grid grid-cols-[7fr_3fr] gap-4">
                <TextField
                  label="Rua, Avenida ou Alameda"
                  placeholder="Ex: Av. Paulista"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                />
                <TextField
                  label="Número"
                  placeholder="100"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>

              {/* Linha 2: CEP + Cidade + UF */}
              <div className="grid grid-cols-[2fr_3fr_1fr] gap-4">
                <MaskedTextField
                  label="CEP"
                  mask="cep"
                  placeholder="00000-000"
                  value={cep}
                  onChange={setCep}
                />
                <TextField
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
                <TextField
                  label="UF"
                  placeholder="SP"
                  maxLength={2}
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            {/* ── Parâmetros Comerciais (fases 5.1 e 5.2) ── */}
            <div className="flex flex-col gap-3 rounded-xl border border-primary/20 p-4">
              <SectionHeader
                icon={<SlidersIcon />}
                label={
                  vinculo === 'cliente'
                    ? 'Parâmetros Comerciais (Cliente)'
                    : 'Parâmetros Comerciais (Fornecedor)'
                }
              />
              {vinculo === 'cliente' ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* 5.1 — Limite de Crédito Disponível */}
                  <DecoratedField
                    label="Limite de Crédito Disponível"
                    prefix="R$"
                    placeholder="0,00"
                    inputMode="numeric"
                    value={limiteCredito}
                    onChange={(e) => setLimiteCredito(maskMoeda(e.target.value))}
                  />
                  {/* 5.1 — Prazo de Entrega */}
                  <DecoratedField
                    label="Prazo de Entrega (Estimado em Dias)"
                    suffix="DIAS"
                    placeholder="0"
                    inputMode="numeric"
                    value={prazoEntrega}
                    onChange={(e) => setPrazoEntrega(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* 5.2 — Prazo de Pagamento */}
                  <DecoratedField
                    label="Prazo de Pagamento (Dias)"
                    suffix="DIAS"
                    placeholder="0"
                    inputMode="numeric"
                    value={prazoPagamento}
                    onChange={(e) => setPrazoPagamento(e.target.value.replace(/\D/g, ''))}
                  />
                  {/* 5.2 — Desconto Padrão */}
                  <DecoratedField
                    label="Desconto Padrão (%)"
                    suffix="%"
                    placeholder="0"
                    inputMode="numeric"
                    value={descontoPadrao}
                    onChange={(e) => setDescontoPadrao(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Rodapé de ações ──────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 px-8 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Salvar Cadastro
            </button>
          </div>
        </div>
      </div>

      {/* ── Toast de sucesso ── */}
      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-lg"
        >
          Entidade cadastrada com sucesso
        </div>
      )}
    </div>
  )
}
