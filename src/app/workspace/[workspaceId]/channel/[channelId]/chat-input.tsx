'use client'

import { useRef } from 'react'

import dynamic from 'next/dynamic'
import type Quill from 'quill'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

type ChatInputProps = {
  placeholder?: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const innerRef = useRef<Quill | null>(null)

  return (
    <div className="w-full px-5">
      <Editor
        onSubmit={() => {}}
        disabled={false}
        placeholder={placeholder}
        innerRef={innerRef}
      />
    </div>
  )
}
