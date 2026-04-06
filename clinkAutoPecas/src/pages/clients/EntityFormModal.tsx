import { useState, type ReactNode } from 'react'

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

// ── Sub-componente: Placeholder de seção ───────────────────────────────────────

function SectionSlot({ label }: { label: string }): ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/50">
        {label}
      </p>
      {/* Placeholder visual — substituído pelos campos reais nas fases seguintes */}
      <div
        aria-hidden
        className="min-h-[72px] rounded-lg border border-dashed border-outline-variant/20 bg-surface-container/40"
      />
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
 *
 * Estado interno:
 * - `vinculo`: `'cliente'` (padrão) | `'fornecedor'`
 * - `natureza`: `'fisica'` | `'juridica'` (padrão) — ao trocar, limpa `documento`
 * - `nome`: valor do campo de identificação
 * - `documento`: valor do campo CNPJ/CPF (limpo ao trocar natureza)
 */
export function EntityFormModal({ open, onClose }: EntityFormModalProps): ReactNode {
  const [vinculo, setVinculo] = useState<VinculoType>('cliente')
  const [natureza, setNatureza] = useState<NaturezaType>('juridica')
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')

  function handleNaturezaChange(value: string) {
    setNatureza(value as NaturezaType)
    setDocumento('')
  }

  if (!open) return null

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
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
                  onChange={(v) => setVinculo(v as VinculoType)}
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

            {/* Slot: Canais de Contato */}
            <SectionSlot label="Canais de Contato" />

            {/* Slot: Logradouro Principal */}
            <SectionSlot label="Logradouro Principal" />

            {/* Slot: Parâmetros Comerciais */}
            <SectionSlot label="Parâmetros Comerciais" />
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

            {/*
             * Desabilitado nesta fase — lógica de validação de campos
             * obrigatórios será implementada nas fases 7.4+.
             */}
            <button
              type="submit"
              disabled
              aria-disabled="true"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-on-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Salvar Cadastro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
