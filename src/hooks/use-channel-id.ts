import { useParams } from 'next/navigation'

import type { Id } from '../../convex/_generated/dataModel'

type ChannelParams = {
  channelId: Id<'channels'>
}

export const useChannelId = () => {
  const params = useParams<ChannelParams>()

  return params.channelId
}
