import { UserButton } from '@/features/auth/components/user-button'

import { WorkspaceSwitcher } from './workspace-switcher'

export const Sidebar = () => {
  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#381349] pt-[9px] pb-[4px]">
      <WorkspaceSwitcher />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  )
}
