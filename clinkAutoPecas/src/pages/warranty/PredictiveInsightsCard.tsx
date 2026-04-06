import { type ReactNode } from 'react'

// ── Thumbnail SVG de barras estático ──────────────────────────────────────────

function BarChartThumbnail(): ReactNode {
  const bars = [
    { x: 6,  height: 28, y: 36 },
    { x: 18, height: 42, y: 22 },
    { x: 30, height: 20, y: 44 },
    { x: 42, height: 50, y: 14 },
    { x: 54, height: 35, y: 29 },
    { x: 66, height: 55, y: 9  },
    { x: 78, height: 44, y: 20 },
  ]

  return (
    <svg
      viewBox="0 0 90 70"
      fill="none"
      aria-hidden
      className="h-full w-full"
      role="img"
    >
      {/* Linhas de grade horizontais */}
      {[14, 28, 42, 56].map((cy) => (
        <line
          key={cy}
          x1="0" y1={cy} x2="90" y2={cy}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Barras com gradiente teal→roxo */}
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width="8"
          height={bar.height}
          rx="2"
          fill="rgba(16,185,129,0.55)"
        />
      ))}

      {/* Linha de tendência em coral */}
      <polyline
        points="10,40 22,26 34,46 46,18 58,32 70,12 82,24"
        stroke="#FC7C78"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

export function PredictiveInsightsCard(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      {/* Conteúdo: texto + thumbnail lado a lado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Texto */}
        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-body-lg font-bold leading-snug text-on-surface">
            Inteligência Preditiva de Falhas
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Baseado nos últimos 30 dias, identificamos um aumento de 15% em falhas de
            compressores da série "T". Recomendamos revisão técnica do lote.
          </p>
        </div>

        {/* Thumbnail do gráfico */}
        <div
          className="h-20 w-full overflow-hidden rounded-lg sm:h-24 sm:w-36 sm:shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          aria-label="Miniatura do gráfico analítico"
        >
          <BarChartThumbnail />
        </div>
      </div>

      {/* Botão outline */}
      <button
        type="button"
        className="self-start rounded-xl border border-primary px-5 py-2.5 text-label-sm font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/10"
        aria-label="Ver relatório analítico de falhas preditivas"
      >
        VER RELATÓRIO ANALÍTICO
      </button>
    </div>
  )
}
