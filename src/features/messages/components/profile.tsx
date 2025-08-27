'use client'

import {
  AlertTriangle,
  ChevronDown,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetMember } from '@/features/members/api/use-get-member'
import { useRemoveMember } from '@/features/members/api/use-remove-member'
import { useUpdateMember } from '@/features/members/api/use-update-member'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import type { Id } from '../../../../convex/_generated/dataModel'

interface ProfileProps {
  memberId: Id<'members'>
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { data: currentMember, isLoading: isCurrnetMemberLoading } =
    useCurrentMember({ workspaceId })
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  })

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember()
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember()

  const disabled = isUpdatingMember || isRemovingMember

  const [UpdateDiglog, confirmUpdate] = useConfirm(
    'Change role',
    "Are you sure you want to change this member's role?",
  )
  const [LeaveDiglog, confirmLeave] = useConfirm(
    'Leave workspace',
    'Are you sure you want to leave this workspace?',
  )
  const [RemoveDiglog, confirmRemove] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member?',
  )

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate()

    if (!ok) {
      return null
    }

    updateMember(
      {
        id: memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success('Role changed.')
          onClose()
        },
        onError: () => {
          toast.error('Failed to change role.')
        },
      },
    )
  }

  const onLeave = async () => {
    const ok = await confirmLeave()

    if (!ok) {
      return null
    }

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast.success('You left the workspace.')
          router.replace('/')
          onClose()
        },
        onError: () => {
          toast.error('Failed to levat the workspace.')
        },
      },
    )
  }

  const onRemove = async () => {
    const ok = await confirmRemove()

    if (!ok) {
      return null
    }

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast.success('Member removed.')
          onClose()
        },
        onError: () => {
          toast.error('Failed to remove member.')
        },
      },
    )
  }

  if (isMemberLoading || isCurrnetMemberLoading) {
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

  if (!member || !currentMember) {
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
    <>
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

          {currentMember.role === 'admin' && currentMember._id !== memberId ? (
            <div className="mt-4 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={disabled}
                    variant="outline"
                    className="flex-1 capitalize"
                  >
                    {member.role} <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as 'admin' | 'member')
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                disabled={disabled}
                variant="outline"
                className="flex-1"
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          ) : currentMember._id === memberId &&
            currentMember.role !== 'admin' ? (
            <div className="mt-4">
              <Button
                disabled={disabled}
                variant="outline"
                className="w-full"
                onClick={onLeave}
              >
                Leave
              </Button>
            </div>
          ) : null}
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

      <UpdateDiglog />
      <LeaveDiglog />
      <RemoveDiglog />
    </>
  )
}
