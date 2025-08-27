import { format, isToday, isYesterday } from 'date-fns'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

import { useRemoveMessage } from '@/features/messages/api/use-remove-message'
import { useUpdateMessage } from '@/features/messages/api/use-update-message'
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction'
import { useConfirm } from '@/hooks/use-confirm'
import { usePanel } from '@/hooks/use-panel'
import { cn } from '@/lib/utils'

import type { Doc, Id } from '../../convex/_generated/dataModel'
import { Hint } from './hint'
import { Reactions } from './reactions'
import { ThreadBar } from './thread-bar'
import { Thumbnail } from './thumbnail'
import { Toolbar } from './toolbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface MessageProps {
  id: Id<'messages'>
  body: string
  image: string | null | undefined
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  authorName?: string
  authorImage?: string
  isEditing: boolean
  setEditingId: (id: Id<'messages'> | null) => void
  isAuthor: boolean
  createdAt: Doc<'messages'>['_creationTime']
  updatedAt: Doc<'messages'>['updatedAt']
  isCompact?: boolean
  hideThreadButton?: boolean
  threadName?: string
  threadImage?: string
  threadCount?: number
  threadTimestamp?: number
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
  reactions,
  authorName,
  authorImage,
  isAuthor,
  isEditing,
  setEditingId,
  createdAt,
  updatedAt,
  isCompact,
  hideThreadButton,
  threadName,
  threadImage,
  threadCount,
  threadTimestamp,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onClose } = usePanel()

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage()
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage()
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction()

  const [ConfirmDialog, confirm] = useConfirm(
    'Delete message',
    'Are you sure you want to deelte the message? This cannot be undone.',
  )

  const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction

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

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success('Message deleted.')

          if (parentMessageId === id) {
            onClose()
          }
        },
        onError: () => {
          toast.error('Failed to delete message.')
        },
      },
    )
  }

  const handleReaction = async (value: string) => {
    toggleReaction(
      {
        messageId: id,
        value,
      },
      {
        onError: () => {
          toast.error('Failed to toggle reaction.')
        },
      },
    )
  }

  if (isCompact) {
    return (
      <>
        <div
          className={cn(
            'group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60',
            isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
            isRemovingMessage &&
              'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200',
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
                  <span className="text-muted-foreground text-xs">
                    (edited)
                  </span>
                ) : null}

                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  name={threadName}
                  image={threadImage}
                  count={threadCount}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>

          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              handleThread={() => onOpenMessage(id)}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>

        <ConfirmDialog />
      </>
    )
  }

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage &&
            'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200',
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

              <Reactions data={reactions} onChange={handleReaction} />

              <ThreadBar
                name={threadName}
                image={threadImage}
                count={threadCount}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>

        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleDelete={handleDelete}
            handleThread={() => onOpenMessage(id)}
          />
        )}
      </div>

      <ConfirmDialog />
    </>
  )
}
