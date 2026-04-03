import { useEffect, useState } from 'react'

function formatElapsed(minutes: number): string {
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1m ago'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return hours === 1 ? '1h ago' : `${hours}h ago`
}

export function LiveFeedBadge() {
  const [minutesElapsed, setMinutesElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMinutesElapsed((prev) => prev + 1)
    }, 60_000)

    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex shrink-0 items-center gap-2 self-start rounded-lg bg-surface-container-low px-3 py-1.5"
      role="status"
      aria-live="polite"
      aria-label={`Live Feed — Updated ${formatElapsed(minutesElapsed)}`}
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
      <span className="text-label-sm font-semibold text-primary">LIVE FEED</span>
      <span className="text-label-sm text-on-surface-variant" aria-hidden>
        Updated {formatElapsed(minutesElapsed)}
      </span>
    </div>
  )
}
