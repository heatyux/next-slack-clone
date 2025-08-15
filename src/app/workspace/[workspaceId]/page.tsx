'use client'

import { useEffect, useMemo } from 'react'

import { Loader, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const WorkspaceIdPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [open, setOpen] = useCreateChannelModal()

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceInfo({
    id: workspaceId,
  })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  })

  const channelId = useMemo(() => channels?.[0]?._id, [channels])

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace) return

    if (channelId) {
      router.replace(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!open && !workspace.isMember) {
      setOpen(true)
    }
  }, [
    channelId,
    channelsLoading,
    open,
    router,
    setOpen,
    workspace,
    workspaceId,
    workspaceLoading,
  ])

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    )
  }

  if (!workspaceId || !workspace) {
    return (
      <div className="felx-col flex h-full flex-1 items-center justify-center gap-2 bg-[#5E2C5F]/95 text-white">
        <TriangleAlert className="size-6" />
        <span className="text-sm">Workspace not found.</span>
      </div>
    )
  }

  return (
    <div className="felx-col flex h-full flex-1 items-center justify-center gap-2 bg-[#5E2C5F]/95 text-white">
      <TriangleAlert className="size-6" />
      <span className="text-sm">No Channel(s) found.</span>
    </div>
  )
}

export default WorkspaceIdPage
