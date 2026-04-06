import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'

import { DEPARTMENTS, type UserProfile } from '../model/employee-profile.types'
import { useUserProfile } from '../model/UserProfileContext'
import { ToggleRow } from './ToggleRow'

// ── Props ──────────────────────────────────────────────────────────────────────

export interface EmployeeProfileModalProps {
  onClose: () => void
  /** Perfil inicial do formulário. Usa mock quando não fornecido. */
  initialProfile?: UserProfile
}

// ── Ícones ────────────────────────────────────────────────────────────────────

function CloseIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="h-4 w-4"
    >
      <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function PersonIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-10 w-10 text-on-surface-variant"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function UploadIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="h-3.5 w-3.5"
    >
      <path d="M8 10V3M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// 4.2 Chevron para substituir a seta nativa do <select>
function ChevronIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="h-4 w-4 text-on-surface-variant"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Estilos compartilhados de campo ──────────────────────────────────────────

// 4.1 Estilo base dos campos: fundo #31353C, sem borda em repouso, borda teal no focus
const FIELD_CLASS =
  'w-full rounded-lg border border-transparent bg-[#31353C] px-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant transition-colors focus:border-primary focus:outline-none'

const LABEL_CLASS = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-primary'

// ── Componente principal ───────────────────────────────────────────────────────

export function EmployeeProfileModal({
  onClose,
  initialProfile,
}: EmployeeProfileModalProps): ReactNode {
  const { profile, saveProfile } = useUserProfile()

  // 6.2 Usa prop quando fornecida (testes unitários), senao usa perfil do context (localStorage ou mock)
  const effectiveInitialProfile = initialProfile ?? profile

  // 2.3 Estado do rascunho — cópia independente do perfil inicial
  const [draft, setDraft] = useState<UserProfile>(() => ({ ...effectiveInitialProfile, preferences: { ...effectiveInitialProfile.preferences } }))

  // 6.2 Toast de confirmacao — visivel por 3s após salvar
  const [toastVisible, setToastVisible] = useState(false)

  // 2.3 Dirty check — habilita Save Changes apenas quando há alteração real
  const isDirty = JSON.stringify(draft) !== JSON.stringify(effectiveInitialProfile)

  // 6.2 Fecha o modal automaticamente após o toast expirar
  useEffect(() => {
    if (!toastVisible) return
    const timer = setTimeout(() => {
      setToastVisible(false)
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [toastVisible, onClose])

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange<K extends keyof UserProfile>(key: K, value: UserProfile[K]): void {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  // 6.1 Cancel — reseta o rascunho ao estado inicial e fecha
  function handleCancel(): void {
    setDraft({ ...effectiveInitialProfile, preferences: { ...effectiveInitialProfile.preferences } })
    onClose()
  }

  // 6.2 Save — persiste no localStorage via context, exibe toast, fecha após 3s
  function handleSave(): void {
    saveProfile(draft)
    setToastVisible(true)
  }

  // 3.2 FileReader — gera preview local sem envio ao servidor
  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result
      if (typeof dataUrl === 'string') {
        handleChange('avatarUrl', dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      {/* 1.1 Overlay — position: absolute dentro do container relativo do layout */}
      <div
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />

      {/* 1.1 Container do modal — centralizado sobre o overlay */}
      <div
        className="absolute inset-0 z-50 flex items-center justify-center p-4"
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          className="relative w-full max-w-[640px] rounded-xl p-8 shadow-2xl"
          style={{ backgroundColor: '#181C22' }}
        >
          {/* 1.1 Botão X fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
            aria-label="Fechar perfil"
          >
            <CloseIcon />
          </button>

          {/* 1.3 Título */}
          <h2
            id="profile-modal-title"
            className="mb-6 text-on-surface"
            style={{ fontSize: '20px', fontWeight: 500 }}
          >
            Perfil do Funcionário
          </h2>

          {/* 2.3 Seção de dados pessoais */}
          <section aria-label="Dados pessoais">

            {/* 3.1 + 3.2 Avatar */}
            <div className="mb-6 flex items-center gap-5">

              {/* 3.1 Exibição do avatar atual */}
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container-highest"
                aria-label="Avatar do funcionário"
              >
                {draft.avatarUrl !== null ? (
                  <img
                    src={draft.avatarUrl}
                    alt="Avatar do funcionário"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PersonIcon />
                )}
              </div>

              {/* 3.2 Botão de upload + input oculto + texto auxiliar */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-label-sm font-bold text-[#0D1117] transition-colors hover:bg-primary/90"
                  aria-label="Fazer upload de nova foto de perfil"
                >
                  <UploadIcon />
                  Upload New
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-hidden
                  tabIndex={-1}
                  onChange={handleAvatarChange}
                />
                <p className="text-[11px] text-on-surface-variant">
                  Recommended: Square JPG or PNG, 400×400px.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label htmlFor="profile-full-name" className={LABEL_CLASS}>
                  Full Name
                </label>
                <input
                  id="profile-full-name"
                  type="text"
                  value={draft.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                  className={FIELD_CLASS}
                  autoComplete="off"
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="profile-email" className={LABEL_CLASS}>
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={draft.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={FIELD_CLASS}
                  autoComplete="off"
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="profile-department" className={LABEL_CLASS}>
                  Department
                </label>
                {/* 4.2 Wrapper relativo para posicionar o chevron sobre o select nativo oculto */}
                <div className="relative">
                  <select
                    id="profile-department"
                    value={draft.department}
                    onChange={e => handleChange('department', e.target.value as UserProfile['department'])}
                    className={`${FIELD_CLASS} appearance-none pr-10`}
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronIcon />
                  </span>
                </div>
              </div>

              {/* Role — somente leitura */}
              <div>
                <label htmlFor="profile-role" className={LABEL_CLASS}>
                  Role
                </label>
                {/* 4.3 cursor-default + select-none + bg levemente mais escuro sinalizam readonly visualmente */}
                <input
                  id="profile-role"
                  type="text"
                  value={draft.role}
                  readOnly
                  className={`${FIELD_CLASS} cursor-default select-none`}
                  style={{ backgroundColor: '#22262D' }}
                  aria-readonly="true"
                />
              </div>

            </div>
          </section>

          {/* 1.3 Divisor visual entre seções */}
          <hr
            className="my-6 border-white/10"
            aria-hidden
          />

          {/* 5.1–5.3 Seção de preferências */}
          <section aria-label="Preferências do Sistema">
            <h3
              className="mb-4 text-on-surface"
              style={{ fontSize: '18px', fontWeight: 500 }}
            >
              Preferências do Sistema
            </h3>

            <div className="flex flex-col gap-3">

              {/* 5.2 High Contrast Mode */}
              <ToggleRow
                icon={
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant" />
                    <path d="M10 1a9 9 0 0 1 0 18V1z" fill="currentColor" className="text-on-surface-variant" />
                  </svg>
                }
                label="High Contrast Mode"
                sublabel="Enhance visibility for critical technical data."
                checked={draft.preferences.highContrast}
                onChange={() =>
                  handleChange('preferences', {
                    ...draft.preferences,
                    highContrast: !draft.preferences.highContrast,
                  })
                }
              />

              {/* 5.3 Push Notifications */}
              <ToggleRow
                icon={
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5 text-secondary">
                    <path
                      d="M10 2a6 6 0 0 0-6 6c0 3.5-2 4.5-2 4.5h16s-2-1-2-4.5a6 6 0 0 0-6-6z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path d="M11.73 17a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
                label="Push Notifications"
                sublabel="Receive real-time alerts for critical stock changes."
                checked={draft.preferences.pushNotifications}
                onChange={() =>
                  handleChange('preferences', {
                    ...draft.preferences,
                    pushNotifications: !draft.preferences.pushNotifications,
                  })
                }
              />

            </div>
          </section>

          {/* 6.2 Toast de confirmacao */}
          {toastVisible && (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 flex items-center gap-2 rounded-lg px-4 py-3 text-body-sm font-medium"
              style={{ backgroundColor: '#1A3A2A', color: '#4EDEA3', border: '1px solid #4EDEA3' }}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4 shrink-0">
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Perfil atualizado com sucesso
            </div>
          )}

          {/* 6.1 Rodapé — Cancel reseta draft; Save persiste via context */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-5 py-2.5 text-label-sm font-semibold text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className="rounded-xl bg-primary px-5 py-2.5 text-label-sm font-bold text-[#0D1117] transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Salvar alterações do perfil"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
