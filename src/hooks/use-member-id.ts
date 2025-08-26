import { useParams } from 'next/navigation'

import type { Id } from '../../convex/_generated/dataModel'

type MemberParams = {
  memberId: Id<'members'>
}

export const useMemberId = () => {
  const params = useParams<MemberParams>()

  return params.memberId
}
