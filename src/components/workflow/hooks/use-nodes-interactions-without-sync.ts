import { useVueFlow } from '@vue-flow/core'
import { useWorkflowInstance } from './use-workflow-instance'
import { NodeRunningStatus } from '@/types'

export const useNodesInteractionsWithoutSync = (id?: string) => {
  const { instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)

  const handleNodeCancelRunningStatus = () => {
    const {
      nodes,
      } = store

    nodes.value.forEach((node) => {
      node.data._runningStatus = undefined
      node.data._waitingRun = false
    })
  }

  const handleCancelAllNodeSuccessStatus = () => {
    const {
      nodes,
    } = store

    nodes.value.forEach((node) => {
      if(node.data._runningStatus === NodeRunningStatus.Succeeded)
        node.data._runningStatus = undefined
    })
  }

  const handleCancelNodeSuccessStatus = (nodeId: string) => {
    const {
      nodes,
    } = store

    const node = nodes.value.find(n => n.id === nodeId)
    if (node && node.data._runningStatus === NodeRunningStatus.Succeeded) {
      node.data._runningStatus = undefined
      node.data._waitingRun = false
    }
  }

  return {
    handleNodeCancelRunningStatus,
    handleCancelAllNodeSuccessStatus,
    handleCancelNodeSuccessStatus,
  }
}
