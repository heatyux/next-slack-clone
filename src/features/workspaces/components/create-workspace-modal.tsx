'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useCreateWorkspace } from '../api/use-create-workspace'
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'

export const CreateWorkspaceModal = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [open, setOpen] = useCreateWorkspaceModal()
  const { mutate, isPending } = useCreateWorkspace()

  const handleClose = () => {
    setOpen(false)
    setName('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await mutate(
      { name },
      {
        onSuccess: (workspaceId) => {
          toast.success('Workspace created!')
          router.push(`/workspace/${workspaceId}`)

          handleClose()
        },
        onError: (error) => {
          console.error('[CREATE_WORKSPACE]: ', error)
          toast.error('Failed to create workspace.')
        },
      },
    )
  }

  return (
    <Dialog open={open || isPending} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            maxLength={20}
            placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
