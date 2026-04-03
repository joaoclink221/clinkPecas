import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/widgets/sidebar'
import { Topbar } from '@/widgets/topbar'

import { topbarDefaultUser } from './topbar-defaults'

export function MainLayout() {
  return (
    <div className="flex min-h-dvh bg-surface text-on-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar {...topbarDefaultUser} />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
