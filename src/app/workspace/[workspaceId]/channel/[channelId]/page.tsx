'use client'

import { Loader, TriangleAlert } from 'lucide-react'

import { MessageList } from '@/components/message-list'
import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { useChannelId } from '@/hooks/use-channel-id'

import { ChatInput } from './chat-input'
import { Header } from './header'

const ChannelIdPage = () => {
  const channelId = useChannelId()
  const { data: channel, isLoading: isChannelLoading } = useGetChannel({
    id: channelId,
  })
  const { results, status } = useGetMessages({ channelId })

  if (isChannelLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="text-muted-foreground flex h-full flex-1 flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-5" />
        <p className="text-sm">Channel not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header channelName={channel.name} />

      <MessageList data={results} />

      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  )
}

export default ChannelIdPage
