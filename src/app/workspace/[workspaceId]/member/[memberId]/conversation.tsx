import { Loader } from 'lucide-react'

import { MessageList } from '@/components/message-list'
import { useGetMember } from '@/features/members/api/use-get-member'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { useMemberId } from '@/hooks/use-member-id'

import type { Id } from '../../../../../../convex/_generated/dataModel'
import { ChatInput } from './chat-input'
import { Header } from './header'

interface ConversationProps {
  id: Id<'conversations'>
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId()

  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  })

  const { results, status, loadMore } = useGetMessages({ conversationId: id })

  if (isLoadingMember || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="text-muted-foreground size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />

      <MessageList
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />

      <ChatInput
        conversationId={id}
        placeholder={`Message ${member?.user.name}`}
      />
    </div>
  )
}
