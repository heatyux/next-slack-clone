'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Loader, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useCurrentUser } from '../api/use-current-user'

export const UserButton = () => {
  const { signOut } = useAuthActions()
  const { data, isLoading } = useCurrentUser()

  if (isLoading) {
    return <Loader className="text-muted-foreground size-4 animate-spin" />
  }

  if (!data) {
    return null
  }

  const { name, image } = data

  const avatarFallback = name?.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 transition hover:opacity-75">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-sky-500 font-semibold text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" side="right" className="w-6">
        <DropdownMenuItem onClick={signOut} className="h-10">
          <LogOut className="mr-2 size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
