'use client'

import { useEffect, useRef } from 'react'

import { ImageIcon, Smile } from 'lucide-react'
import Quill, { type QuillOptions } from 'quill'
import { PiTextAa } from 'react-icons/pi'

import { Hint } from './hint'
import { Button } from './ui/button'

type EditorProps = {
  placeholder?: string
}

const Editor = ({}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options: QuillOptions = {}

    new Quill(editorContainer, options)

    return () => {
      if (container) container.innerHTML = ''
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition">
        <div ref={containerRef} className="ql-render h-full"></div>
        <div className="z-[5] flex px-2 pb-2">
          <Hint label={'Hide formatting'}>
            <Button variant="ghost" size="iconSm">
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label={'Emoji'}>
            <Button variant="ghost" size="iconSm">
              <Smile className="size-4" />
            </Button>
          </Hint>
          <Hint label={'Image'}>
            <Button variant="ghost" size="iconSm">
              <ImageIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </div>
  )
}

export default Editor
