'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useCreateChannelModal } from '../store/use-create-channel-modal'

export const CreateChannelModal = () => {
  const [name, setName] = useState('')
  const [open, setOpen] = useCreateChannelModal()

  const handleClose = () => {
    setName('')
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()

    setName(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <Input
            disabled={false}
            value={name}
            onChange={handleChange}
            placeholder="e.g plan-budget"
            required
            autoFocus
            minLength={3}
            maxLength={20}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={false}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
