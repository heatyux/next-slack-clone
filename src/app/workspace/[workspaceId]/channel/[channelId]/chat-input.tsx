'use client'

import { useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import type Quill from 'quill'
import { toast } from 'sonner'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

type ChatInputProps = {
  placeholder?: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editKey, setEditKey] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const innerRef = useRef<Quill | null>(null)

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const { mutate: createMessage } = useCreateMessage()

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)

      createMessage(
        {
          body,
          workspaceId,
          channelId,
        },
        {
          throwError: true,
        },
      )

      setEditKey((prevKey) => prevKey + 1)
    } catch {
      toast.error('Failed to create message.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full px-5">
      <Editor
        key={editKey}
        onSubmit={handleSubmit}
        disabled={isPending}
        placeholder={placeholder}
        innerRef={innerRef}
      />
    </div>
  )
}
