import { useCallback, useMemo, useState } from 'react'

import { useMutation } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

type RequestType = {
  joinCode: string
  workspaceId: Id<'workspaces'>
}
type ResponseType = Id<'workspaces'> | null

type Options = {
  onSuccess?: (data: ResponseType) => void
  onError?: (error: Error) => void
  onSettled?: () => void
  thorwError?: boolean
}

export const useJoin = () => {
  const [data, setData] = useState<ResponseType | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<
    'pending' | 'success' | 'error' | 'settled' | null
  >(null)

  const isPending = useMemo(() => status === 'pending', [status])
  const isSuccess = useMemo(() => status === 'success', [status])
  const isError = useMemo(() => status === 'error', [status])
  const isSettled = useMemo(() => status === 'settled', [status])

  const mutation = useMutation(api.workspaces.join)

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setStatus('pending')
        setData(null)
        setError(null)

        const response = await mutation(values)
        setData(response)
        setStatus('success')
        options?.onSuccess?.(response)

        return response
      } catch (error) {
        setStatus('error')
        options?.onError?.(error as Error)

        if (!options?.thorwError) {
          throw error
        }
      } finally {
        setStatus('settled')
        options?.onSettled?.()
      }
    },
    [mutation],
  )

  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  }
}
