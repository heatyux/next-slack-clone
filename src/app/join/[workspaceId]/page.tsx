'use client'

import { useEffect, useMemo } from 'react'

import { Loader, Undo2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import VerificationInput from 'react-verification-input'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { useJoin } from '@/features/workspaces/api/use-join'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

const JoinWorkspaceIdPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })
  const { mutate, isPending } = useJoin()

  const isMember = useMemo(() => data?.isMember, [data?.isMember])

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`)
    }
  }, [isMember, router, workspaceId])

  const handleComplete = (value: string) => {
    mutate(
      { joinCode: value, workspaceId },
      {
        onSuccess: (id) => {
          toast.success('Workspace joined.')
          router.push(`/workspace/${id}`)
        },
        onError: () => {
          toast.error('Failed to join workspace.')
        },
      },
    )
  }

  if (isLoading || isMember) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
      <Image src="/logo.svg" alt="Logo" width={60} height={60} />

      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">
            Join {data?.name ?? 'Workspace'}
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join.
          </p>
        </div>

        <VerificationInput
          onComplete={handleComplete}
          validChars="A-Za-z0-9"
          length={6}
          classNames={{
            container: cn(
              'flex gap-x-2',
              isPending && 'opacity-50 cursor-not-allowed pointer-events-none',
            ),
            character:
              'uppercase h-auto rounded-md border border-gray-300 outline-rose-500 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
          autoFocus
        />
      </div>

      <div className="flex gap-x-4">
        <Button variant="outline" size="lg" asChild>
          <Link href="/">
            <Undo2 className="mr-2 size-4" /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default JoinWorkspaceIdPage
