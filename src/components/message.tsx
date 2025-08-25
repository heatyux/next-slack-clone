import { format, isToday, isYesterday } from 'date-fns'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

import { useUpdateMessage } from '@/features/messages/api/use-update-message'
import { cn } from '@/lib/utils'

import type { Doc, Id } from '../../convex/_generated/dataModel'
import { Hint } from './hint'
import { Thumbnail } from './thumbnail'
import { Toolbar } from './toolbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface MessageProps {
  id: Id<'messages'>
  body: string
  image: string | null | undefined
  authorName?: string
  authorImage?: string
  isEditing: boolean
  setEditingId: (id: Id<'messages'> | null) => void
  isAuthor: boolean
  createdAt: Doc<'messages'>['_creationTime']
  updatedAt: Doc<'messages'>['updatedAt']
  isCompact: boolean
  hideThreadButton?: boolean
}

const Renderer = dynamic(() => import('./renderer'), { ssr: false })
const Editor = dynamic(() => import('./editor'), { ssr: false })

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`
}

export const Message = ({
  id,
  body,
  image,
  authorName,
  authorImage,
  isAuthor,
  isEditing,
  setEditingId,
  createdAt,
  updatedAt,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const { mutate: updateMessage, isPending } = useUpdateMessage()
  const avatarFallback = authorName?.charAt(0).toUpperCase()

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated.')
          setEditingId(null)
        },
        onError: () => {
          toast.error('Failed to update message.')
        },
      },
    )
  }

  if (isCompact) {
    return (
      <div
        className={cn(
          'group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
        )}
      >
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-muted-foreground w-[40px] text-center text-xs leading-[22px] opacity-0 group-hover:opacity-100 hover:underline">
              {format(createdAt, 'hh:mm')}
            </button>
          </Hint>

          {isEditing ? (
            <div className="size-full">
              <Editor
                variant="update"
                defaultValue={JSON.parse(body)}
                disabled={isPending}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <Renderer value={body} />
              <Thumbnail url={image} />

              {updatedAt ? (
                <span className="text-muted-foreground text-xs">(edited)</span>
              ) : null}
            </div>
          )}
        </div>

        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleReaction={() => {}}
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60',
        isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
      )}
    >
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>

        {isEditing ? (
          <div className="size-full">
            <Editor
              variant="update"
              defaultValue={JSON.parse(body)}
              disabled={isPending}
              onSubmit={handleUpdate}
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div className="flex w-full flex-col overflow-hidden">
            <div className="text-sm">
              <button
                onClick={() => {}}
                className="text-primary font-bold hover:underline"
              >
                {authorName}
              </button>

              <span>&nbsp;&nbsp;</span>

              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className="text-muted-foreground text-xs hover:underline">
                  {format(createdAt, 'hh:mm a')}
                </button>
              </Hint>
            </div>

            <Renderer value={body} />
            <Thumbnail url={image} />

            {updatedAt ? (
              <span className="text-muted-foreground text-xs">(edited)</span>
            ) : null}
          </div>
        )}
      </div>

      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
        />
      )}
    </div>
  )
}
