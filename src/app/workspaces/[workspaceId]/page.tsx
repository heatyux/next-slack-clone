'use client'

import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWrokspaceId } from '@/features/workspaces/hooks/use-get-workspace-id'

const WorkspaceIdPage = () => {
  const workspaceId = useGetWrokspaceId()
  const { data } = useGetWorkspace({ id: workspaceId })

  return <>Workspace: {JSON.stringify(data)}</>
}

export default WorkspaceIdPage
