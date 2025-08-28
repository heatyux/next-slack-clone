'use client'

import { useState } from 'react'

import { Info, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'

export const Toolbar = () => {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const workspaceId = useWorkspaceId()

  const { data } = useGetWorkspace({ id: workspaceId })
  const { data: channels } = useGetChannels({ workspaceId })
  const { data: members } = useGetMembers({ workspaceId })

  const onChannelClick = (channelId: Id<'channels'>) => {
    setOpen(false)
    router.push(`/workspace/${workspaceId}/channel/${channelId}`)
  }

  const onMemberClick = (memberId: Id<'members'>) => {
    setOpen(false)
    router.push(`/workspace/${workspaceId}/member/${memberId}`)
  }

  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" aria-hidden />

      <div className="max-w-[642px] min-w-[280px] shrink grow-[2]">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 h-7 w-full justify-start px-2"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 size-4" />
          <span className="text-xs">Search {data?.name ?? 'Workspace'}...</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5" />
        </Button>
      </div>
    </nav>
  )
}
