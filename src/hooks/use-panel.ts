import { useParentMessageId } from '@/features/messages/store/use-parent-message-id'

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()

  const onOpenChange = (messageId: string) => {
    setParentMessageId(messageId)
  }

  const onClose = () => {
    setParentMessageId(null)
  }

  return {
    parentMessageId,
    onOpenChange,
    onClose,
  }
}
