import { format, isToday, isYesterday } from 'date-fns'

import type { GetMessagesReturnType } from '@/features/messages/api/use-get-messages'

import { Message } from './message'

interface MessageListProps {
  data: GetMessagesReturnType | undefined
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)

  if (isToday(date)) {
    return 'Today'
  }

  if (isYesterday(date)) {
    return 'Yesterday'
  }

  return format(date, 'EEEE, MMMM d')
}

export const MessageList = ({ data }: MessageListProps) => {
  // groupedMessages: { '2025-04-03': [message1, message2] }
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date, 'yyyy-MM-dd')

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)

      return groups
    },
    {} as Record<string, typeof data>,
  )

  return (
    <div className="message-scrollbar flex flex-1 flex-col overflow-y-auto pb-4">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="relative my-2 text-center">
            <hr className="absolute top-1/2 right-0 left-0 border-t border-gray-300" />
            <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>

          {messages.map((message) => (
            <Message
              key={message._id}
              body={message.body}
              createdAt={message._creationTime}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
