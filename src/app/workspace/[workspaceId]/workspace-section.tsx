import type { PropsWithChildren } from 'react'

import { PlusIcon } from 'lucide-react'
import { FaCaretDown } from 'react-icons/fa'
import { useToggle } from 'react-use'

import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WorkspaceSectionProps {
  label: string
  hint: string
  onNew?: () => void
}

export const WorkspaceSection = ({
  label,
  hint,
  onNew,
  children,
}: PropsWithChildren<WorkspaceSectionProps>) => {
  const [on, toggle] = useToggle(true)

  return (
    <div className="mt-3 flex flex-col px-2">
      <div className="group flex items-center px-3.5">
        <Button
          variant="transparent"
          className="size-6 shrink-0 p-0.5 text-sm text-[#F9EDFC]"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn('size-4 transition-transform', !on && '-rotate-90')}
          />
        </Button>

        <Button
          variant="transparent"
          size="sm"
          className="group h-[28px] items-center justify-start overflow-hidden px-1.5 text-sm text-[#F9EDFC]"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="ml-auto size-6 shrink-0 p-0.5 text-sm text-[#F9EDFC] opacity-0 transition-opacity group-hover:opacity-100"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>

      {on && children}
    </div>
  )
}
