'use client'

import { useEffect, useState } from 'react'

import { AlertTriangle, Loader } from 'lucide-react'
import { toast } from 'sonner'

import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation'
import { useMemberId } from '@/hooks/use-member-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../../../convex/_generated/dataModel'
import { Conversation } from './conversation'

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId()
  const memberId = useMemberId()

  const [conversationId, setConversationId] =
    useState<Id<'conversations'> | null>(null)

  const { mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess: (data) => setConversationId(data),
        onError: () => {
          toast.error('Failed to create or get conversation.')
        },
      },
    )
  }, [memberId, mutate, workspaceId])

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    )
  }

  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
        <AlertTriangle className="text-muted-foreground size-5" />
        <p className="text-muted-foreground text-sm">Conversation not found.</p>
      </div>
    )
  }

  return <Conversation id={conversationId} />
}

export default MemberIdPage
