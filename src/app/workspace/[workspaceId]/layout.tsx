'use client'

import { PropsWithChildren } from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { Sidebar } from './sidebar'
import { Toolbar } from './toolbar'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh_-_40px)]">
        <Sidebar />

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="slack-clone-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            workspace sidebar
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
