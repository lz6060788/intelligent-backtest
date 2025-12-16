import { useVueFlow } from '@vue-flow/core'
import {
  BlockEnum,
  WorkflowRunningStatus,
} from '@/types'
import {
  useNodesSyncDraft,
  useWorkflowInteractions,
  useWorkflowRun,
  useWorkflowInstance,
} from '.'
import type { WorkflowRunParamsType } from '@/api/configs/workflow.types'

export const useWorkflowStartRun = (id?: string) => {
  const { instanceId, instance: workflowStore } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)
  const { handleCancelDebugAndPreviewPanel } = useWorkflowInteractions(instanceId)
  const { handleRun } = useWorkflowRun(instanceId)
  const { doSyncWorkflowDraft } = useNodesSyncDraft(instanceId)
  const { nodes } = store

  const handleWorkflowStartRun = async (params: WorkflowRunParamsType) => {
    const {
      workflowRunningData,
    } = workflowStore

    if (workflowRunningData.value?.result.status === WorkflowRunningStatus.Running)
      return

    const startNode = nodes.value.find(node => node.data.type === BlockEnum.Start || node.data.type === BlockEnum.OperatorStart)
    const startVariables = startNode?.data.type === BlockEnum.Start ? (startNode?.data.variables || []) : []
    const {
      // showDebugAndPreviewPanel,
      // setShowDebugAndPreviewPanel,
      setShowInputsPanel,
      // setShowEnvPanel,
    } = workflowStore

    // setShowEnvPanel(false)

    // if (showDebugAndPreviewPanel) {
    //   handleCancelDebugAndPreviewPanel()
    //   return
    // }

    if (!startVariables.length) {
      await doSyncWorkflowDraft()
      const res = await handleRun(params)
      // setShowDebugAndPreviewPanel(true)
      setShowInputsPanel(false)
      return res
    }
    else {
      // setShowDebugAndPreviewPanel(true)
      setShowInputsPanel(true)
    }
  }

  return {
    handleWorkflowStartRun,
  }
}
