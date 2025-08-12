import { useParams } from 'next/navigation'

import { Id } from '../../../../convex/_generated/dataModel'

type WorkspaceIdParams = {
  workspaceId: Id<'workspaces'>
}

export const useGetWrokspaceId = () => {
  const params = useParams<WorkspaceIdParams>()

  return params.workspaceId
}
