'use client'

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ImageIcon, Smile, XIcon } from 'lucide-react'
import Image from 'next/image'
import Quill, { type Delta, type Op, type QuillOptions } from 'quill'
import 'quill/dist/quill.snow.css'
import { MdSend } from 'react-icons/md'
import { PiTextAa } from 'react-icons/pi'

import { cn } from '@/lib/utils'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'
import { Button } from './ui/button'

type EditorValue = {
  image: File | null
  body: string
}

type EditorProps = {
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  variant?: 'create' | 'update'
  innerRef?: RefObject<Quill | null>
}

const Editor = ({
  onSubmit,
  onCancel,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  variant = 'create',
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const imageElementRef = useRef<HTMLInputElement | null>(null)
  const quillRef = useRef<Quill | null>(null)

  const placeholderRef = useRef(placeholder)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  const submitRef = useRef(onSubmit)

  useLayoutEffect(() => {
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
    submitRef.current = onSubmit
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options: QuillOptions = {
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                // TODO: Submit form
                return
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              },
            },
          },
        },
      },
      placeholder: placeholderRef.current,
      theme: 'snow',
    }

    const quill = new Quill(editorContainer, options)

    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      if (container) container.innerHTML = ''

      quill.off(Quill.events.TEXT_CHANGE)

      if (quillRef) quillRef.current = null
      if (innerRef) innerRef.current = null
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current)

    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  const onEmojiSelect = (emoji: any) => {
    // TODO: emoji type
    const quill = quillRef.current

    if (!quill) return

    quill.insertText(quill.getSelection()?.index || 0, emoji.native)
  }

  const isIOS = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent)

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        className="hidden"
        onChange={(e) => setImage(e.target.files![0])}
      />

      <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm">
        <div ref={containerRef} className="ql-renderer h-full"></div>

        {!!image && (
          <div className="p-2">
            <div className="group/image relative flex size-[62px] items-center justify-center">
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded image"
                fill
                className="overflow-hidden rounded-xl border object-cover"
              />
              <button
                onClick={() => {
                  setImage(null)
                  imageElementRef.current!.value = ''
                }}
                className="absolute -top-2.5 -right-2.5 hidden size-6 items-center justify-center rounded-full border-2 border-white bg-black/70 text-white group-hover/image:flex hover:bg-black"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="z-[5] flex px-2 pb-2">
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
          >
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} variant="ghost" size="iconSm">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === 'create' && (
            <Hint label={'Image'}>
              <Button
                disabled={disabled}
                variant="ghost"
                size="iconSm"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                onClick={onCancel}
                disabled={disabled}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                disabled={disabled}
                size="sm"
                className="bg-[#007A5A] text-white hover:bg-[#007A5A]/80"
                onClick={() => {}}
              >
                Save
              </Button>
            </div>
          )}

          {variant === 'create' && (
            <Button
              disabled={disabled}
              title="Send Message"
              size="iconSm"
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'text-muted-foreground bg-white hover:bg-white/80'
                  : 'bg-[#007A5A] text-white hover:bg-[#007A5A]/80',
              )}
              onClick={() => {}}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {variant === 'create' && (
        <div className="text-muted-foreground flex justify-end p-2 text-[10px]">
          <p>
            <strong>Shift + {isIOS ? 'Return' : 'Enter'}</strong> to add a new
            line.
          </p>
        </div>
      )}
    </div>
  )
}

export default Editor
