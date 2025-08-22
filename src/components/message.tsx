import { format, isToday, isYesterday } from 'date-fns'
import dynamic from 'next/dynamic'

import type { Doc } from '../../convex/_generated/dataModel'
import { Hint } from './hint'

interface MessageProps {
  body: string
  createdAt: Doc<'messages'>['_creationTime']
}

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false })

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`
}

export const Message = ({ body, createdAt }: MessageProps) => {
  return (
    <div className="group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60">
      <div className="flex items-start gap-2">
        <Hint label={formatFullTime(new Date(createdAt))}>
          <button className="text-muted-foreground w-[40px] text-center text-xs leading-[22px] opacity-0 group-hover:opacity-100 hover:underline">
            {format(createdAt, 'hh:mm')}
          </button>
        </Hint>
      </div>

      <Renderer value={body} />
    </div>
  )
}
