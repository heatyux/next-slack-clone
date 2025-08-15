'use client'

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from 'lucide-react'

import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { SidebarItem } from './sidebar-item'
import { UserItem } from './user-item'
import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId()

  const [, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels } = useGetChannels({ workspaceId })
  const { data: members } = useGetMembers({ workspaceId })

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

      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            id={channel._id}
            label={channel.name}
            icon={HashIcon}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct Messages"
        hint="New Direct Message"
        onNew={member.role === 'admin' ? () => {} : undefined}
      >
        {members?.map((member) => (
          <UserItem
            key={member._id}
            id={member._id}
            label={member.user.name}
            image={member.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
}
