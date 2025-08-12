'use client'

import { PropsWithChildren } from 'react'

import { Sidebar } from './sidebar'
import { Toolbar } from './toolbar'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh_-_40px)]">
        <Sidebar />

        {children}
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
