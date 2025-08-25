'use client'

import { PropsWithChildren } from 'react'

import { Loader } from 'lucide-react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Thread } from '@/features/messages/components/thread'
import { usePanel } from '@/hooks/use-panel'

import type { Id } from '../../../../convex/_generated/dataModel'
import { Sidebar } from './sidebar'
import { Toolbar } from './toolbar'
import { WorkspaceSidebar } from './workspace-sidebar'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
  const { parentMessageId, onClose } = usePanel()

  const showPanel = !!parentMessageId

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
            <WorkspaceSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={20}>{children}</ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="text-muted-foreground size-5 animate-spin" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout
