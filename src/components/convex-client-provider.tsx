'use client'

import { PropsWithChildren } from 'react'

import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export const ConvexClientProvider = ({ children }: PropsWithChildren) => {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>
}
