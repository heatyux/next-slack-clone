'use client'

import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

type ChatInputProps = {
  placeholder?: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  return (
    <div className="w-full px-5">
      <Editor placeholder={placeholder} />
    </div>
  )
}
