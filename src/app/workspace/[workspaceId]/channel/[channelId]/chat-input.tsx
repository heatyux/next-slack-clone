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

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    console.log({ body, image })
  }

  return (
    <div className="w-full px-5">
      <Editor
        onSubmit={handleSubmit}
        disabled={false}
        placeholder={placeholder}
        innerRef={innerRef}
      />
    </div>
  )
}
