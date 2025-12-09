import { useWorkflowInstance, useWorkflowUpdate } from '.'
// import type { WorkflowDataUpdater } from '@/app/components/workflow/types'

export const useWorkflowRefreshDraft = () => {
  // const { instance: workflowStore, instanceId } = useWorkflowInstance()
  const { handleUpdateWorkflowCanvas } = useWorkflowUpdate()

  const handleRefreshWorkflowDraft = () => {
    // const {
    //   appId,
    //   setSyncWorkflowDraftHash,
    //   setIsSyncingWorkflowDraft,
    //   setEnvironmentVariables,
    //   setEnvSecrets,
    //   setConversationVariables,
    // } = workflowStore
    // setIsSyncingWorkflowDraft(true)
    try {
      const data = localStorage.getItem('workflow_draft')
      if (data) {
        const graph = JSON.parse(data)
        handleUpdateWorkflowCanvas(graph)
      }
    } catch (e) {

    }
    // fetchWorkflowDraft(`/apps/${appId}/workflows/draft`).then((response) => {
    //   handleUpdateWorkflowCanvas(response.graph as WorkflowDataUpdater)
    //   setSyncWorkflowDraftHash(response.hash)
    //   setEnvSecrets((response.environment_variables || []).filter(env => env.value_type === 'secret').reduce((acc, env) => {
    //     acc[env.id] = env.value
    //     return acc
    //   }, {} as Record<string, string>))
    //   setEnvironmentVariables(response.environment_variables?.map(env => env.value_type === 'secret' ? { ...env, value: '[__HIDDEN__]' } : env) || [])
    //   setConversationVariables(response.conversation_variables || [])
    // }).finally(() => setIsSyncingWorkflowDraft(false))
  }

  return {
    handleRefreshWorkflowDraft,
  }
}
