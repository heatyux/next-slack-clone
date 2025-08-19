'use client'

import { Loader, TriangleAlert } from 'lucide-react'

import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useChannelId } from '@/hooks/use-channel-id'

import { ChatInput } from './chat-input'
import { Header } from './header'

const ChannelIdPage = () => {
  const channelId = useChannelId()
  const { data: channel, isLoading } = useGetChannel({ id: channelId })

  if (isLoading) {
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

      <div className="flex-1"></div>

      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  )
}

export default ChannelIdPage
