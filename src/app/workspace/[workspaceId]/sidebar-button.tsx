import type { LucideIcon } from 'lucide-react'
import type { IconType } from 'react-icons/lib'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SidebarButtonProps = {
  icon: LucideIcon | IconType
  label: string
  isActive?: boolean
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div className="group flex cursor-pointer flex-col items-center justify-center gap-y-0.5">
      <Button
        variant="transparent"
        className={cn(
          'group-hover:bg-accent/20 size-9 p-2',
          isActive && 'bg-accent/20',
        )}
      >
        <Icon className="size-5 text-white transition-all group-hover:scale-110" />
      </Button>

      <span className="group-hover:text-accent text-[11px] text-white">
        {label}
      </span>
    </div>
  )
}
