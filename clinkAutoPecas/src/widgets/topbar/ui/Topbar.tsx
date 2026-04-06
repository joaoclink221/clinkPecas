export type TopbarProps = {
  /** Nome exibido do usuário (funcionário). */
  userName: string
  /** Cargo (ex.: Manager). */
  roleTitle: string
  /** Selo de autorização (ex.: Authorized). */
  clearanceLabel: string
  /** Callback disparado ao clicar no avatar — abre o modal de perfil. */
  onAvatarClick?: () => void
}

export function Topbar({ userName, roleTitle, clearanceLabel, onAvatarClick }: TopbarProps) {
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-4 border-b border-outline-variant/15 bg-surface px-4 md:px-6"
      role="banner"
    >
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor="global-search">
          Buscar no portal
        </label>
        <input
          id="global-search"
          type="search"
          name="q"
          placeholder="Buscar inventário, SKU ou VIN…"
          autoComplete="off"
          className="w-full max-w-xl rounded-lg border-0 bg-surface-container-highest px-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-primary"
        />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Notificações"
        >
          <BellIcon />
        </button>
        <button
          type="button"
          onClick={onAvatarClick}
          className="flex min-w-0 items-center gap-3 rounded-lg bg-surface-container-low py-1.5 pl-2 pr-3 transition-colors hover:bg-surface-container-highest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Abrir perfil do funcionário"
          aria-haspopup="dialog"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container-highest text-label-sm font-bold text-primary"
            aria-hidden
          >
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex flex-col leading-tight">
            <span className="truncate text-body-sm font-medium text-on-surface">{userName}</span>
            <span className="truncate text-label-sm text-on-surface-variant">
              {roleTitle} · {clearanceLabel}
            </span>
          </div>
        </button>
      </div>
    </header>
  )
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
