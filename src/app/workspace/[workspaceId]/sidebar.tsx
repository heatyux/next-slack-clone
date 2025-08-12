import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { UserButton } from '@/features/auth/components/user-button'

import { SidebarButton } from './sidebar-button'
import { WorkspaceSwitcher } from './workspace-switcher'

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#381349] pt-[9px] pb-[4px]">
      <WorkspaceSwitcher />

      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes('/workspace')}
      />
      <SidebarButton icon={MessageSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  )
}
