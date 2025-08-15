import { useState } from 'react'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Trash } from 'lucide-react'
import { FaChevronDown } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  channelName: string
}

export const Header = ({ channelName }: HeaderProps) => {
  const [value, setValue] = useState('')
  const [editOpen, setEditOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()

    setValue(value)
  }

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-auto overflow-hidden px-2 text-lg font-semibold"
          >
            <span className="truncate"># {channelName}</span>
            <FaChevronDown className="ml-2 size-2.5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle># {channelName}</DialogTitle>

            <VisuallyHidden.Root>
              <DialogDescription>Your channel preferences</DialogDescription>
            </VisuallyHidden.Root>
          </DialogHeader>

          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <button
                  disabled={false}
                  className="felx w-full cursor-pointer flex-col rounded-lg border bg-white px-5 py-4 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    <p className="text-sm font-semibold text-[#1264A3] hover:underline">
                      Edit
                    </p>
                  </div>

                  <p className="text-sm"># {channelName}</p>
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>

                  <VisuallyHidden.Root>
                    <DialogDescription>
                      Rename this channel to match your case.
                    </DialogDescription>
                  </VisuallyHidden.Root>
                </DialogHeader>

                <form className="space-y-4">
                  <Input
                    disabled={false}
                    value={value}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={20}
                    placeholder="e.g. plan-budget"
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button disabled={false} variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button disabled={false} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              disabled={false}
              className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50 disabled:pointer-events-none disabled:bg-gray-50"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
