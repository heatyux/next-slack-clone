import { useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import type Quill from 'quill'
import { toast } from 'sonner'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../../../convex/_generated/dataModel'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

type CreateMessageValues = {
  workspaceId: Id<'workspaces'>
  conversationId: Id<'conversations'>
  body: string
  image?: Id<'_storage'>
}

interface ChatInputProps {
  placeholder?: string
  conversationId: Id<'conversations'>
}

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const innerRef = useRef<Quill | null>(null)

  const workspaceId = useWorkspaceId()

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
        workspaceId,
        conversationId,
        body,
        image: undefined,
      }

      if (image) {
        const url = await generateUploadUrl({ throwError: true })

        if (!url) {
          throw new Error('URL not found.')
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

      setEditorKey((prev) => prev + 1)
    } catch {
      toast.error('Failed to send message.')
    } finally {
      setIsPending(false)
      innerRef.current?.enable(true)
    }
  }

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        disabled={isPending}
        innerRef={innerRef}
        placeholder={placeholder}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
