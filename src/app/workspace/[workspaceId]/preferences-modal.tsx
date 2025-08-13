'use client'

import { useState } from 'react'

import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

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
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useGetWrokspaceId } from '@/features/workspaces/hooks/use-get-workspace-id'
import { useConfirm } from '@/hooks/use-confirm'

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

  const [ConfirmDialog, confirmDeleteWorkspace] = useConfirm(
    'Are you sure?',
    "This action can't be undone.",
  )

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace()

  const handleEditWrorkspace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (value.trim() === initialValue) {
      setValue(initialValue)
      setEditOpen(false)
      return
    }

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

  const handleRemoveWrokspace = async () => {
    const ok = await confirmDeleteWorkspace()

    if (!ok) return

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess() {
          toast.success('Workspace removed.')
        },
        onError() {
          toast.error('Failed to remove workspace.')
        },
      },
    )
  }

  return (
    <>
      <Dialog
        open={open || isUpdatingWorkspace || isRemovingWorkspace}
        onOpenChange={setOpen}
      >
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle>{initialValue}</DialogTitle>
          </DialogHeader>

          <VisuallyHidden.Root>
            <DialogDescription>Your workspace preferences</DialogDescription>
          </VisuallyHidden.Root>

          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog
              open={editOpen || isUpdatingWorkspace}
              onOpenChange={setEditOpen}
            >
              <DialogTrigger asChild>
                <button className="flex w-full cursor-pointer flex-col rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="cursor-pointer text-sm font-semibold text-[#1264A3] outline-0 hover:underline">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{initialValue}</p>
                </button>
              </DialogTrigger>

              <VisuallyHidden.Root>
                <DialogDescription>
                  Remove your workspace to match your case.
                </DialogDescription>
              </VisuallyHidden.Root>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleEditWrorkspace} className="space-y-4">
                  <Input
                    disabled={isUpdatingWorkspace}
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
                        disabled={isUpdatingWorkspace}
                        variant="outline"
                        type="button"
                        onClick={() => setValue(initialValue)}
                      >
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button disabled={isUpdatingWorkspace} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              disabled={isRemovingWorkspace}
              className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-4 py-5 text-rose-600 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleRemoveWrokspace}
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </>
  )
}
