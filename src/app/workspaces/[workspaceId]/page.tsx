interface WorkspaceIdPageProps {
  params: Promise<{
    workspaceId: string
  }>
}

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const { workspaceId } = await params

  return <>WorkspaceId: {workspaceId}</>
}

export default WorkspaceIdPage
