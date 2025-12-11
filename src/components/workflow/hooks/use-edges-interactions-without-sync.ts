import { useVueFlow } from '@vue-flow/core'
import { useWorkflowInstance } from './use-workflow-instance'

export const useEdgesInteractionsWithoutSync = (id?: string) => {
  const { instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)

  const handleEdgeCancelRunningStatus = () => {
    const {
      edges,
    } = store

    edges.value.forEach((edge) => {
      edge.data._sourceRunningStatus = undefined
      edge.data._targetRunningStatus = undefined
      edge.data._waitingRun = false
    })
  }

  return {
    handleEdgeCancelRunningStatus,
  }
}
