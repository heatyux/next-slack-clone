'use client'

import { useRef, useState } from 'react'

import { Loader } from 'lucide-react'
import dynamic from 'next/dynamic'
import type Quill from 'quill'
import { toast } from 'sonner'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../../../convex/_generated/dataModel'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex h-[120px] items-center justify-center">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    )
  },
})

type CreateMessageValues = {
  body: string
  workspaceId: Id<'workspaces'>
  channelId: Id<'channels'>
  image?: Id<'_storage'>
}

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
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)
      innerRef.current?.enable(false)

      const values: CreateMessageValues = {
        body,
        workspaceId,
        channelId,
        image: undefined,
      }

      if (image) {
        const url = await generateUploadUrl({ throwError: true })

        if (!url) {
          throw new Error('Failed to generate upload url.')
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-type': image.type },
          body: image,
        })

        if (!result.ok) {
          throw new Error('Failed to upload image.')
        }

        const { storageId } = await result.json()

        values.image = storageId
      }

      await createMessage(values, { throwError: true })

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
