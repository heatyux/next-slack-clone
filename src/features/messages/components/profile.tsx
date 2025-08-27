import { AlertTriangle, Loader, MailIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGetMember } from '@/features/members/api/use-get-member'

import type { Id } from '../../../../convex/_generated/dataModel'

interface ProfileProps {
  memberId: Id<'members'>
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading } = useGetMember({ id: memberId })

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Loader className="text-muted-foreground size-5 animate-spin" />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-y-2">
          <AlertTriangle className="text-muted-foreground size-5" />
          <p className="text-muted-foreground text-sm">Profile not found.</p>
        </div>
      </div>
    )
  }

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() ?? '? '

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Profile</p>
        <Button variant="ghost" size="iconSm" onClick={onClose}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="size-full max-h-[256px] max-w-[256px]">
          <AvatarImage src={member.user.image} alt={member.user.name} />
          <AvatarFallback className="aspect-square text-6xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
      </div>

      <Separator />

      <div className="flex flex-col p-4">
        <p className="mb-4 text-sm font-bold">Contact information</p>

        <div className="flex items-center gap-x-2">
          <div className="bg-muted flex size-9 items-center justify-center rounded-md">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-muted-foreground text-[13px] font-semibold">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm text-[#1264a3] hover:underline"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
