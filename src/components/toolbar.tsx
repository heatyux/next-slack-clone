import { MessageSquareText, Pencil, Smile, Trash } from 'lucide-react'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'
import { Button } from './ui/button'

interface ToolbarProps {
  isAuthor: boolean
  isPending: boolean
  handleEdit: () => void
  handleDelete: () => void
  handleReaction: (value: string) => void
  handleThread: () => void
  hideThreadButton?: boolean
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleReaction,
  handleThread,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji)}
        >
          <Button disabled={isPending} variant="ghost" size="iconSm">
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>

        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              disabled={isPending}
              variant="ghost"
              size="iconSm"
              onClick={handleThread}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Edit message">
            <Button
              disabled={isPending}
              variant="ghost"
              size="iconSm"
              onClick={handleEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}

        {isAuthor && (
          <Hint label="Delete message">
            <Button
              disabled={isPending}
              variant="ghost"
              size="iconSm"
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  )
}
