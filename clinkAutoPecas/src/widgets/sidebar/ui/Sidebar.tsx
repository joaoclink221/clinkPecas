import { NavLink } from 'react-router-dom'

import { primaryNavItems } from '../model/nav-items'

function navLinkClass(isActive: boolean): string {
  return [
    'block rounded-lg px-3 py-2 text-body-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    isActive
      ? 'bg-surface-container-highest font-semibold text-primary'
      : 'text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-on-surface',
  ].join(' ')
}

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-surface-container-low py-6 md:w-72">
      <div className="px-4 pb-6">
        <p className="text-label-technical text-secondary">Obsidian Gear</p>
        <p className="mt-1 text-headline-sm font-semibold text-on-surface">Intelligence Portal</p>
      </div>
      <nav aria-label="Principal" className="flex-1 overflow-y-auto px-2">
        <ul className="flex flex-col gap-1">
          {primaryNavItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => navLinkClass(isActive)} end={item.to === '/'}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
