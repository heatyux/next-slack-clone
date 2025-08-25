import { useState } from 'react'

import { AlertTriangle, Loader, XIcon } from 'lucide-react'

import { Message } from '@/components/message'
import { Button } from '@/components/ui/button'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'
import { useGetMessage } from '../api/use-get-message'

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => void
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId()

  const { data: currentMember } = useCurrentMember({ workspaceId })

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)

  const { data: message, isLoading } = useGetMessage({ id: messageId })

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Thread</p>

          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full items-center justify-center">
          <Loader className="text-muted-foreground size-5 animate-spin" />
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Thread</p>

          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex h-full flex-col items-center justify-center gap-y-2">
          <AlertTriangle className="text-muted-foreground size-5" />
          <p className="text-muted-foreground text-sm">Messaga not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>

        <Button variant="ghost" size="iconSm" onClick={onClose}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>

      <div>
        <Message
          id={message._id}
          body={message.body}
          image={message.image}
          reactions={message.reactions}
          authorName={message.user.name}
          authorImage={message.user.image}
          isAuthor={message.memberId === currentMember?._id}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          hideThreadButton
        />
      </div>
    </div>
  )
}
