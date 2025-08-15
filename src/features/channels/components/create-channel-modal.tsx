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
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { useCreateChannel } from '../api/use-create-channel'
import { useCreateChannelModal } from '../store/use-create-channel-modal'

export const CreateChannelModal = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [name, setName] = useState('')
  const [open, setOpen] = useCreateChannelModal()

  const { mutate, isPending } = useCreateChannel()

  const handleClose = () => {
    setName('')
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()

    setName(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: (id) => {
          toast.success('Channel created!')
          router.push(`/workspace/${workspaceId}/channel/${id}`)
          handleClose()
        },
        onError: (error) => {
          console.error('[CREATE_CHANNEL]:', error)
          toast.error('Failed to create channel.')
        },
      },
    )
  }

  return (
    <Dialog open={open || isPending} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={isPending}
            value={name}
            onChange={handleChange}
            placeholder="e.g plan-budget"
            required
            autoFocus
            minLength={3}
            maxLength={20}
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
