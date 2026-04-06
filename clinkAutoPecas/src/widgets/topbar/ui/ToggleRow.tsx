import { type ReactNode } from 'react'

// ── Props ──────────────────────────────────────────────────────────────────────

export interface ToggleRowProps {
  /** Ícone SVG exibido à esquerda do label. */
  icon: ReactNode
  /** Texto principal do toggle. */
  label: string
  /** Texto auxiliar em muted abaixo do label. */
  sublabel: string
  /** Estado atual do toggle. */
  checked: boolean
  /** Callback disparado ao clicar — responsabilidade do pai de atualizar `checked`. */
  onChange: () => void
}

// ── Componente ────────────────────────────────────────────────────────────────

export function ToggleRow({ icon, label, sublabel, checked, onChange }: ToggleRowProps): ReactNode {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-4"
      style={{ backgroundColor: '#1E2228' }}
    >
      {/* Ícone + textos */}
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest">
          {icon}
        </span>
        <div className="flex flex-col">
          <span className="text-body-sm font-bold text-on-surface">{label}</span>
          <span className="mt-0.5 text-[12px] leading-tight text-on-surface-variant">{sublabel}</span>
        </div>
      </div>

      {/* 5.1 Track + Thumb — button role="switch" para acessibilidade */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className="relative shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? '#4EDEA3' : '#31353C',
          transition: 'background-color 200ms ease',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '23px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            transition: 'left 200ms ease',
          }}
        />
      </button>
    </div>
  )
}
