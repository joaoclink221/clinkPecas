import { type ReactNode } from 'react'

// ── Ícone de documento ─────────────────────────────────────────────────────────

function DocumentIcon(): ReactNode {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="h-10 w-10 text-primary">
      <path
        d="M10 6h14l8 8v22a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <polyline
        points="24 6 24 14 32 14"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <line x1="14" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="27" x2="24" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

export function PolicyGuideCard(): ReactNode {
  function handleDownload(): void {
    window.open('about:blank', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <DocumentIcon />

      <div className="flex flex-col gap-1">
        <h2 className="text-body-lg font-bold text-on-surface">Guia de Políticas</h2>
        <p className="text-body-sm text-on-surface-variant">
          Consulte as diretrizes de garantia Obsidian Gear atualizadas (V2.4).
        </p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="rounded-xl bg-primary px-5 py-2.5 text-label-sm font-bold uppercase tracking-widest text-[#0D1117] transition-colors hover:bg-primary/90"
        aria-label="Baixar PDF do guia de políticas de garantia"
      >
        DOWNLOAD PDF
      </button>
    </div>
  )
}
