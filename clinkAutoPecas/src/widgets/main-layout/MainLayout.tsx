import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/widgets/sidebar'
import { Topbar } from '@/widgets/topbar'
import { EmployeeProfileModal } from '@/widgets/topbar/ui/EmployeeProfileModal'
import { UserProfileProvider, useUserProfile } from '@/widgets/topbar/model/UserProfileContext'

import { topbarDefaultUser } from './topbar-defaults'

// ── Inner component — consumes context para refletir o nome salvo (6.3) ───────

function MainLayoutInner() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { profile } = useUserProfile()

  return (
    <div className="relative flex min-h-dvh bg-surface text-on-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={profile.fullName}
          roleTitle={topbarDefaultUser.roleTitle}
          clearanceLabel={topbarDefaultUser.clearanceLabel}
          onAvatarClick={() => setIsProfileOpen(true)}
        />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {isProfileOpen && (
        <EmployeeProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  )
}

// ── Provider wrapper ──────────────────────────────────────────────────────────

export function MainLayout() {
  return (
    <UserProfileProvider>
      <MainLayoutInner />
    </UserProfileProvider>
  )
}
