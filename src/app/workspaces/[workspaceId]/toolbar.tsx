'use client'

import { Info, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWrokspaceId } from '@/features/workspaces/hooks/use-get-workspace-id'

export const Toolbar = () => {
  const workspaceId = useGetWrokspaceId()
  const { data } = useGetWorkspace({ id: workspaceId })

  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" aria-hidden />

      <div className="max-w-[642px] min-w-[280px] shrink grow-[2]">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 h-7 w-full justify-start px-2"
        >
          <Search className="mr-2 size-4" />
          <span className="text-xs">Search {data?.name ?? 'Workspace'}...</span>
        </Button>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5" />
        </Button>
      </div>
    </nav>
  )
}
