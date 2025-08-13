'use client'

import {
  AlertTriangle,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from 'lucide-react'

import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWrokspaceId } from '@/features/workspaces/hooks/use-get-workspace-id'

import { SidebarItem } from './sidebar-item'
import { WorkspaceHeader } from './worksapce-header'

export const WorkspaceSidebar = () => {
  const workspaceId = useGetWrokspaceId()
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-sm text-white">Workspace not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-y-2 bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />

      <div className="mt-3 flex flex-col px-2">
        <SidebarItem id="threads" label="Threads" icon={MessageSquareText} />
        <SidebarItem id="draft" label="Draft & Sent" icon={SendHorizonal} />
      </div>
    </div>
  )
}
