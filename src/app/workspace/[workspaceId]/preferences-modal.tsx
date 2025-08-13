'use client'

import { useState } from 'react'

import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useGetWrokspaceId } from '@/features/workspaces/hooks/use-get-workspace-id'

interface PreferencesModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialValue: string
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const workspaceId = useGetWrokspaceId()
  const [value, setValue] = useState(initialValue)
  const [editOpen, setEditOpen] = useState(false)

  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace()

  const handleEditWrorkspace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success('Workspace updated.')
          setEditOpen(false)
        },
        onError: () => {
          toast.error('Failed to update workspace.')
        },
      },
    )
  }

  return (
    <Dialog open={open || isPending} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="border-b bg-white p-4">
          <DialogTitle>{initialValue}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-2 px-4 pb-4">
          <Dialog open={editOpen || isPending} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className="flex w-full cursor-pointer flex-col rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm font-semibold">Workspace name</p>
                  <button className="cursor-pointer text-sm font-semibold text-[#1264A3] outline-0 hover:underline">
                    Edit
                  </button>
                </div>
                <p className="text-sm">{initialValue}</p>
              </div>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this workspace</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleEditWrorkspace} className="space-y-4">
                <Input
                  disabled={isPending}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={20}
                  placeholder="Workspace name e.g 'Work', 'Personal', 'Home"
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      disabled={isPending}
                      variant="outline"
                      type="button"
                      onClick={() => setValue(initialValue)}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button disabled={isPending} type="submit">
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <button className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-4 py-5 text-rose-600 hover:bg-gray-50">
            <Trash className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
