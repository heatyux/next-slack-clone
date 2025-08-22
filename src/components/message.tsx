import { format, isToday, isYesterday } from 'date-fns'
import dynamic from 'next/dynamic'

import type { Doc } from '../../convex/_generated/dataModel'
import { Hint } from './hint'
import { Thumbnail } from './thumbnail'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface MessageProps {
  body: string
  image: string | null | undefined
  authorName?: string
  authorImage?: string
  createdAt: Doc<'messages'>['_creationTime']
  updatedAt: Doc<'messages'>['updatedAt']
  isCompact: boolean
}

const Renderer = dynamic(() => import('./renderer'), { ssr: false })

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`
}

export const Message = ({
  body,
  image,
  authorName,
  authorImage,
  createdAt,
  updatedAt,
  isCompact,
}: MessageProps) => {
  const avatarFallback = authorName?.charAt(0).toUpperCase()

  if (isCompact) {
    return (
      <div className="group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-muted-foreground w-[40px] text-center text-xs leading-[22px] opacity-0 group-hover:opacity-100 hover:underline">
              {format(createdAt, 'hh:mm')}
            </button>
          </Hint>

          <div className="flex w-full flex-col">
            <Renderer value={body} />
            <Thumbnail url={image} />

            {updatedAt ? (
              <span className="text-muted-foreground text-xs">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} alt={authorName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>

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
      </div>
    </div>
  )
}
